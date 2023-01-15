require("dotenv").config();

const config = process.env.SERVICE_CONFIG;

const firebaseAdminSdk = require("firebase-admin"),
  firebaseAdminApp = firebaseAdminSdk.initializeApp({
    credential: firebaseAdminSdk.credential.cert(
      JSON.parse(
        Buffer.from(process.env.SERVICE_CONFIG, "base64").toString("ascii")
      )
    ),
  });
// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MSG_ID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MEASURE_ID,
// };
// admin.initializeApp(firebaseConfig);

module.exports = firebaseAdminApp;
