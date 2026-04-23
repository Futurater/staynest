if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const Listing= require("../models/listings.js");
const initData=require("./data.js");
const mongoose=require("mongoose");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/peppyz";
 main()
 .then(()=>{
    console.log("connected to DB");
 })
 .catch((err)=>{
    console.log(err);
 });
  async function main(){
     await mongoose.connect(MONGO_URL);
  };

  const initDB = async()=>{
    await Listing.deleteMany({});
        await Listing.insertMany(initData.data);
        console.log("data was inititalized");

    
  };

  initDB();