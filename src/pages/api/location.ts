import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI()

export default async function handler(req: any, res: any) {
  try {
    const gpt4Completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You only return a cryptic phrase about a famous location on earth. This location has exact coordinates and you should be able to determine them but not return them. Do not return any quotation marks.',
        },
      ],
    })
    const responseText = gpt4Completion.choices[0]?.message?.content
    if (responseText) {
      res.status(200).json({ location: responseText })
    } else {
      res.status(200).json({ tryAgain: true })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}
