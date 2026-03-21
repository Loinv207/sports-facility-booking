import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
  
      <div className="bg-blue-600 py-20 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Đặt Sân Thể Thao Dễ Dàng</h1>
        <p className="mb-8">Tìm kiếm và đặt sân bóng, cầu lông, tennis trong giây lát.</p>
        <div className="flex justify-center">
          <input 
            type="text" 
            placeholder="Tìm tên sân hoặc khu vực..." 
            className="px-4 py-2 w-1/3 rounded-l-md text-black focus:outline-none"
          />
          <button className="bg-orange-500 px-6 py-2 rounded-r-md font-semibold hover:bg-orange-600 transition">
            Tìm kiếm
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sân phổ biến</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-300"></div> 
              <div className="p-4">
                <h3 className="font-bold text-lg">Sân Bóng Đá Thống Nhất {item}</h3>
                <p className="text-gray-600 text-sm italic">Quận 10, TP.HCM</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-blue-600 font-bold">200.000đ/giờ</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Chi tiết</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;