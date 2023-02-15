var nodemailer = require("nodemailer");
const express = require("express");
require("dotenv").config();
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
        type: "OAuth2",
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
        clientId:
          process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        refreshToken: process.env.REFRESHTOKEN,
        accessToken: process.env.ACCESSTOKEN,
        expires: 1484314697598
      },
    });

    var mailOptions = {
      from: "umerk7222@gmail.com",
      to: email,
      subject: "Subject: Welcome to Jus Askin!",
     text: `   
      Dear,
      
      We are thrilled to have you on board as a new member of Jus Askin! We are excited to share our platform with you and help you make the most out of it.
      At Jus Askin, we are dedicated to providing you with an easy and convenient way to ask and receive answers to your questions with valuable content. 
      Our community of knowledgeable individuals is always here to help, and we believe that you will find the information you need in no time.
      
      Thank you for signing up and we look forward to your participation in our community. 
      If you have any questions or feedback, please don't hesitate to reach out to us. We are always here to help.
      
      Best regards,
      The Jus Askin Team`,
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
