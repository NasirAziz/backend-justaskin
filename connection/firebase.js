require("dotenv").config();

const firebaseAdminSdk = require("firebase-admin"),
  firebaseAdminApp = firebaseAdminSdk.initializeApp({
    credential: firebaseAdminSdk.credential.cert(JSON.parse(Buffer.from(process.env.SERVICE_CONFIG, "base64").toString("ascii"))),
    storageBucket: process.env.BUCKET_NAME,
  });

module.exports = firebaseAdminApp;
