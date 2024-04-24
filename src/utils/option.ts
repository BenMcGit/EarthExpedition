import { Option } from '@/components/Select';

export const valueToLabel = (value: string, options: Option[]) => {
  return options.find((option) => option.value === value)?.label;
};
