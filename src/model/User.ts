import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string
    email: string
    password: string
    verificationCode: string
    verficationCodeExpiry: Date
    isVerified: boolean
    isAcceptingMessage: boolean
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true
    },
    verificationCode: {
        type: String,
        required: [true, "Verification Code is required"],
    },
    verficationCodeExpiry: {
        type: Date,
        required: [true, "Verification Code Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || 
                (mongoose.model<User>("User", UserSchema))

export default UserModel