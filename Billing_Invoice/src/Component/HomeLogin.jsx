import React from 'react'

const HomeLogin = () => {
    return (
        <div>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <h1 className="text-2xl font-bold text-center mb-8">Welcome to Adventure Billing Invoices</h1>
                    <div className="space-y-4">
                        <button
                            onClick={() => window.location.href = '/admin-login'}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Admin Login
                        </button>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                            Cashier Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeLogin