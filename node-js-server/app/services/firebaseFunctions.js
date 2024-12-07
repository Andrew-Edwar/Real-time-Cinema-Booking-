const admin = require('firebase-admin');
const serviceAccount = require('../../../sw-2-313b8-firebase-adminsdk-uqhib-7b3dc51997.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

function sendFCMNotification(title, body, token) {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  return admin.messaging().send(message);
}

module.exports = {
  sendFCMNotification,
};
