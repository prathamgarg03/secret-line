import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"

export async function POST(request: Request) {
    await dbConnect()
    const {oldUsername, newUsername} = await request.json()

    try {
        const user = await UserModel.findOne({username: oldUsername}).exec()
        if(!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        const updatedUser = await UserModel.updateOne(
            { username: oldUsername },
            { $set: { username: newUsername } }
        )
        if(updatedUser) {
            return Response.json({
                success: true,
                message: "Username updated successfully"
            }, { status: 200 })
        }
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error updating username"
        }, { status: 500 })
    }
}