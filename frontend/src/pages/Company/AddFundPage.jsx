import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import dateFormat from "dateformat";
import { useAuth } from "../../store/auth";

const AddFundPage = () => {
    const [searchParams] = useSearchParams()
    const [upiId, setUpiId] = useState("");
    const [isQrVisible, setIsQrVisible] = useState(false);
    const [selectOption, setSelectOption] = useState(false);
    const [loadingBtn, setLoadingBtn] = useState(false)
    const navigate = useNavigate()
    const { companyData, isLoading } = useAuth()
    const [tId, setTId] = useState("")
    const [timeLeft, setTimeLeft] = useState(30);
    const [qrLoading, setQrLoading] = useState(true)

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        `upi://pay?pa=9004627910@amazonpay&pn=UPI&am=${searchParams.get("amt")}&cu=INR&tn=OrderId:${tId}`
    )}`;

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handlePay = async (e) => {
        e.preventDefault()
        if (upiId.trim() === "") {
            toast.error("Please enter a valid UPI ID.");
            return;
        }
        if (!searchParams.get("amt")) {
            toast.error("Invalid amount");
            return;
        }
        setLoadingBtn(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transaction/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    companyId: companyData?._id,
                    wallet: searchParams.get("wallet"),
                    amt: searchParams.get("amt")
                })
            })

            const responseData = await response.json()
            if (response.ok) {
                setTId(responseData.data._id)
                setTimeLeft(30)
            } else {
                toast.error("Something went wrong. Try again after 15 minutes")
                navigate("/company/finances")
            }
            setLoadingBtn(false)
        } catch (error) {
            console.log(error)
        }
        setIsQrVisible(true);
    };

    const handleDone = async (e) => {
        e.preventDefault()
        setLoadingBtn(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transaction/complete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    companyId: companyData?._id,
                    tId: tId,
                    status: "success",
                    upiId: upiId
                })
            })

            const responseData = await response.json()
            if (response.ok) {
                toast.success("Your is Payment currently in review. It will take 1 to 4 hours to be verified.");
                setUpiId("");
                setIsQrVisible(false);
                navigate("/company/finances")
            } else {
                toast.error("Something went wrong. Try again after 15 minutes")
                navigate("/company/finances")
            }
            setLoadingBtn(false)
        } catch (error) {
            console.log(error)
        }

    };

    if (isLoading) {
        return <div className='flex h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    if (loadingBtn) {
        return <div className='flex h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <>
            <main data-theme="light" className="mx-3 lg:mx-10 flex my-10 justify-center items-center">
                {/* Conditional Rendering: Show Form or QR Code */}
                {!isQrVisible ? (
                   
                    <>
                        <div className="bg-gray-100 rounded-xl h-auto w-full md:w-[600px] px-3 lg:px-8 py-6">
                            <h1 className="flex flex-wrap justify-center font-bold text-2xl mb-6">Add Funds</h1>
                            <form>

                                {/* Subscription Plan Selection */}
                                <div className="mt-5">
                                    <h2 className="text-lg font-semibold mb-2">Amount: &#8377;{searchParams.get("amt")}</h2>
                                </div>

                                <h4 className="mt-5 text-lg font-semibold">Payment Methods:</h4>
                                <div className="relative mt-2">
                                    <input
                                        className="peer hidden"
                                        id="radio_1"
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        onChange={(e) => setSelectOption(true)}
                                    />
                                    <span className="peer-checked:border-slate-900 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                                    <label className="peer-checked:border-2 peer-checked:border-slate-900 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4" htmlFor="radio_1">
                                        <img className="w-10 lg:w-14 object-contain" src="/upi.png" alt="" />
                                        <div className="ml-5">
                                            <span className="mt-2 font-semibold">UPI</span>
                                            <p className="text-slate-500 text-base leading-6">Pay through any UPI App</p>
                                        </div>
                                    </label>
                                </div>
                                {/* UPI ID Input */}
                                {(selectOption && <input
                                    className="mt-5 px-4 py-3 bg-gray-200 rounded-lg outline-none w-full"
                                    type="text"
                                    placeholder="Enter UPI ID"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                />)}
                                <p className="text-zinc-700 text-xs ml-2">Eg: abc@bank</p>

                                {/* Pay Button */}
                                <input
                                    className="bg-zinc-900 text-white w-full rounded-lg px-4 py-3 mt-6 cursor-pointer"
                                    type="button"
                                    value="Pay"
                                    onClick={handlePay}
                                />
                            </form>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-white shadow-lg rounded-lg pt-5 px-1 mx-5">
                            <div className="flex justify-between items-center border-b px-3 pb-4">
                                <img
                                    className="h-6"
                                    src="/amazonpay.png"
                                    alt="UPI"
                                />
                                <span className="text-sm text-zinc-900 font-bold bg-zinc-300 p-2 truncate ml-3 rounded-lg">ID: #{tId}</span>
                            </div>

                            <div className="bg-white rounded-lg rounded-t-none p-6 max-w-lg w-full">
                                {/* Header Section */}

                                {/* QR Code Section */}
                                <div className="mt-6 flex flex-col items-center">
                                    {qrLoading && <div className='flex h-52 w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>}
                                    <img
                                        src={qrUrl}
                                        alt="QR Code"
                                        className="w-40 h-40 border"
                                        onLoad={() => setQrLoading(false)}
                                        style={{ display: qrLoading ? "none" : "block" }}
                                    />
                                    {/* <p className="text-lg font-semibold text-gray-800 mt-3">HANDLE@UPI</p> */}
                                    <p className="text-center text-sm text-gray-600 mt-2">
                                        Scan the QR Code with any UPI apps like BHIM, Paytm, Google Pay, PhonePe, or any banking UPI app to make
                                        payment for this order. After successful payment, <span className="font-bold">click on done.</span>
                                    </p>
                                </div>

                                {/* Payment Options */}
                                <div className="flex justify-center mt-4 space-x-4">
                                    <img
                                        className="h-6"
                                        src="/upi.png"
                                        alt="UPI"
                                    />
                                    <img
                                        className="h-5"
                                        src="/gpay.png"
                                        alt="GPay"
                                    />
                                    <img
                                        className="h-5"
                                        src="/phonepe.png"
                                        alt="PhonePe"
                                    />
                                    <img
                                        className="h-5"
                                        src="/paytm.png"
                                        alt="Paytm"
                                    />
                                </div>

                                {/* Payment Info */}
                                <div className="mt-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-bold text-gray-800">₹ {searchParams.get("amt")}</p>
                                        <p className="text-sm text-gray-600">{upiId}</p>
                                    </div>

                                    {/* Countdown Timer */}
                                    {timeLeft === 0 ?

                                        <button onClick={handleDone} className="mt-4 bg-zinc-900 text-zinc-100 text-sm py-2 px-4 rounded flex items-center justify-center">
                                            Done
                                        </button>
                                        :
                                        <div className="mt-4 bg-zinc-900 text-zinc-100 text-sm py-2 px-4 rounded flex items-center justify-between">
                                            <span>Waiting...</span>
                                            <span className="font-bold">00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </main>
        </>
    );
};

export default AddFundPage;
