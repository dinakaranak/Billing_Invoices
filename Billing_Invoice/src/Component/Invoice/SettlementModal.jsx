import React from 'react';
import Modal from 'react-modal';
import { FiX, FiPrinter } from 'react-icons/fi';

const SettlementModal = ({ data, onClose, onPrint }) => {
    // Calculate totals
    const totalSales = data.reduce((sum, item) => sum + (item.totalSales || 0), 0);
    const totalQuantity = data.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);

    return (
        <Modal
            isOpen={true}
            onRequestClose={onClose}
            contentLabel="Settlement Report"
            className="modal bg-white rounded-lg p-6 max-w-4xl mx-auto my-8 max-h-[80vh] overflow-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <div className="relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Today's Settlement Report</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={onPrint}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            <FiPrinter /> Print
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            <FiX />
                        </button>
                    </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-800">Total Products Sold</h3>
                        <p className="text-2xl font-bold">{data.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-800">Total Quantity Sold</h3>
                        <p className="text-2xl font-bold">{totalQuantity}</p>
                    </div>
                </div>

                <div className="overflow-auto">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left border-b font-medium text-gray-700">Product Code</th>
                                <th className="px-4 py-2 text-left border-b font-medium text-gray-700">Product Name</th>
                                <th className="px-4 py-2 text-left border-b font-medium text-gray-700">Quantity Sold</th>
                                <th className="px-4 py-2 text-left border-b font-medium text-gray-700">Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 border-b">
                                    <td className="px-4 py-3">{item.productCode}</td>
                                    <td className="px-4 py-3">{item.productName}</td>
                                    <td className="px-4 py-3">{item.totalQuantity}</td>
                                    <td className="px-4 py-3 font-medium">₹{item.totalSales.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg col-span-2 text-right">
                    <h3 className="text-lg font-semibold text-purple-800">Total Sales Amount</h3>
                    <p className="text-2xl font-bold">₹{totalSales.toFixed(2)}</p>
                </div>
            </div>
        </Modal>
    );
};

export default SettlementModal;