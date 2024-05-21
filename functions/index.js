const functions = require("firebase-functions");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const firebaseConfig = {
  apiKey: "AIzaSyD856_p6ESQJoYx8qMXtkWPe5eZLpG1WsQ",
  authDomain: "leconnectionsarchive.firebaseapp.com",
  projectId: "leconnectionsarchive",
  appId: "1:1088319996346:web:6b2756886d563b81e19d83",
};
admin.initializeApp(firebaseConfig);

const firestore = admin.firestore();

// Core function to publish data
async function publishData(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Invalid data format');
  }

  const batch = firestore.batch();

  data.forEach((item, index) => {
    if (item.imgs && item.title && item.players) {
        const dateRef = firestore.collection('nbaData').doc(item.date);
        const itemRef = dateRef.collection('items').doc(`item-${index}`);
        batch.set(itemRef, item);
    }
});

  await batch.commit();
  return 'Data published successfully';
}

// Cloud Function handler
exports.publishData = functions.https.onRequest(async (req, res) => {
  try {
    const data = req.body;
    const result = await publishData(data);
    res.status(200).send(result);
  } catch (error) {
    logger.error('Error publishing data', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = { publishData }; // Export the core function
