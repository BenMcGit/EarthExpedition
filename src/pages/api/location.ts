import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI();

export default async function handler(req: any, res: any) {
  const category = req.body.inputPrompts;
  const systemMessage = `Return a cryptic phrase of a location on earth. The location is famous for or about ${category.toLowerCase()} and you should know the exact coordination. But only return the cryptic phrase and do not return anything that would reveal the location or coordination. It's a guessing game. Do not return any quotation marks.`;
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
