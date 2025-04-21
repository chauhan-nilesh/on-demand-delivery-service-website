import React from 'react'
import { useEffect } from 'react'

function Error() {
    useEffect(() => {
        window.scrollTo(0, 0);
    },[])
    return (
        <section className="flex items-center h-screen p-3 lg:p-16 bg-gray-50 text-gray-800">
            <div className="container flex flex-col items-center justify-center mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-2 lg:mb-8 font-extrabold text-5xl lg:text-9xl text-gray-400">
                        <span className="sr-only">Error</span>404
                    </h2>
                    <p className="text-xl font-semibold lg:text-3xl">Sorry, we couldn't find this page.</p>
                    <p className="mt-4 mb-8 text-gray-600">But don't worry, you can find plenty of other things on our homepage.</p>
                    <a rel="noopener noreferrer" href="/" className="px-4 py-2 lg:px-8 lg:py-3 font-semibold text-sm rounded bg-slate-900 text-gray-50">Back to homepage</a>
                </div>
            </div>
        </section>
    )
}

export default Error