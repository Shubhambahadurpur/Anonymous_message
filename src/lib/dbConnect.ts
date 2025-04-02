/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";


interface IConnectionObject {
  isConnected?: number;
}
const connect: IConnectionObject = {};
async function dbConnect(): Promise<void> {
  if (connect?.isConnected) {
    console.log("DB Already connected");
    return;
  } else {
    try {
      const db = await mongoose.connect(process.env.MONGODB_URL || "");
      connect.isConnected = db.connections[0].readyState;
      
      console.log('DB connected successfully');
      console.log('db::',db);
      
      
    } catch (error) {
        console.log('Connection failed',error);
        process.exit(1);
    }
  }
}
export default dbConnect;
