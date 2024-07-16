// db.js
require('dotenv').config({ path: __dirname + "/../../.env" });

import mongoose from "mongoose";
import getErrorMessage from "../../Errors";

import { databaseType } from "../../layout-types";

mongoose.set("strictQuery", true);

async function connectDB(type: databaseType) {
  try {
    const devDB = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.DEV_MONGODB_PASSWORD}@grid-data.qbo6wua.mongodb.net/
                  ${process.env.MONGODB_DBNAME_LAYOUT}?retryWrites=true&w=majority&appName=GridData`;
    const prodDB = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@whatisacluster.n8fqxho.mongodb.net/
                   ${process.env.MONGODB_DBNAME_LAYOUT}?retryWrites=true&w=majority&appName=WhatIsACluster`;
    const testDB = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.TEST_MONGODB_PASSWORD}@grid-test.qyfhc6b.mongodb.net/
                   ${process.env.MONGODB_DBNAME_LAYOUT}?retryWrites=true&w=majority&appName=grid-test`;
    let db = "";
    switch (type) {
      case "DEV": db = devDB; break; 
      case "PROD": db = prodDB; break; 
      case "TEST": db = testDB; break; 
    }
    await mongoose.connect(db);
    console.log("MongoDB is Connected...");
  } catch (error) {
    console.error("Error message:", getErrorMessage(error));
    process.exit(1);
  }
};

async function disconnectDB() {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error message:", getErrorMessage(error));
  }
} 

const mongo = { connectDB, disconnectDB }

export default mongo;