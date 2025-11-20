import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("connected successfully");
        });
        await mongoose.connect(`${process.env.MONGO_URL}/chatschat`)
    } catch (error) {
        console.log("failed to connect");
    }
}

export default connectDB;