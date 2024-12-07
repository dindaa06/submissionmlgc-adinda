const { Firestore } = require('@google-cloud/firestore');

async function testFirestoreConnection() {
  const db = new Firestore();
  try {
    const docRef = db.collection('predictions').doc('test-doc');
    await docRef.set({
      name: 'Test Document',
      timestamp: new Date(),
    });
    console.log('Test document successfully written!');
  } catch (error) {
    console.error('Error writing test document:', error);
  }
}

testFirestoreConnection();
