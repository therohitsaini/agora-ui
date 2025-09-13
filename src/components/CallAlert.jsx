import React from 'react'

function CallAlert({ rejectCall, incomingCall, acceptCall }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 text-center">
                <h2 className="text-xl font-bold mb-4">
                    📞 Incoming {incomingCall.type} call from {incomingCall.fromUid}
                </h2>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={acceptCall}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Accept
                    </button>
                    <button
                        onClick={rejectCall}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CallAlert