import mongoose from "mongoose";

const conectdb= async ()=>{
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("✅MongoDB connected ")
    } catch (error) {
        
        console.error("❌MongoDB connection Error ",error)
        process.exit(1)
    }
}
export default conectdb