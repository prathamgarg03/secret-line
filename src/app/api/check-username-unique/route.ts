import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username } = await request.json();
        
        const result = UsernameQuerySchema.safeParse({ username });
        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Inavlid query parameters"
            }, { status: 400 })
        }


        const existingUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: "Username is unique"
        }, { status: 201 })
        
    } catch (error) {
        console.error("Error cheching username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}