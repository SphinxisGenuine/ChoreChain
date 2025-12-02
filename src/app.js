import express from "express";
import cookieParser from "cookie-parser";
const app = express();


app.use(express.json({limit:"16kb"}))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Welcome to Chore Chain')
})

export default app;