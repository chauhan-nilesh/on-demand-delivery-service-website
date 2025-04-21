import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "./Map.css";
import toast from "react-hot-toast";
import io from 'socket.io-client';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const socket = io(import.meta.env.VITE_SOCKET_URL);

const MapComponent = ({ orderId, partnerId }) => {
  const [location, setLocation] = useState(null);
  const [order, setOrder] = useState({});
  const [start, setStart] = useState([19.028295, 72.845403]) //default location when page load
  const [end, setEnd] = useState([0, 0])

  const navigate = useNavigate()

  const getOrderData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/get-data/${orderId}`)

      if (response.ok) {
        const responseData = await response.json()
        setOrder(responseData.data)
        if (responseData.data) {
          if (responseData.data?.orderStatus === "Accepted") {
            setEnd([Number(responseData.data?.pickupAddress?.coordinates?.lat), Number(responseData.data?.pickupAddress?.coordinates?.lng)])
          } else if (responseData.data?.orderStatus === "Picked") {
            setEnd([Number(responseData.data?.deliveryAddress?.coordinates?.lat), Number(responseData.data?.deliveryAddress?.coordinates?.lng)])
          } else if(responseData.data?.orderStatus === "Delivered") {
            setEnd([Number(responseData.data?.deliveryAddress?.coordinates?.lat), Number(responseData.data?.deliveryAddress?.coordinates?.lng)])
          }
        }
      } else {
        toast.error("Failed to fetch order details")
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getOrderData()
  }, [])


  useEffect(() => {
    if (partnerId) {
      socket.on('location-update', ({ partnerId: id, coordinates }) => {
        if (id === partnerId) {
          setLocation({ lat: coordinates[0], lng: coordinates[1] });
        }
      });

      return () => socket.off('location-update');
    }
  }, [partnerId])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setStart([latitude, longitude])
        axios.post(`${import.meta.env.VITE_API_URL}/api/partner/update-location`, {
          partnerId,
          coordinates: { lat: latitude, lng: longitude }
        });
      });
    }
  }, [end]);

  useEffect(() => {

    const map = L.map("map").setView(start, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const startIcon = L.icon({
      iconUrl: "/start.png",
      iconSize: [32, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });

    const endIcon = L.icon({
      iconUrl: "/destination.png",
      iconSize: [32, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });

    L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      lineOptions: {
        styles: [{ color: "blue", weight: 5 }],
      },
      addWaypoints: false,
      routeWhileDragging: true,
      createMarker: function (i, waypoint) {
        if (i === 0) {
          return L.marker(waypoint.latLng, { icon: startIcon }).bindPopup(
            "Partner Point"
          );
        } else if (i === 1) {
          return L.marker(waypoint.latLng, { icon: endIcon }).bindPopup(
            order?.orderStatus === "Assigned" ? "Pickup Point" : "Destination Point"
          );
        }
        return null;
      },
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, [start, end]);

  const updateOrderStatus = async (status) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/update-status/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status,
          partnerId
        })
      })

      if(response.ok){
          toast.success("Order status updated successfully")
          if(status === "Delivered"){
            navigate("/partner/orders")
          } else {
            getOrderData()
          }
      } else{
        toast.error("Something went wrong while updating order status")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div id="map" className="h-[60vh] lg:h-[70vh] w-full" />
      <div className='p-6 lg:flex justify-between pb-20 lg:pb-0'>
        <div>
          <Link to={`/partner/orders/${orderId}`}><p className='text-sm lg:text-lg font-bold mb-3'>Order ID: <span className='font-normal'>#{order?._id}</span></p></Link>
          <p className='text-sm lg:text-lg font-bold mb-3'>Pickup Address: <span className='font-normal'>{order?.pickupAddress?.text}</span></p>
          <p className='text-sm lg:text-lg font-bold mb-3'>Delivery Address: <span className='font-normal'>{order?.deliveryAddress?.text}</span></p>
          <p className='text-sm lg:text-lg font-bold mb-3'>Earning: <span className='font-normal'>&#8377;{order?.deliveryCharges}</span></p>
          <p className='text-sm lg:text-lg font-bold'>Delivery Status: <span className={`${order?.orderStatus === "Delivered" ? "text-green-700" : "text-yellow-700"} font-extrabold`}>{order?.orderStatus}</span></p>
        </div>
        <div>
          {order?.orderStatus === "Accepted" ?
            <input
              className="bg-yellow-700 font-semibold text-white w-full rounded-xl text-lg px-6 py-2 mt-6 cursor-pointer"
              type="button"
              value="Picked Up"
              onClick={(e) => updateOrderStatus("Picked")}
            />
            : order?.orderStatus === "Picked" ?
              <input
                className="bg-green-700 font-semibold text-white w-full rounded-xl text-lg px-6 py-2 mt-6 cursor-pointer"
                type="button"
                value="Delivered"
                onClick={(e) => updateOrderStatus("Delivered")}
              />
              : null
          }
        </div>
      </div>
    </>
  )
};

export default MapComponent;
