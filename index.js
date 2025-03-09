import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"

dotenv.config();

const app = express();

app.use(bodyParser.json({limit:"30mb",extended:"true"}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:"true"}));

app.use(cors());

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(PORT , ()=>console.log(`server running at http://localhost:${PORT}`))
})
.catch((error)=>console.log(error.message));
