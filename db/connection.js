const mongoose =require("mongoose")
const connectionString=process.env.DATABASE

mongoose.connect(connectionString).then(res=>{
    console.log("mongoDb started runnning successfully");
    
}).catch(err=>{
    console.log(`mongodb connection failed due to ${err}`);
    
})