import { create } from 'zustand';
import { fetchApi } from '@/utils/fetch';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShowBoardStore } from '@/components/Board';

export interface MarkerData {
  coordinates: [number, number];
  title?: string;
  description?: string;
}

interface MarkerStore {
  destinationData: MarkerData | null;
  travelTip: string;
  requestDestinationData: (prompts: string) => void;
  clear: () => void;
}

const useMarkerStore = create(
  subscribeWithSelector<MarkerStore>((set) => ({
    destinationData: null,
    travelTip: '',
    requestDestinationData: async (prompts: string) => {
      try {
        const data = await fetchApi<MarkerData>({
          path: '/coordinates',
          method: 'POST',
          params: { value: prompts },
        });
        set({
          destinationData: { ...data },
        });
      } catch (error) {
        console.error(error);
      }
    },
    clear: () => set(() => ({ destinationData: null, travelTip: '' })),
  })),
);

const selectors = {
  markerData: (state: MarkerStore) => state.destinationData,
  travelTip: (state: MarkerStore) => state.travelTip,
  requestMarkerData: (state: MarkerStore) => state.requestDestinationData,
  clear: (state: MarkerStore) => state.clear,
};

export const useMarkerData = () => useMarkerStore(selectors.markerData);
export const useTravelTip = () => useMarkerStore(selectors.travelTip);
export const useRequestMarkerData = () =>
  useMarkerStore(selectors.requestMarkerData);
export const useClearMarkerData = () => useMarkerStore(selectors.clear);

export const unsubDestinationData = useMarkerStore.subscribe(
  (state) => state.destinationData,
  async (des) => {
    try {
      const data = await fetchApi<{ travelTip: string }>({
        path: '/travelTip',
        method: 'POST',
        params: { value: des?.coordinates },
      });
      useMarkerStore.setState({
        travelTip: data.travelTip,
      });
      useShowBoardStore.setState({
        showBoard: true,
      });
    } catch (error) {
      console.error(error);
    }
  },
  {
    fireImmediately: true,
  },
);
