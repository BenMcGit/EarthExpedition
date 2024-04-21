import { fetchApi } from '@/utils/fetch';

export const requestGenerateLocation = async () => {
  //TODO: clear any
  const res: any = await fetchApi({
    path: '/location',
    method: 'POST',
  });
  const data = await res.location;
  return data;
};
