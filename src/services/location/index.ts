import { fetchApi } from '@/utils/fetch';

export const requestGenerateLocation = async (inputPrompt: any) => {
  const res = await fetchApi({
    path: '/location',
    method: 'POST',
    params: { inputPrompts: inputPrompt },
  });
  return res.location;
};
