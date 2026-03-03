require("dotenv").config();
const express = require('express');
const app = express();
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoutes")


app.use(express.json());

app.use("/", userRoute)

app.get("/", (req, res)=>{
    res.send("Server running...")
})


connectDB().then(()=>{
    app.listen(5000);
})
