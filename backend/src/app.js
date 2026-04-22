import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use((req, res, next) => {
  console.log("REQ HIT:", req.method, req.url);
  next();
});

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true,limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'
import taskRouter from './routes/task.routes.js'

//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/tasks", taskRouter)

import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

export { app }