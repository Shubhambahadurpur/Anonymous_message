import { verificationEmail } from "@/helpers/verificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserByUserName = await UserModel.findOne({ username, isVerified: true });
    if (existingUserByUserName) {  // if user already exist
      return Response.json({ success: false, message: "Username Already taken"}, { status: 400 });
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      if(existingUserByEmail?.isVerified){
        return Response.json({ success: false, message: "Email Already exist" }, { status: 400 });
      }
      else{
        const hashedPassword = await bcrypt.hash(password,10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save(); // save user to db
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAccepting: true,
        message: [],
      });
      await newUser.save();  // save new user to DB
    }

    // send verification code
    const emailResponse = await verificationEmail(email, username, verifyCode)
    if(!emailResponse?.success){
      return Response.json({success: false, message: emailResponse?.message}, {status: 500})
    }

    return Response.json({success: true, message: "User registered successfully. Kindly verify your Email"}, {status: 201})

  } catch (error) {
    console.error("Something went wrong", error);
    return Response.json({ success: false, message: "Error registering User" }, { status: 500 });
  }
}
