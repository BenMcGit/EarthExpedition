'use client'
import dynamic from 'next/dynamic'
const DynamicMapComponent = dynamic(() => import('../modules/MapComponent'), {
  ssr: false,
})

const MyPage = () => {
  return (
    <div>
      <DynamicMapComponent />
    </div>
  )
}

export default MyPage
