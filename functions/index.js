const functions = require("firebase-functions");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { merge } = require("jquery");
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

  // Get today's date as a string in the format 'YYYY-MM-DD'
  const today = new Date();
  const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  data.forEach((item) => {
    if (item.title && item.players) {
      item.players.forEach((player, index) => {
        const playerRef = firestore.collection('nbaData').doc('connections').collection(item.title).doc(`${player.firstName}-${player.lastName}`);
        const connectionRef =firestore.collection('nbaData').doc('players').collection(`${player.firstName}-${player.lastName}`).doc(item.title);
        batch.set(playerRef, { ...player, connection: item }, { merge: true });
        batch.set(connectionRef, { ...player, connection: item }, { merge: true });
    });
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
