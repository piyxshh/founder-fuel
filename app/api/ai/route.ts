import { NextRequest } from 'next/server';

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export async function GET(request: NextRequest){
    const model = new ChatGoogleGenerativeAI({
    
    model: 'gemini-2.5-flash',
    temperature: 0.7,
  });

    try{
        const response = await model.invoke(
            "Tell me a short, one paragraph story about a developer building an AI app."
        );

        return Response.json({ story: response.content });
    }
    catch (error){
        console.error(error);
        
        if(error instanceof Error) {
            return Response.json(
                { message: 'error calling AI', error: error.message },
                { status: 500 }
            );
        }
        return Response.json(
            { message: 'unknown error occurred' },
            { status: 500 }
        );
    }
}