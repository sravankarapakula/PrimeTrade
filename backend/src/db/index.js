import mongoose from "mongoose";
import {DB_NAME} from "../constant.js";

const connectDB = async()=>{
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected!!!!");
        console.log(`DB HOST : ${connectionInstance.connection.host}`);
    } catch (error){
        console.log("MONGODB connection Error: ",error);
        process.exit(1);
    }
}

export default connectDB;