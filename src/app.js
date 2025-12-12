import express from "express";
import cookieParser from "cookie-parser";
const app = express();

import AuthRouter from "./routes/auth.route.js"
import Housholdrouter from "./routes/Houshold.routes.js"
  
app.use(express.json({limit:"16kb"}))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Welcome to Chore Chain')
})

app.use("/api/v1/auth",AuthRouter)
app.use("/api/v1/core",Housholdrouter)
export default app;