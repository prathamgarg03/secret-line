import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { Message } from "@/model/User";

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await UserModel.findOne({ _id: userId }).lean();
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        if (!user.messages || user.messages.length === 0) {
            return Response.json({
                success: true,
                messages: []
            }, { status: 200 })
        }
        
        const messages = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" }
                }
            }
        ]);

        return Response.json({
                success: true,
                messages: messages[0].messages
            }, { status: 200 })

    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: "Error fetching messages"
        }, { status: 500 })
    }
}