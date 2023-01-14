const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();

router.use(express.json()); // for application/json
router.use(express.urlencoded());

const db = admin.firestore();

// POST method to add Blog Post
router.post("/addBlog", (req, res) => {
  let blogPost = {
    author: req.body.author,
    content: req.body.content,
    date: new Date(Date.now()), //2023-01-11T11:42:13.935Z
    likes: 0,
    comments: {
      userID: "",
      userName: "",
      comment: "",
      date: "",
    },
    imageIDs: req.body.imageIDs ? req.body.imageIDs : [],
    videoIDs: req.body.videoIDs ? req.body.videoIDs : [],
  };

  db.collection("blogPosts")
    .add(blogPost)
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
  db.collection("blogPosts")
    .get()
    .then((snapshot) => {
      console.log(snapshot.data())
      res.status(200).send(snapshot.data());
    })
    .catch((reason) => {
      res.status(500).send(reason);
    });
});
// POST route to update number of likes of a blog post
router.post("/updateLikes", (req, res) => {
  const blogRefID = req.body.blogRefID;
  let likes = req.body.likes;

  db.collection("blogPosts")
    .doc(blogRefID)
    .update({ likes })
    .then((snapshot) => {
      console.log("Blog likes updated:", likes);
      res.status(200).send("OK");
    })
    .catch((reason) => {
      console.log("Blog Likes update failed:", reason);
      res.status(500).send(reason);
    });
});

// POST route to add new comment to a blog post
router.post("/addComment", (req, res) => {
  const blogRefID = req.body.blogRefID;
  let comments = req.body.comments;

  db.collection("blogPosts")
    .doc(blogRefID)
    .update({ comments })
    .then((_) => {
      console.log("Blog Comments updated");
      res.status(200).send("OK");
    })
    .catch((reason) => {
      console.log("Blog Likes update failed:", reason);
      res.status(500).send(reason);
    });
});

module.exports = router;
