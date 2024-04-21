import { create } from 'zustand';
import { fetchApi } from '@/utils/fetch';
import { useShowBoardStore } from '@/components/Board';

export interface MarkerData {
  coordinates: [number, number];
  title?: string;
  description?: string;
  travelTip: string;
}

interface MarkerStore {
  data: MarkerData | null;
  requestData: (prompts: string) => void;
}

const useMarkerStore = create<MarkerStore>((set) => ({
  data: null,
  requestData: async (prompts: string) => {
    try {
      const data = await fetchApi<MarkerData>({
        path: '/coordinates',
        method: 'POST',
        params: { value: prompts },
      });
      set({ data });
      setTimeout(() => useShowBoardStore.setState({ showBoard: true }), 1000);
    } catch (error) {
      console.error(error);
    }
  },
}));

const selectors = {
  markerData: (state: MarkerStore) => state.data,
  requestMarkerData: (state: MarkerStore) => state.requestData,
};

export const useMarkerData = () => useMarkerStore(selectors.markerData);
export const useRequestMarkerData = () =>
  useMarkerStore(selectors.requestMarkerData);
