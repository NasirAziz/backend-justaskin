const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();

const serverTime = admin.firestore.FieldValue.serverTimestamp();

router.use(express.json()); // for application/json
router.use(express.urlencoded());

const db = admin.firestore();

// POST method to add Blog Post
router.post("/addBlog", (req, res) => {
  let blogPost = {
    author: req.body.author,
    content: req.body.content,
    date: new Date(Date.now()), //2023-01-11T11:42:13.935Z
    likes: { total: 0, data: [] }, //{date:{},user:{}}
    rating: { rating: 0, data: [] }, //{date:{},user:{}}
    comments: [
      {
        // userID: "",
        // userName: "",
        // comment: "",
        // date: "",
      },
    ],
    imageIDs: req.body.imageIDs ? req.body.imageIDs : [],
    videoIDs: req.body.videoIDs ? req.body.videoIDs : [],
    tags: req.body.tags ? req.body.tags : [],
  };

  db.collection("blogPosts")
    .add(blogPost, { ignoreUndefinedProperties: true })
    .then((snapshot) => {
      console.log("Blog Post created:", snapshot.path);
      res.status(200).send("OK"); //snapshot.path = "blogPosts/generated ID"
    })
    .catch((reason) => {
      console.log("Error creating blog post:", reason);
      res.status(500).send(reason);
    });
});

// PUT method to add Blog Post
router.put("/updateBlog", (req, res) => {
  const blogRefID = req.body.blogRefID;
  let blogPost = req.body.blogPost;

  // let blogPost = {
  //   author: req.body.author,
  //   content: req.body.content,
  //   date: new Date(Date.now()), //2023-01-11T11:42:13.935Z
  //   likes: 0,
  //   comments: {
  //     userID: "",
  //     userName: "",
  //     comment: "",
  //     date: "",
  //   },
  //   imageIDs: req.body.imageIDs,
  //   videoIDs: req.body.videoIDs,
  // };

  db.collection("blogPosts")
    .doc(blogRefID)
    .update(blogPost)
    .then((snapshot) => {
      console.log("Blog Post Updated:", snapshot.path);
      res.status(200).send("OK"); //snapshot.path = "blogPosts/blogRefID"
    })
    .catch((reason) => {
      console.log("Error updating blog post:", reason);
      res.status(500).send(reason);
    });
});

// GET route for getting blog posts
router.get("/blogs", (req, res) => {
  let interests = req.body.interests; //["tag1","tag2", ...]
  let query = db.collection("blogPosts");
  if (interests) {
    query = query.where("tags", "array-contains-any", interests);
  }

  query
    .get()
    .then((snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push(doc.data());
      });
      res.status(200).send(data);
    })
    .catch((reason) => {
      res.status(500).send(reason);
    });
});
// POST route to update number of likes of a blog post
router.post("/updateLikes", (req, res) => {
  const blogRefID = req.body.blogRefID;
  let likes = {};
  const user = req.body.user;
  const addOrRemoveLike = req.body.like; // send 1 for increment/like | -1 for decrement/dislike
  const docRef = db.collection("blogPosts").doc(blogRefID);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        console.log(data);
        likes = data.likes;

        likes.total = likes.total + addOrRemoveLike;
        if (addOrRemoveLike == 1) likes.data.push({ date: new Date(Date.now()), user: user });
        else likes.data = likes.data.filter((el) => el.user.email != user.email);

        docRef
          .update({ likes })
          .then((snapshot) => {
            console.log("Blog likes updated:", likes.total);
            res.status(200).send("OK");
          })
          .catch((reason) => {
            console.log("Blog Likes update failed:", reason);
            res.status(500).send(reason);
          });
      }
    })
    .catch((reason) => {
      console.log("Error updating likes:", reason);
      res.status(500).send(reason);
    });
});

// POST route to add new comment to a blog post
router.post("/addComment", (req, res) => {
  const blogRefID = req.body.blogRefID;
  // const data = req.body.comment;
  const comment = { ...req.body.comment, date: new Date(Date.now()) };

  const ref = db.collection("blogPosts").doc(blogRefID);

  db.runTransaction((transaction) => {
    // This code may get re-run multiple times if there are conflicts.
    return transaction.get(ref).then((sfDoc) => {
      if (!sfDoc.exists) {
        throw "Document does not exist!";
      }

      // Add one person to the city population.
      // Note: this could be done without a transaction
      //       by updating the population using FieldValue.increment()
      let newComments = sfDoc.data().comments;
      newComments.push(comment);
      transaction.update(ref, { comments: newComments });
    });
  })
    .then(() => {
      console.log("Add Comment Transaction successfully committed!");
      res.status(200).send("OK");
    })
    .catch((error) => {
      console.log("Transaction failed: ", error);
      res.status(500).send(error);
    });
});

// POST route to update rating to a blog post
router.put("/addRating", (req, res) => {
  const blogRefID = req.body.blogRefID;
  const user = req.body.user;
  const rating = user.rated;

  const ref = db.collection("blogPosts").doc(blogRefID);

  db.runTransaction((transaction) => {
    // This code may get re-run multiple times if there are conflicts.
    return transaction.get(ref).then((sfDoc) => {
      if (!sfDoc.exists) {
        throw "Document does not exist!";
      }

      let data = sfDoc.data().rating;
      data.data.push(user);
      let total = 0;

      for (let i = 0; i < data.data.length; i++) total += data.data[i].rated;

      let newRating = total / data.data.length;
      data.rating = newRating;

      transaction.update(ref, { rating: data });
    });
  })
    .then(() => {
      console.log("Rating Transaction successfully committed!");
      res.status(200).send("OK");
    })
    .catch((error) => {
      console.log("Transaction failed: ", error);
      res.status(500).send(error);
    });
});

module.exports = router;
