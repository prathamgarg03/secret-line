import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(request: Request) {
  const { prompt }: { prompt: string } = await request.json();
  try {
    const text = await streamText({
      model: google('models/gemini-pro'),
      prompt: prompt,
    })
    return text.toAIStreamResponse()
  } catch (error) {
    console.log("AI error: ", error)
    return Response.json({
        success: false,
        messaage: "Error generating text"
    }, {
        status: 500
    })
  }
} 
