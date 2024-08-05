import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    await dbConnect()
    const { oldPassword, newPassword, username } = await request.json()
    try {
        const user = await UserModel.findOne({ username }).exec()
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password)
        if (!isPasswordCorrect) {
            return Response.json({
                success: false,
                message: "The current password you entered is incorrect. Please try again."
            }, { status: 403 })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword;
        const updatedUser = await user.save();
        if (updatedUser) {
            return Response.json({
                success: true,
                message: "Password updated successfully"
            }, { status: 200 })
        }
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error updating username"
        }, { status: 500 })
    }
}