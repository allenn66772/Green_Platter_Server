//1 import express
const express =require("express")

//7 import dotenv
require("dotenv").config()

//8 import router
const router=require("./router")

//11 import connection
require("./db/connection")


//5. import cors
const cors =require("cors")

//2 create server app using express
const foodWebserver=express()

//6 tell the server to use cors
foodWebserver.use(cors())

//10 parse request
foodWebserver.use(express.json())

//9 tell the server to user router
foodWebserver.use(router)


//3.create port
const PORT=3000

//4.tell server to listen
foodWebserver.listen(PORT,()=>{
    console.log( `food server started successfullly at port number ${PORT} `);
    

})
foodWebserver.get("/",(req,res)=>{
    res.status(200).send(`Food serverstartd runnig`)
})




