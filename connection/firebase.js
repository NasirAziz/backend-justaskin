require("dotenv").config();

const firebaseAdminSdk = require("firebase-admin"),
  firebaseAdminApp = firebaseAdminSdk.initializeApp({
    credential: firebaseAdminSdk.credential.cert(
      JSON.parse(
        Buffer.from(process.env.SERVICE_CONFIG, "base64").toString("ascii")
      )
    ),
  });

module.exports = firebaseAdminApp;
