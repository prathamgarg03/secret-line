import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import brcrypt from "bcryptjs"
import { sendverificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const {username, email, password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if(existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {status: 400})
        }

        const existingUserByEmail= await UserModel.findOne({email})
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail) {
            if(existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this email"
                }, {status: 400})
            } else {
                const hashedPassword = await brcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verificationCode = verificationCode
                existingUserByEmail.verficationCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        } else {
            const hashedPassword = await brcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verificationCode,
                verficationCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }
        const emailResponse = await sendverificationEmail(
            email, 
            username, 
            verificationCode
        )

        if(!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email"
        }, {status: 201})
    } catch(error) {
        console.error("Error registering user", error)
        return Response.json({
            success: false,
            messaage: "Error registering user"
        }, {
            status: 500
        })
    }
}