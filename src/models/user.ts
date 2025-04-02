import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content:string,
    createdAt:Date
}

const messageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean,
    isAccepting:boolean,
    message:Message[]
}
const userSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,'Please use a Valid Email']
    },
    password:{
        type:String,
        required:true
    },
    verifyCode:{
        type:String,
        required:[true,'Verify Code is required']
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,'Verify Code Expiry is required']
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAccepting:{
        type:Boolean,
       default:true
    },
    message:[messageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",userSchema)
export default UserModel;