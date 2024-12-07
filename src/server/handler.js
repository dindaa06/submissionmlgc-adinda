const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');  // Fungsi untuk menyimpan data ke DB

async function postPredictHandler(request, h) {
  const { image } = request.payload;  // Gambar yang dikirimkan oleh pengguna
  const { model } = request.server.app;  // Model yang dimuat di server

  let confidenceScore, label, suggestion;

  try {
    // Melakukan prediksi menggunakan layanan inferenceService
    const result = await predictClassification(model, image);
    confidenceScore = result.confidenceScore;
    label = result.label;
    suggestion = result.suggestion;
  } catch (error) {
    console.error('Error during prediction:', error);
    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi, silakan coba lagi dengan gambar yang sesuai.',
    }).code(400);  // Status 400 untuk error pada prediksi
  }

  // Membuat ID unik untuk dokumen (menggunakan UUID)
  const id = crypto.randomUUID();

  // Waktu saat prediksi dilakukan
  const createdAt = new Date().toISOString();

  // Data yang akan disimpan di database dan juga dikirimkan dalam respons
  const data = {
    id,
    result: label,  // Menggunakan label yang didapatkan dari predictClassification
    suggestion,
    createdAt
  };

  // Menyimpan hasil prediksi ke dalam database (gunakan storeData untuk menyimpan ke DB)
  try {
    await storeData(id, data);  // Fungsi storeData harus mengatur penyimpanan ke database
  } catch (error) {
    console.error('Error while saving to database:', error);
    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan saat menyimpan hasil prediksi ke database.',
    }).code(500);  // Status 500 untuk kesalahan server internal
  }

  // Menyiapkan respons API sesuai dengan ketentuan
  const message = confidenceScore > 99 
    ? 'Model is predicted successfully.'
    : 'Model is predicted successfully but under threshold. Please use the correct picture';

  const response = h.response({
    status: 'success',
    message: message,
    data: {
      id,
      result: label,  // Menyertakan hasil prediksi
      suggestion,
      createdAt
    }
  });

  response.code(201);  // Kode status 201 untuk pembuatan data baru
  return response;
}

module.exports = postPredictHandler;
