import React from 'react';
import { useParams } from 'react-router-dom'
// import io from 'socket.io-client';
import MapComponent from '../../components/Delivery-Partner/MapComponent';

// const socket = io(import.meta.env.VITE_API_URL);

function NavigateLocation() {
  const { orderId, partnerId } = useParams()

  return (
    <>
      <MapComponent orderId={orderId} partnerId={partnerId} />
    </>
  )
}

export default NavigateLocation