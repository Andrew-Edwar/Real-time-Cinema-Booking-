const admin = require('firebase-admin');
const serviceAccount = require('../../../sw-2-313b8-firebase-adminsdk-uqhib-83ed87649d.json');
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