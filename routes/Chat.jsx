const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();

const serverTime = admin.firestore.FieldValue.serverTimestamp();

router.use(express.json()); // for application/json
router.use(express.urlencoded());

const db = admin.firestore();

router.post('/storeMessage', async (req, res) => {
  try {
    const senderEmail = req.body.sender.email;
    const receiverEmail = req.body.receiver.email;
    const messageText = req.body.text;
    const chatId = [senderEmail, receiverEmail].sort().join('|');
    const messagesRef = db.collection('chatUsers').doc(chatId).collection('messages');
    await messagesRef.add({
      text: messageText,
      sender: req.body.sender,
      receiver: req.body.receiver,
      timestamp: serverTime
    });
    const chatRef = db.collection('chatUsers').doc(chatId);
    await chatRef.set({
      chatId: chatId
    });

    res.status(200).json({ message: 'Message stored successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
function getUserDetails(email) {
  let promise = new Promise((resolve, reject) => {
  let query = db.collection('users');
  query = query.where('email', '==', email);
  query.get().then(snapshot => {
    snapshot.forEach(doc => {
      console.log(doc.data());
    });
    resolve(snapshot.docs[0].data())
  }).catch(err => {
    console.log('Error getting documents', err);
    resolve(true);
  });
});
return promise;

}

router.post('/getMessages', async (req, res) => {
  try {
    const senderEmail = req.body.senderEmail;
    const receiverEmail = req.body.receiverEmail;
    const chatId = req.body.chatId;
    const messagesRef = db.collection('chatUsers').doc(chatId).collection('messages');
    const messagesSnapshot = await messagesRef.orderBy('timestamp', 'asc').get();
    const messages = [];
    messagesSnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        text: doc.data().text,
        sender: doc.data().sender,
        timestamp: doc.data().timestamp.toDate()
      });
    });

    res.status(200).json({ messages: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/getChatList', async (req, res) => {
  try {
    const currentUserEmail = req.body.email;
    const chatUsersRef = db.collection('chatUsers');
    const chatUsersSnapshot = await chatUsersRef.get();
    const chatList = [];

    // chatUsersSnapshot.forEach((doc) => {
    //   const chatId = doc.id;
    //   const a = doc.data();
    //   console.log(a)
    //   const [email1, email2] = chatId.split('|');

    //   if (email1 === currentUserEmail || email2 === currentUserEmail) {
    //     const chatPartnerEmail = email1 === currentUserEmail ? email2 : email1;
    //     const obj = await getUserDetails(chatPartnerEmail);
    //     chatList.push({
    //       chatId: chatId,
    //       chatPartnerEmail: chatPartnerEmail,
    //       userObj: obj,
    //     });

    //   }
    // });
    // for (let i = 0; i < chatUsersSnapshot.docs.length; i++) {
    //   const doc = chatUsersSnapshot.docs[i];
    //   const chatId = doc.id;
    //   const a = doc.data();
    //   console.log(a);
    //   const [email1, email2] = chatId.split('|');
    
    //   if (email1 === currentUserEmail || email2 === currentUserEmail) {
    //     const chatPartnerEmail = email1 === currentUserEmail ? email2 : email1;
    //     const obj = await getUserDetails(chatPartnerEmail);
    //     chatList.push({
    //       chatId: chatId,
    //       chatPartnerEmail: chatPartnerEmail,
    //       userObj: obj,
    //     });
    //   }
    // }
    // res.status(200).json({ chatList: chatList });
    const promises = [];

    for (let i = 0; i < chatUsersSnapshot.docs.length; i++) {
      const doc = chatUsersSnapshot.docs[i];
      const chatId = doc.id;
      const a = doc.data();
      console.log(a);
      const [email1, email2] = chatId.split('|');
  
      if (email1 === currentUserEmail || email2 === currentUserEmail) {
        const chatPartnerEmail = email1 === currentUserEmail ? email2 : email1;
        const promise =  getUserDetails(chatPartnerEmail);
        promises.push(promise);
        chatList.push({
          chatId: chatId,
          chatPartnerEmail: chatPartnerEmail,
        });
      }
    }
    const userObjs = await Promise.all(promises);
    for (let i = 0; i < userObjs.length; i++) {
      chatList[i].userObj = userObjs[i];
    }
    res.status(200).json({ chatList: chatList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;