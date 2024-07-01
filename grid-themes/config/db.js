// db.js
require('dotenv').config({ path: __dirname + "/../.env" });

const mongoose = require("mongoose");
// const db =
//   `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@whatisacluster.n8fqxho.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority&appName=WhatIsACluster`;
const db = 
  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.DEV_MONGODB_PASSWORD}@grid-data.qbo6wua.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority&appName=GridData`;
// `mongodb+srv://${process.env.MONGODB_USER}:${process.env.DEV_MONGODB_PASSWORD}@grid-data.qbo6wua.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority&appName=GridData`
// mongodb+srv://oscaryik228:2fOzZvMYx9WP1TRn@grid-data.qbo6wua.mongodb.net/
mongoose.set("strictQuery", true, "useNewUrlParser", true);

const connectDB = async () => {
  try {
    // console.log(db);
    // console.log(process.env.AWS_REGION);
    await mongoose.connect(db);
    console.log("MongoDB is Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;