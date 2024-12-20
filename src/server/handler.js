const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');  

async function postPredictHandler(request, h) {
  const { image } = request.payload; 
  const { model } = request.server.app;  

  let confidenceScore, label, suggestion;

  try {
    const result = await predictClassification(model, image);
    confidenceScore = result.confidenceScore;
    label = result.label;
    suggestion = result.suggestion;
  } catch (error) {
    console.error('Error during prediction:', error);
    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi',
    }).code(400);  
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    result: label,  
    suggestion,
    createdAt
  };

  try {
    await storeData(id, data); 
  } catch (error) {
    console.error('Error while saving to database:', error);
    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan saat menyimpan hasil prediksi ke database.',
    }).code(500);  
  }

  const message = "Model is predicted successfully";

  const response = h.response({
    status: 'success',
    message: message,
    data: {
      id,
      result: label,
      suggestion: suggestion,
      createdAt
    }
  });

  response.code(201);  
  return response;
}

module.exports = postPredictHandler;
