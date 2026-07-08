import cookieParser from "cookie-parser";
import express ,{ Application, NextFunction, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";
import { notFound } from "./middlewares/notFound";
import httpStatus from "http-status"
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { subscriptionRoutes } from "./modules/subscription/subscription.route";

const app : Application = express();

app.use(cors({
    origin : config.app_url
}))

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

app.get("/" , async(req : Request , res : Response) => {
    res.send("Hello world!")
})


app.use("/api/user" , userRoutes)

app.use("/api/auth" , authRoutes)

app.use("/api/posts" , postRoutes)

app.use("/api/comments" , commentRoutes)

app.use("/api/subscription", subscriptionRoutes)


app.use(notFound)

app.use(globalErrorHandler)

export default app;