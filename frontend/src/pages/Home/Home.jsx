import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 py-20 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Sports Now</h1>
        <p className="mb-8">Quản lý và đặt sân thể thao nhanh gọn hơn.</p>
        <div className="flex justify-center gap-3 flex-wrap px-4">
          <Link to="/owner-management" className="bg-white text-blue-700 px-6 py-3 rounded-md font-semibold hover:bg-blue-50 transition">
            Thêm sân mới
          </Link>
          <Link to="/login" className="bg-orange-500 px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition">
            Đăng nhập
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Chức năng nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Chủ sân thêm sân mới',
              desc: 'Tạo sân mới với trạng thái PENDING để admin duyệt.',
            },
            {
              title: 'Khách hàng xem sân ACTIVE',
              desc: 'Hiển thị danh sách sân đang hoạt động trên trang chủ.',
            },
            {
              title: 'Admin duyệt sân',
              desc: 'Quản lý sân chờ duyệt và kích hoạt nhanh.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-2 bg-blue-600"></div>
              <div className="p-5">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage