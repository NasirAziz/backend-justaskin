var nodemailer = require("nodemailer");
const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();
const db = admin.firestore();
router.use(express.json()); // for application/json
router.use(express.urlencoded());
const sendEmail = (email) => {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "umerk7222@gmail.com",
        pass: "jvprxbymrzzvyzcg",
      },
    });

    var mailOptions = {
      from: "umerk7222@gmail.com",
      to: email,
      subject: "Sending Email using Node.js",
      text: "That was easy!",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
// sendEmail();
router.post("/sendemail", (req, res) => {
  console.log(req.body.email);
  const email = req.body.email;
  if (email) {
    const sent = sendEmail(email);
    if (sent) {
      res.status(200).json("Success");
    } else {
      res.status(500).json("Error");
    }
  } else {
    res.status(500).json("provie email to sent");
  }
});
module.exports = router;
