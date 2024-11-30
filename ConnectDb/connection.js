import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const connectDb=async()=>{
    try {
        const connection=mongoose.connect(process.env.mongoDbConnectionString)
        console.log("Mongodb connected")
        return connection
    } catch (error) {
        console.log(error)
    }
}
export default connectDb