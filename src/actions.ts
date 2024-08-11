'use server';

import OpenAI from 'openai';
import dotenv from 'dotenv';
import { z } from 'zod';
import { FormState, Location } from '@/components/Map/Map';

dotenv.config();

const openai = new OpenAI();

const schema = z.object({
  prompt: z.string({
    invalid_type_error: 'Invalid prompt value',
  }),
});

function isLocation(obj: any): obj is Location {
  return (
    typeof obj === 'object' &&
    Array.isArray(obj.coordinates) &&
    obj.coordinates.length === 2 &&
    typeof obj.coordinates[0] === 'number' &&
    typeof obj.coordinates[1] === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.image === 'string'
  );
}

export default async function determineCoordinates(
  state: any,
  formData: FormData,
): Promise<FormState> {
  // Validate the input using Zod schema
  const validatedFields = schema.safeParse({
    prompt: formData.get('prompt'),
  });

  // Return early if the input is invalid
  if (!validatedFields.success) {
    return {
      prompt: '',
      locations: [],
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const validPrompt = validatedFields.data.prompt as string;

  try {
    const gpt4Completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',

          content:
            "You are a travel expert and you are helping friends find the perfect place to visit based on their input. \
            You must always return valid JSON and nothing else. \
            The json contains the following properties: \
            'coordinates' which is an array of two floats [latitude, longitude], \
            'title' which is the name of the location, \
            'description' which is a eye catching description of the location, \
            'image' which is a valid url to an image of the location. \
            Please return an array with 3 possible locations to visit that match the input criteria. \
            Please make sure each place you suggest is at least 500 miles away from the other places.",
        },
        { role: 'user', content: validPrompt },
      ],
    });

    const responseText = gpt4Completion.choices[0]?.message?.content;
    if (responseText && (responseText[0] === '{' || responseText[0] === '[')) {
      const json = JSON.parse(responseText);

      const locations: Location[] = [];

      if (Array.isArray(json)) {
        json.forEach((location: any) => {
          if (isLocation(location)) {
            locations.push(location);
          }
        });
      } else if (isLocation(json)) {
        locations.push(json);
      }

      return {
        prompt: validPrompt,
        locations,
        error: null,
      };
    } else {
      return {
        prompt: validPrompt,
        locations: [],
        error: { message: 'Invalid response from OpenAI' },
      };
    }
  } catch (error) {
    return {
      prompt: validPrompt,
      locations: [],
      error,
    };
  }
}
