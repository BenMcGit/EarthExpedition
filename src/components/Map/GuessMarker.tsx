// import { LatLng } from 'leaflet'
// import React, { FC } from 'react'
// import { useState } from 'react'
// import { useMapEvents, Marker, Popup } from 'react-leaflet'

// interface GuessMarkerProps {
//   disabled: boolean
//   value: LatLng | undefined
//   setValue: React.SetStateAction<LatLng>
// }

// const GuessMarker: FC<GuessMarkerProps> = ({ disabled, value, setValue }) => {
//   useMapEvents({
//     click(e) {
//       if (!disabled) {
//         setValue(e.latlng)
//       }
//     },
//   })

//   return value ? (
//     <Marker
//       position={value}
//       // eventHandlers={{
//       //   click: () => {
//       //     console.log('marker clicked')
//       //   },
//       //   add: (e) => {
//       //     console.log(e)
//       //   },
//       // }}
//     >
//       <Popup keepInView={true}>
//         <h1 className="font-bold">TEST</h1>
//       </Popup>
//     </Marker>
//   ) : (
//     <></>
//   )
// }

// export default GuessMarker
