import Board from '@/components/Board'
import { useMarkerData } from '@/services/marker'

const TravelBoard: React.FC = () => {
  const markerData = useMarkerData()

  return (
    <Board
      title="Travel Tip"
      className="absolute top-[120px] left-[10px] max-w-[350px] xl:w-[30%] border-[#B3B3B3]"
    >
      <div>{markerData?.travelTip}</div>
    </Board>
  )
}

export default TravelBoard
