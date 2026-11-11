import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(request: Request) {
  const { prompt }: { prompt: string } = await request.json();
  try {
    const result = streamText({
      model: google('gemini-2.5-flash'),
      prompt: prompt,
    })
    return result.toTextStreamResponse()
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
