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
            'You only return in JSON an unique and cultrual travel tip of the given coordination of the location with about 80 words in the style of Pico Lyer with key of travelTip',
        },
        { role: 'user', content: `the coordination: ${req.body.value}` },
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
