import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Track = () => {
    const [track, setTrack] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate(`/track/${track}`)
    };

    return (
        <div className="flex items-center justify-center min-h-96    bg-white">
            <div className="flex flex-col md:flex-row items-center w-full p-8">

                <div className="lg:flex items-center lg:w-[50%] shadow-md bg-white h-24 lg:h-32 space-x-7 p-4 lg:p-8 rounded-[20px] lg:rounded-[30px] mt-4">
                    <input
                        type="text"
                        placeholder="Order ID"
                        className="w-4/5 h-14 px-4 rounded-lg bg-white outline-none border-2 border-[#E2E5EA]"
                        name="awbNumber"
                        value={track} // Controlled input
                        onChange={(e) => setTrack(e.target.value)} // Handle changes
                    />
                    <div className="flex justify-center items-center gap-2 lg:p-3 p-2 bg-theme-orange rounded-lg w-60 xl:w-56 cursor-pointer">
                        <button
                            className="font-bold rounded-lg px-3 py-3 bg-[#FFB500] text-[14px] xl:text-base"
                            onClick={handleSubmit}
                        >
                            Track Shipment
                        </button>
                    </div>
                </div>


                <div className="md:w-1/2 w-full flex justify-center mt-6 md:mt-0">
                    <div className="relative h-[400px]">
                        <img
                            src="/track.png"
                            alt="Order Tracking"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Track;