const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000 ;


// 
app.use(cors())
app.use(express.json())


app.get('/',(req, res )=>{
    res.send("Baby Toy Car Shop Is Open")
})
app.listen(port,()=>{
    console.log(`Toy Car Server Is Running Port ${port}`)
})