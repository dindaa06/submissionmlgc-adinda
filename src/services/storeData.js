const { Firestore } = require('@google-cloud/firestore');

// Fungsi untuk menyimpan data ke Firestore
async function storeData(id, data) {
  const db = new Firestore();
  
  try {
    console.log(`Menyimpan data dengan ID: ${id}`);
    const predictCollection = db.collection('predictions');
    await predictCollection.doc(id).set(data);
    console.log('Data berhasil disimpan ke Firestore');
  } catch (error) {
    console.error('Error while saving to Firestore:', error);
    throw new Error('Terjadi kesalahan saat menyimpan data ke database: ' + error.message);
  }
}

module.exports = storeData;
