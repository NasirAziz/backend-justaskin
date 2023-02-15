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
      html: `<!DOCTYPE html> <html> <head> <title>Welcome to Jus Askin</title> </head> <body> <h1>Hello!</h1> <p>Thank you for subscribing to Jus Askin! We are thrilled to have you on board and can't wait to share our platform with you.</p> <p>As we approach our upcoming launch, we wanted to give you a sneak peek into some of the exciting features we have in store for you. With Jus Askin, you will have access to a community of knowledgeable individuals who are always ready to help you with valuable content. You can ask questions and receive answers quickly and easily, no matter where you are.</p> <p>Our platform is designed to make it easy and convenient for you to get the information you need. With Jus Askin, you can search for questions on a wide range of topics, connect with other users who share your interests, and gain insights from experts in your field.</p> <p>We are excited to have you join our community and look forward to your participation. If you have any questions or feedback, please don't hesitate to reach out to us. We are always here to help.</p> <p>Thank you again for subscribing to Jus Askin. We can't wait to see you on the platform soon!</p> <p>Best regards,</p> <p>The Jus Askin Team</p> </body> </html>`,
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
