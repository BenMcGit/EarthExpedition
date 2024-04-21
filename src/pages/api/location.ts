import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI();

export default async function handler(req: any, res: any) {
  // Retrieve the category from the request body
  const category = req.body.inputPrompts;
  // Create a system message dynamically based on the category
  const systemMessage = `You only return a cryptic phrase about a ${category.toLowerCase()} location on earth. This location has exact coordinates and you should be able to determine them but not return them. Do not return any quotation marks.`;

  try {
    const gpt4Completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
      ],
    });
    const responseText = gpt4Completion.choices[0]?.message?.content;
    if (responseText) {
      res.status(200).json({ location: responseText });
    } else {
      res.status(200).json({ tryAgain: true });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
