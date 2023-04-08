const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();
const db = admin.firestore();

router.use(express.json()); // for application/json
router.use(express.urlencoded());

var professionalDetailsObject = {
  ID: "",
  Name: "",
  DoB: "",
  Rating: "",
  Description: "",
  Qualifications: "",
  Experience: "",
  AnswersIDs: [],
  ResourcesIDs: [],
  SchedulingIDs: [],
  Pricing: "",
  ProfilePicture: "",
};

const studentDetailsObject = {
  ID: "",
  Name: "",
  DoB: "",
  AreasOfInterest: [],
  GroupsIDs: [],
  ResourcesIDs: [],
  ConnectionsIDs: [],
  Points: 0,
  BadgesIDs: [],
  CoursesIDs: [],
  BlogPostIDs: [],
  PodcastIDs: [],
  ProfilePicture: "",
};


router.post("/login", (req, res) => {
  console.log(req.body);
  db.collection("users")
    .where("email", "==", req.body.email)
    .where("password", "==", req.body.password)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("Not Found!");
        res.status(404).json("Email or password is wrong");
      } else {
        console.log("Name and email match!");
        const docData = snapshot.docs[0].data();
        const docId = snapshot.docs[0].id;
        const doc = { id: docId, ...docData };
        res.status(200).json(doc);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

router.get("/getuserdetail/:id", (req, res) => {
  const collectionRef = db.collection("studentDetails");
  const id = req.params.id;
  const docRef = collectionRef.doc(id);
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        res.json(doc.data());
      } else {
        res.status(404).send("Document not found");
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// POST route to add a new user
router.post("/signup", (req, res) => {
  console.log(req.body);
  db.collection("users")
    .where("email", "==", req.body.email)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        db.collection("users")
          .add({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type,
          })
          .then((data) => {
            console.log(data.id);
            if (req.body.type === "Profesional") {
              professionalDetailsObject.ID = data.id;
              professionalDetailsObject.Name = req.body.username;
              db.collection("professionalDetails")
                .doc(data.id)
                .set(professionalDetailsObject);
              res.json({ message: "user added success" });
            } else if (req.body.type === "Student") {
              studentDetailsObject.ID = data.id;
              studentDetailsObject.Name = req.body.username;
              db.collection("studentDetails")
                .doc(data.id)
                .set(studentDetailsObject);
              res.json({ message: "user added success" });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send(err);
          });
      } else {
        res.status(400).json({ message: "Email already exists" });
      }
    });
});

router.post('/addtofvt', async (req, res) => {
  try {
    const currentUserEmail = req.body.email;
    const fvtObject = req.body.userobject;
    // const chatId = [senderEmail, receiverEmail].sort().join('|');
    const fvtRef = db.collection('fvtDoc').doc(currentUserEmail).collection('fvt');
    await fvtRef.add(fvtObject);
    const chatRef = db.collection('fvtDoc').doc(currentUserEmail);
    await chatRef.set({
      currentUserEmail: currentUserEmail
    });

    res.status(200).json({ message: 'Added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/getfvt', async (req, res) => {
  try {
    const email = req.body.email;
    const fvtSnap = db.collection('fvtDoc').doc(email).collection('fvt');
    const fvtSnapShot = await fvtSnap.get();
    const fvtDocuments = [];
    fvtSnapShot.forEach((doc) => {
      fvtDocuments.push(doc.data());

    });

    res.status(200).json({ fvtdocs: fvtDocuments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/addPhoto', async (req, res) => {
  const emailToFind = req.body.email;
  const urlLinkToAdd = req.body.urlLink;

  // Find the document with the specified email and add the URL link field
  db.collection('users').where('email', '==', emailToFind).get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // Add the URL link field to the document
        doc.ref.update({ urlLink: urlLinkToAdd })
          .then(() => {
            res.json({ message: "added" });
          })
          .catch(error => {
            res.json({ message: "error" });
          });
      });
    })
    .catch(error => {
      res.status(500).send(`Error finding user with email ${emailToFind}: ${error}`);
    });
});
router.post('/addinterest', async (req, res) => {
  const emailToFind = req.body.email;
  const intereststoadd = req.body.interests;

  // Find the document with the specified email and add the URL link field
  db.collection('users').where('email', '==', emailToFind).get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // Add the URL link field to the document
        doc.ref.update({ interests: intereststoadd })
          .then(() => {
          
            res.json({ message: "added" });
            
          })
          .catch(error => {
            res.json({ message: "error" });
          });
      });
    })
    .catch(error => {
      res.json({ message: "error" });
    });
});
router.post('/adddiscription', async (req, res) => {
  const emailToFind = req.body.email;
  const discriptiontoadd = req.body.discription;

  // Find the document with the specified email and add the URL link field
  db.collection('users').where('email', '==', emailToFind).get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // Add the URL link field to the document
        doc.ref.update({ discription: discriptiontoadd })
          .then(() => {
          
            res.json({ message: "added" });
            
          })
          .catch(error => {
            res.json({ message: "error" });
          });
      });
    })
    .catch(error => {
      res.json({ message: "error" });
    });
});
router.post('/headline', async (req, res) => {
  const emailToFind = req.body.email;
  const headlinetoadd = req.body.headline;

  // Find the document with the specified email and add the URL link field
  db.collection('users').where('email', '==', emailToFind).get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // Add the URL link field to the document
        doc.ref.update({ headline: headlinetoadd })
          .then(() => {
          
            res.json({ message: "added" });
            
          })
          .catch(error => {
            res.json({ message: "error" });
          });
      });
    })
    .catch(error => {
      res.json({ message: "error" });
    });
});

router.post("/addUserDetails", (req, res) => {
  if (req.body.type === "Student" || req.body.type == "Profession") {
    let type;
    req.body.type === "Student"
      ? (type = "studentDetails")
      : (type = "professionalDetails");
    let docRef = db.collection(type).doc(req.body.id);
    let updatedData = req.body.updateData;
    docRef.update(updatedData);
    res.send(`user updated success`);
  } else {
    res.status(400).json("The type you are providing is not valid");
  }
});

// GET method to search users
router.post("/searchUser", (req, res) => {
  let query = db.collection('users');
  let criteria = req.body.criteria
  switch (criteria) {
    case "email":
      query = query.where('email', '==', req.body.query);
      break;
    case "name":
      query = query.where('name', '==', req.body.query);
      break;
    // case "id":
    //     query = query.where('id', '==', req.body.query);
    //     break;
    default:
      res.status(400).json("The search criteria you are providing is not valid!")
      return
  }

  // Get the results
  query.get().then(snapshot => {
    snapshot.forEach(doc => {
      console.log(doc.data());
    });
    res.status(200).send(snapshot.docs[0].data())
  }).catch(err => {
    console.log('Error getting documents', err);
    res.status(500).send(err)
  });
});

module.exports = router;
