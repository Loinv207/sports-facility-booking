import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PublicShell from '../../components/PublicShell'
import './Home.css'

const danhSachAnhSan = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&q=80&w=1200',
]

const dinhDangGia = (gia) => {
  if (gia === null || gia === undefined || gia === '') {
    return 'Liên hệ'
  }

  const giaSo = Number(gia)
  if (Number.isNaN(giaSo)) {
    return `${gia} VND`
  }

  return `${new Intl.NumberFormat('vi-VN').format(giaSo)} VND`
}

const dinhDangDanhGia = (danhGia) => {
  if (danhGia === null || danhGia === undefined || danhGia === '') {
    return '4.5'
  }

  return Number(danhGia).toFixed(1)
}

const rutGonDiaChi = (diaChi) => {
  if (!diaChi) {
    return 'Khu vực đang cập nhật'
  }

  const phanDiaChi = diaChi.split(',').map((item) => item.trim()).filter(Boolean)
  return phanDiaChi.slice(0, 2).join(', ') || diaChi
}

const rutGonMoTa = (moTa) => {
  if (!moTa) {
    return 'Cơ sở thể thao được đánh giá tốt, phù hợp cho nhóm bạn và các buổi tập luyện định kỳ.'
  }

  return moTa.length > 115 ? `${moTa.slice(0, 112)}...` : moTa
}

const HomePage = () => {
  const navigate = useNavigate()
  const [danhSachSan, setDanhSachSan] = useState([])
  const [dangTai, setDangTai] = useState(true)
  const [tuKhoa, setTuKhoa] = useState('')

  useEffect(() => {
    const taiDanhSachSanDangHoatDong = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/fields/active')
        if (!response.ok) {
          throw new Error('Không thể tải danh sách sân')
        }

        const data = await response.json()
        setDanhSachSan(data)
      } catch (error) {
        console.error('Lỗi khi gọi API /api/fields/active:', error)
      } finally {
        setDangTai(false)
      }
    }

    taiDanhSachSanDangHoatDong()
  }, [])

  const xuLyTimKiem = () => {
    const tuKhoaDaCat = tuKhoa.trim()
    const thamSoTimKiem = new URLSearchParams()

    if (tuKhoaDaCat) {
      thamSoTimKiem.set('keyword', tuKhoaDaCat)
    }

    navigate(`/search${thamSoTimKiem.toString() ? `?${thamSoTimKiem.toString()}` : ''}`)
  }

  const tongSoCoSo = danhSachSan.length
  const tongMonTheThao = new Set(danhSachSan.map((san) => san.sportsType).filter(Boolean)).size
  const danhGiaTrungBinh = danhSachSan.length
    ? (
        danhSachSan.reduce((tong, san) => tong + Number(san.rating || 4.5), 0) / danhSachSan.length
      ).toFixed(1)
    : '0.0'

  return (
    <PublicShell>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="hero-breadcrumb">Trang chủ / Cơ sở thể thao</p>
          <span className="hero-kicker">Thể thao mỗi ngày</span>
          <h1 className="hero-title">Khám phá cơ sở thể thao phù hợp cho lịch tập của bạn</h1>
          <p className="hero-description">
            Tìm kiếm sân đang hoạt động, so sánh nhanh theo bộ môn, khu vực và mức giá để đặt lịch nhanh hơn.
          </p>

          <div className="hero-summary">
            <div className="summary-item">
              <strong>{dangTai ? '--' : tongSoCoSo}</strong>
              <span>Cơ sở hiển thị</span>
            </div>
            <div className="summary-item">
              <strong>{dangTai ? '--' : tongMonTheThao}</strong>
              <span>Môn thể thao</span>
            </div>
            <div className="summary-item">
              <strong>{dangTai ? '--' : danhGiaTrungBinh}</strong>
              <span>Đánh giá trung bình</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="search-panel">
            <div className="search-heading">
              <h2>Tìm nhanh cơ sở</h2>
              <p>Nhập tên sân, môn thể thao, địa chỉ hoặc từ khóa mô tả.</p>
            </div>

            <div className="search-box">
              <div className="search-input-wrap">
                <label htmlFor="field-search">Từ khóa</label>
                <input
                  id="field-search"
                  type="text"
                  placeholder="Ví dụ: cầu lông, Thủ Đức, sân 7 người..."
                  value={tuKhoa}
                  onChange={(e) => setTuKhoa(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      xuLyTimKiem()
                    }
                  }}
                />
              </div>
              <button type="button" className="search-button" onClick={xuLyTimKiem}>
                Tìm cơ sở
              </button>
            </div>

            <div className="quick-filters">
              <span>Sân đang mở</span>
              <span>Giá minh bạch</span>
              <span>Đặt lịch nhanh</span>
            </div>
          </div>
        </div>
      </section>

      <section className="fields-section">
        <div className="fields-header">
          <div>
            <span className="section-label">Danh sách nổi bật</span>
            <h2>Cơ sở thể thao đang hoạt động</h2>
            <p>
              Giao diện mới ưu tiên sự cân đối, dễ xem nhanh thông tin quan trọng và thao tác đặt sân.
            </p>
          </div>
          {!dangTai && <div className="field-count">{tongSoCoSo} cơ sở</div>}
        </div>

        {dangTai ? (
          <div className="empty-box">Đang tải dữ liệu từ hệ thống...</div>
        ) : danhSachSan.length === 0 ? (
          <div className="empty-box">Hiện tại chưa có cơ sở nào đang hoạt động.</div>
        ) : (
          <div className="field-grid">
            {danhSachSan.map((san, index) => (
              <article key={san.id} className="field-card">
                <div className="field-image">
                  <img
                    src={danhSachAnhSan[index % danhSachAnhSan.length]}
                    alt={san.fieldName}
                  />
                  <div className="image-overlay" />
                  <div className="field-badges">
                    <span className="field-type">{san.sportsType || 'Thể thao tổng hợp'}</span>
                    <span className="field-rating">★ {dinhDangDanhGia(san.rating)}</span>
                  </div>
                </div>

                <div className="field-content">
                  <div className="field-top">
                    <div>
                      <h3>{san.fieldName}</h3>
                      <p className="field-address">{rutGonDiaChi(san.address)}</p>
                    </div>
                    <span className="field-status">{san.status || 'ĐANG HOẠT ĐỘNG'}</span>
                  </div>

                  <p className="field-description">{rutGonMoTa(san.description)}</p>

                  <div className="field-meta">
                    <span>{san.sportsType || 'Đa môn'}</span>
                    <span>Có sân hoạt động</span>
                    <span>Đặt linh hoạt</span>
                  </div>

                  <div className="field-footer">
                    <div className="price-block">
                      <p className="price-label">Từ</p>
                      <p className="price-value">{dinhDangGia(san.price)}</p>
                    </div>
                    <Link to={`/pitch/${san.id}`} className="field-action">
                      Xem cơ sở
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PublicShell>
  )
}

export default HomePage
