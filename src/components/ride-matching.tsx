// import { useState, useEffect } from 'react';
// import { useSocket } from '@/lib/socketContext';
// import { Map, Marker } from 'react-map-gl';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';

// const RideMatchingComponent = () => {
//   const [matchStatus, setMatchStatus] = useState('searching');
//   const [driverLocation, setDriverLocation] = useState(null);
//   const [estimatedArrival, setEstimatedArrival] = useState(null);
//   const socket = useSocket();

//   useEffect(() => {
//     socket.on('driverMatched', handleDriverMatch);
//     socket.on('driverLocationUpdate', handleDriverLocationUpdate);

//     return () => {
//       socket.off('driverMatched', handleDriverMatch);
//       socket.off('driverLocationUpdate', handleDriverLocationUpdate);
//     };
//   }, [socket]);

//   const handleDriverMatch = (data) => {
//     setMatchStatus('matched');
//     setDriverLocation(data.initialLocation);
//     setEstimatedArrival(data.estimatedArrival);
//   };

//   const handleDriverLocationUpdate = (data) => {
//     setDriverLocation(data.location);
//     setEstimatedArrival(data.estimatedArrival);
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Ride Status</h2>

//       {matchStatus === 'searching' && (
//         <div>
//           <Progress value={33} className="w-full mb-4" />
//           <p className="text-lg">Searching for a driver...</p>
//         </div>
//       )}

//       {matchStatus === 'matched' && (
//         <div>
//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button variant="outline">Driver Matched!</Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Driver on the way</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   Your driver will arrive in approximately {estimatedArrival}{' '}
//                   minutes.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogAction>OK</AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>

//           <Map
//             initialViewState={{
//               latitude: driverLocation.latitude,
//               longitude: driverLocation.longitude,
//               zoom: 14,
//             }}
//             style={{ width: '100%', height: 400 }}
//             mapStyle="mapbox://styles/mapbox/streets-v11"
//           >
//             <Marker
//               latitude={driverLocation.latitude}
//               longitude={driverLocation.longitude}
//             />
//           </Map>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RideMatchingComponent;
