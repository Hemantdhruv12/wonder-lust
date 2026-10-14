const mongoose = require('mongoose');

 
const initData = require("./data.js")

const Listing = require("../models/listing.js");

const Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
}).catch((err)=>{
console.log(err)
})

async function main(){

    await mongoose.connect(Mongo_Url);

}


const dataInit= async()=>{
    await Listing.deleteMany({});


let newlist = initData.data.map((obj)=>({...obj, owner: ' 6ab8052c1f60db71b2900f1d'}))
await Listing.insertMany(initData.data)
console.log("data is initialized");

}



let getData= async()=>{
    let data =  await Listing.find({})
    console.log(data)
}
dataInit()
//  getData()
