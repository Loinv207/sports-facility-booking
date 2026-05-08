import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Home, User, ArrowRight, CreditCard } from 'lucide-react';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const status = searchParams.get('status');
  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount');
  const isSuccess = status === 'success';

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50">
      <div className="w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-3xl">
        {/* Header decoration */}
        <div className={`h-3 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`} />
        
        <div className="p-8 text-center">
          {isSuccess ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Thanh toán thành công!</h2>
              <p className="mt-2 text-slate-500">Đơn đặt sân của bạn đã được hệ thống xác nhận.</p>
              
              <div className="p-5 my-8 space-y-3 border bg-slate-50 rounded-2xl border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Mã giao dịch:</span>
                  <span className="font-mono font-bold text-slate-700">#{bookingId}</span>
                </div>
                <div className="flex items-center justify-between pt-3 text-sm border-t border-slate-200">
                  <span className="text-slate-400">Số tiền đã cọc:</span>
                  <span className="text-lg font-bold text-emerald-600">
                    {new Intl.NumberFormat('vi-VN').format(amount / 100)} đ
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-red-50 ring-8 ring-red-50/50">
                  <XCircle className="w-16 h-16 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Thanh toán thất bại</h2>
              <p className="mt-2 font-medium text-slate-500">Giao dịch đã bị hủy hoặc gặp lỗi kết nối.</p>
            </>
          )}

          <div className="grid grid-cols-1 gap-3 mt-8">
            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center w-full gap-2 px-6 py-4 font-semibold text-white transition-all shadow-lg bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-slate-200"
            >
              <User size={18} /> Xem lịch sử đặt sân
            </button>
            
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center w-full gap-2 px-6 py-4 font-semibold transition-all bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-600 rounded-2xl"
            >
              <Home size={18} /> Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;