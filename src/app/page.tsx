'use client'
import dynamic from 'next/dynamic'
const DynamicMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
})

const MyPage = () => {
  return (
    <div>
      <DynamicMap />
    </div>
  )
}

export default MyPage
