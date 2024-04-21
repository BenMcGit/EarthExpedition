import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI();

export default async function handler(req: any, res: any) {
  try {
    const gpt4Completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You only return in JSON a coordinates key with a value in this format [43.6426, -79.3871], then a title of the location with a title key, then a description giving more details',
        },
        { role: 'user', content: req.body.value },
      ],
    });

    const responseText = gpt4Completion.choices[0]?.message?.content;
    if (responseText && responseText[0] === '{') {
      const json = JSON.parse(responseText);
      res.status(200).json(json);
    } else {
      res.status(200).json({ tryAgain: true });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
