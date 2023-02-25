require("./connection/firebase");
const cors = require("cors");
const express = require("express");
require("dotenv").config();
const blogRoutes = require("./routes/blogPosts.jsx");
const emailRoute = require("./routes/emailManagment");
const uploadRoute = require("./routes/resources.jsx");
const admin = require("./routes/Admin");
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
const app = express();
app.use(cors(corsOptions));
app.use("/api/users", require("./routes/users"));
app.use("/api/blogPosts", blogRoutes);
app.use("/api/email", emailRoute);
app.use("/api/admin", admin);

app.use("/api/resources", uploadRoute);
app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
