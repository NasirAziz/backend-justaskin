const admin = require("firebase-admin");
require("dotenv").config();
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MSG_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASURE_ID,
};
admin.initializeApp(firebaseConfig);

module.exports = admin;
