import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Lấy status và bookingId từ URL mà BE vừa redirect về
    const status = searchParams.get('status');
    const bookingId = searchParams.get('bookingId');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 text-center bg-white shadow-lg rounded-2xl md:w-1/3">
                {status === 'success' ? (
                    <>
                        <div className="mb-4 text-6xl text-green-500">✅</div>
                        <h1 className="mb-2 text-2xl font-bold text-gray-800">Thanh toán thành công!</h1>
                        <p className="mb-6 text-gray-600">
                            Mã đặt sân của bạn là: <span className="font-mono font-bold text-blue-600">{bookingId}</span>
                        </p>
                        <button 
                            onClick={() => navigate('/my-bookings')}
                            className="w-full py-3 font-semibold text-white transition bg-green-500 rounded-lg hover:bg-green-600"
                        >
                            Xem lịch hẹn của tôi
                        </button>
                    </>
                ) : (
                    <>
                        <div className="mb-4 text-6xl text-red-500">❌</div>
                        <h1 className="mb-2 text-2xl font-bold text-gray-800">Thanh toán thất bại</h1>
                        <p className="mb-6 text-gray-600">Đã có lỗi xảy ra trong quá trình xử lý giao dịch.</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="w-full py-3 font-semibold text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
                        >
                            Quay lại trang chủ
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;