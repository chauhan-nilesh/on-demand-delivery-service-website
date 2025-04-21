import mongoose from "mongoose"

const dbConnect = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/project`)
        console.log("MONGODB Connected Successfully. DB HOST:", connectionInstance.connection.host)
    } catch (error) {
        console.log("MONGODB Connection Failed. Error: ", error)
        process.exit(1)
    }
}

export default dbConnect