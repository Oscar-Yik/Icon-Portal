// db.js

const mongoose = require("mongoose");
const db =
  "mongodb+srv://oscaryik228:NyxelGT3G2vNaRQ9@whatisacluster.n8fqxho.mongodb.net/?retryWrites=true&w=majority&appName=WhatIsACluster";
/* Replace <password> with your database password */

mongoose.set("strictQuery", true, "useNewUrlParser", true);

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("MongoDB is Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;