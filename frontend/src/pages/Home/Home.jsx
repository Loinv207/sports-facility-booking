import React from 'react'
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import './Home.css';

const HomePage = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchActiveFields = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/fields/active');

        if (!response.ok) {
          throw new Error('Không thể tải danh sách sân');
        }

        const data = await response.json();
        setFields(data);
      } catch (error) {
        console.error('Lỗi khi gọi API /api/fields/active:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveFields();
  }, []);

  const filteredFields = fields.filter((field) =>
    field.fieldName?.toLowerCase().includes(keyword.toLowerCase()) ||
    field.description?.toLowerCase().includes(keyword.toLowerCase())
  );

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
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-container">
          <p className="hero-subtitle">Sports Now</p>
          <h1 className="hero-title">Khám phá và đặt sân thể thao dễ dàng</h1>
          <p className="hero-description">
            Tìm kiếm các sân đang hoạt động, xem mô tả chi tiết và lựa chọn địa điểm phù hợp cho nhu cầu luyện tập của bạn.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm theo tên sân hoặc mô tả..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="button">Tìm kiếm</button>
          </div>
        </div>
      </section>

      <section className="fields-section">
        <div className="fields-header">
          <div>
            <h2>Danh sách sân đang hoạt động</h2>
            <p>Hiển thị dữ liệu thật từ backend API</p>
          </div>

          {!loading && <div className="field-count">{filteredFields.length} sân</div>}
        </div>

        {loading ? (
          <div className="empty-box">Đang tải dữ liệu...</div>
        ) : filteredFields.length === 0 ? (
          <div className="empty-box">Không có sân nào để hiển thị.</div>
        ) : (
          <div className="field-grid">
            {filteredFields.map((field) => (
              <div key={field.id} className="field-card">
                <div className="field-image">
                  <img
                    src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200"
                    alt={field.fieldName}
                  />
                </div>

                <div className="field-content">
                  <div className="field-top">
                    <h3>{field.fieldName}</h3>
                    <span className="field-status">{field.status}</span>
                  </div>

                  <p className="field-description">
                    {field.description || 'Chưa có mô tả cho sân này.'}
                  </p>

                  <div className="field-tags">
                    <span>Bóng đá</span>
                    <span>Sân ngoài trời</span>
                    <span>Đặt ngay</span>
                  </div>

                  <div className="field-footer">
                    <div>
                      <p className="price-label">Giá tham khảo</p>
                      <p className="price-value">100.000đ/giờ</p>
                    </div>

                    <button>Xem chi tiết</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage