import { client } from "@gradio/client";
import { NextResponse } from "next/server";
import { Amplify } from "aws-amplify";
import awsconfig from "../../aws-exports";
import { gptResponse } from "../../helpers";

Amplify.configure(awsconfig);

export async function POST(req: Request, res: Response) {
    const { prompt } = await req.json();

    try {
        console.log("Generando Image");
        const data = await gptResponse(prompt);
        const [imageContext, soundUrl] = data.text.split(",");
        const imageUrl = await generateImage(imageContext);

        return new NextResponse(JSON.stringify(`${[imageUrl, soundUrl]}`), { status: 200 });
    } catch (error) {
        console.log("Error");
        return new NextResponse(JSON.stringify(error), { status: 500 });
    }
}

async function generateImage(prompt: string) {
    const app = await client("https://saul19-imagen-audio.hf.space/");
    const result: any = await app.predict("/predict", [
        prompt, // string  in 'prompt' Textbox component
    ]);

    return result.data[0];
}
