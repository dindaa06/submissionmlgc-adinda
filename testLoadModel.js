const tf = require('@tensorflow/tfjs-node');
require('dotenv').config();

async function testLoadModel() {
    const modelUrl = process.env.MODEL_URL;

    try {
        const model = await tf.loadGraphModel(modelUrl);
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
    }
}

testLoadModel();
