const express = require("express");
const app = express();
const mongoose = require("mongoose");

const {userRoute} = require("./routes/userRoute")
const {postRoute} = require("./routes/postRoutes")
const cors = require("cors")


require("dotenv").config();



app.use(cors());
app.use(express.json());

app.use("/api",userRoute)
app.use("/api",postRoute)



const connect = async() => {

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected");
    } catch (error) {
        console.log(error.message);
    }

}
app.listen(process.env.PORT,() => {
    connect();
    console.log("Listening on PORT");
})