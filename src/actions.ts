'use server';

import OpenAI from 'openai';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const openai = new OpenAI();

const schema = z.object({
  prompt: z.string({
    invalid_type_error: 'Invalid prompt value',
  }),
});

export default async function determineCoordinates(state: any, formData: FormData) {
  // Validate the input using Zod schema
  const validatedFields = schema.safeParse({
    prompt: formData.get('prompt'),
  });

  // Return early if the input is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const gpt4Completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You only return in JSON a coordinates key with a value in this format [latitude, longitude], then a title of the location with a title key, then a description giving more details, then a link of an image related to the location with an image key.',
        },
        { role: 'user', content: validatedFields.data.prompt as string },
      ],
    });

    const responseText = gpt4Completion.choices[0]?.message?.content;
    if (responseText && responseText[0] === '{') {
      const json = JSON.parse(responseText);
      return json;
    } else {
      return { tryAgain: true };
    }
  } catch (error) {
    return { error };
  }
}
