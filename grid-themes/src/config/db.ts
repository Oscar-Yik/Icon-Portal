// db.js
require('dotenv').config({ path: __dirname + "/../../.env" });

import mongoose from "mongoose";
// const db =
//   `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@whatisacluster.n8fqxho.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority&appName=WhatIsACluster`;
const db = 
  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.DEV_MONGODB_PASSWORD}@grid-data.qbo6wua.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority&appName=GridData`;
// `mongodb+srv://${process.env.MONGODB_USER}:${process.env.DEV_MONGODB_PASSWORD}@grid-data.qbo6wua.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority&appName=GridData`
// mongodb+srv://oscaryik228:2fOzZvMYx9WP1TRn@grid-data.qbo6wua.mongodb.net/
mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    // console.log(db);
    // console.log(process.env.AWS_REGION);
    await mongoose.connect(db);
    console.log("MongoDB is Connected...");
  } catch (err) {
<<<<<<< HEAD
    if (err instanceof Error) {
      // If the error is an instance of the built-in Error class
      console.error("Error message:", err.message);
    } else {
      // For other types of errors (e.g., non-Error objects, strings, etc.)
      console.error("Unexpected error:", err);
    }
=======
    console.error(err.message);
>>>>>>> 3caf05a (converted grid-themes to typescript)
    process.exit(1);
  }
};
export default connectDB;