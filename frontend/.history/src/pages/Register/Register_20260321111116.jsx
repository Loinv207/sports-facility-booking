import React from 'react';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-600 text-center mb-6">Đăng Ký Thành Viên</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
            <input type="text" placeholder="Nguyễn Văn A" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input type="tel" placeholder="090..." className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input type="password" placeholder="••••••••" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" />
          </div>

          <button className="w-full bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 transition duration-200">
            Tạo tài khoản
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-4">
          Đã có tài khoản? <a href="/login" className="text-green-600 hover:underline">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;