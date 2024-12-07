const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

// Fungsi untuk memprediksi klasifikasi gambar (Cancer vs Non-cancer)
async function predictClassification(model, image) {
    try {
        // Menyiapkan gambar (mengubahnya menjadi tensor)
        const tensor = tf.node
            .decodeJpeg(image)  // Mendekode gambar JPEG
            .resizeNearestNeighbor([224, 224])  // Mengubah ukuran gambar
            .expandDims()  // Menambahkan dimensi batch
            .toFloat();  // Menjadikan tensor dalam format float

        // Melakukan prediksi menggunakan model
        const prediction = model.predict(tensor);
        const score = await prediction.data();  // Menunggu hasil prediksi
        const confidenceScore = Math.max(...score) * 100;  // Mendapatkan confidence score tertinggi

        // Menentukan label berdasarkan klasifikasi
        let label, suggestion;

        // Logika hasil prediksi berdasarkan score
        if (confidenceScore > 50) {  // Jika skor lebih dari 50%, prediksi "Cancer"
            label = 'Cancer';
            suggestion = 'Segera periksa ke dokter!';
        } else {  // Jika skor di bawah 50%, prediksi "Non-cancer"
            label = 'Non-cancer';
            suggestion = 'Penyakit kanker tidak terdeteksi.';
        }

        // Mengembalikan hasil dalam format yang diinginkan
        return {
            confidenceScore,  // Skor keyakinan tertinggi
            label,            // Label hasil prediksi (Cancer atau Non-cancer)
            suggestion        // Saran untuk pengguna berdasarkan hasil
        };

    } catch (error) {
        // Menangani kesalahan input atau prediksi
        console.error('Error during prediction:', error.message);
        throw new InputError(`Terjadi kesalahan dalam melakukan prediksi: ${error.message}`);
    }
}

module.exports = predictClassification;
