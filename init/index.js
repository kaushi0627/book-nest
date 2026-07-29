const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js")

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() =>{
    console.log("Connected!");
}).catch(err =>{
    console.log(err)
})

async function main(){
    await mongoose.connect(mongo_url);
}

let initDb = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,owner : '6a38a315bc98f0e67b0dfcf6'
    }))
    await Listing.insertMany(initData.data)
    console.log("Data initialized!")
}

initDb();