const express = require("express");
require("dotenv").config();
const admin = require("firebase-admin");
const router = express.Router();
const db = admin.firestore();
router.use(express.json()); // for application/json
router.use(express.urlencoded());
router.get("/subscribeusers", (req, res) => {
    try{
        db.collection("subscribeusers")
        .get()
        .then((snapshot) => {
            console.log(snapshot);
            const tempDoc = snapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() };
            });
            // res.status(200).send(tempDoc);
      res.status(200).json(tempDoc);

        })
        .catch((reason) => {
            res.status(500).send(reason);
        });
    }
    catch(e){
        res.status(500).send(e);
    }
    
        // res.status(200).send("tempDoc");

});

module.exports = router;
