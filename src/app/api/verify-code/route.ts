import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";


const VerifyQuerySchema = z.object({
    code: verifySchema
})

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, code } = await request.json()

        const result = VerifyQuerySchema.safeParse({ code })
        if(!result.success) {
            const codeErrors = result.error.format().code?._errors || []
            return Response.json({
                success: false,
                message: codeErrors?.length > 0 ? codeErrors.join(', ') : "Inavlid query parameters"
            }, { status: 400 })
        }

        const decodeUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodeUsername})
        if(!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 400 }) 
        }
        const isCodeValid = user.verificationCode === code 
        const isCodeNotExpired = new Date(user.verficationCodeExpiry) > new Date()
        if(isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 }) 
        } else if(!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired, please signup again to get a new code"
            }, { status: 400 })  
        } else {
            return Response.json({
                success: false,
                message: "Verification code is invalid"
            }, { status: 400 }) 
        }

    } catch (error) {
        console.error("Error verifying user", error)
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, { status: 500 })
    }
}