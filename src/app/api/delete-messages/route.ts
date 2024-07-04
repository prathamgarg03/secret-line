import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(request: Request) {
    await dbConnect();
    const {messageIds} = await request.json()
    
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 });
    }

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: { $in: messageIds } } } },
            { multi: true }
        );

        if (updatedResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Messages not found or already deleted"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Messages deleted successfully"
        }, { status: 200 });
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error deleting messages"
        }, { status: 500 });
    }
}
