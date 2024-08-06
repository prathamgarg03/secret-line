# Secret Line

Secret Line is an anonymous messaging platform that enables users to receive messages from anyone without revealing the sender's identity. Built with modern web technologies, this project offers a secure and user-friendly experience for those seeking private communication.

## 🚀 Features

- **Anonymous Messaging**: Receive messages from anyone without revealing the sender's identity
- **User Authentication**: Secure login system using email, username, and password
- **Email Verification**: Ensure user authenticity through email verification process
- **Personalized Dashboard**: View and manage received messages
- **Unique Shareable Link**: Generate and share a unique link to receive anonymous messages
- **Profile Management**: Update username and password
- **Message Control**: Toggle the ability to receive messages on/off
- **Responsive Design**: Seamless experience across various devices

## 🛠️ Technology Stack

- **Frontend**: Next.js (React framework)
- **Backend**: Node.js
- **Database**: MongoDB
- **Authentication**: 
  - NextAuth for user authentication
  - JSON Web Tokens (JWT) for session management
- **Email Service**: Resend for sending verification emails
- **Deployment**: Deployed and accessible at [secret-line.prathamgarg.com](https://secret-line.prathamgarg.com)

## 🔧 Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/prathamgarg03/secret-line.git
   ```
2. Navigate to the project directory:
   ```
   cd secret-line
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Set up environment variables (create a `.env` file in the root directory):
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   RESEND_API_KEY=your_resend_api_key
   ```
5. Run the development server:
   ```
   npm run dev
   ```

## 🚦 API Routes

- `/api/accept-message`: Toggle message acceptance status
- `/api/auth/[...nextauth]`: Handle authentication routes
- `/api/check-username-unique`: Verify username availability
- `/api/delete-message/[messageid]`: Remove a specific message
- `/api/get-messages`: Retrieve user's messages
- `/api/send-message`: Submit an anonymous message
- `/api/sign-up`: Register a new user
- `/api/suggest-message`: Generate message suggestions
- `/api/update-password`: Modify user's password
- `/api/update-username`: Change user's username
- `/api/verify-code`: Confirm email verification code

## 🔐 Authentication Flow

1. Users sign up with email, username, and password
2. A verification email is sent using Resend
3. Users verify their email by entering the received code
4. Upon successful verification, users can log in
5. JWT bearer tokens are used for maintaining authenticated sessions

## 💻 Usage

1. Visit [secret-line.prathamgarg.com](https://secret-line.prathamgarg.com)
2. Sign up or log in to access your dashboard
3. Copy your unique link from the dashboard
4. Share the link with others to receive anonymous messages
5. View and manage received messages on your dashboard
6. Update your profile information as needed
7. Toggle message acceptance on/off from the dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
