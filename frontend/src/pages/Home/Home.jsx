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
      <a className="floating-messenger" href="https://m.me" target="_blank" rel="noreferrer" aria-label="Liên hệ Messenger">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.914 1.454 5.514 3.726 7.213V22l3.223-1.768c.968.27 1.994.418 3.051.418 5.523 0 10-4.145 10-9.259C22 6.145 17.523 2 12 2zm1.064 12.445-2.548-2.718-4.968 2.718 5.465-5.807 2.62 2.718 4.896-2.718-5.465 5.807z" fill="currentColor"/>
        </svg>
      </a>

      <section className="home-hero home-hero-compact">
        <div className="hero-shell-card">
          <div className="hero-text-overlay">
            <span className="hero-kicker hero-kicker-center">Thể thao mỗi ngày</span>
            <h1 className="hero-title hero-title-center">Đặt sân thể thao dễ dàng và nhanh hơn mỗi ngày</h1>
            <p className="hero-description hero-description-center">
              Tìm kiếm và đặt lịch các sân bóng đá, cầu lông, tennis và nhiều môn thể thao khác với giao diện sáng, rõ và dễ thao tác hơn.
            </p>

            <div className="hero-actions">
              <button type="button" className="hero-primary-action" onClick={xuLyTimKiem}>Đặt sân ngay</button>
              <Link to="/search" className="hero-secondary-action">Xem sân phổ biến</Link>
            </div>
          </div>

          <div className="hero-bottom-panel">
            <div className="hero-search-wide">
              <div className="hero-search-grid">
                <div className="hero-search-field">
                  <label>Từ khóa</label>
                  <input
                    id="field-search"
                    type="text"
                    placeholder="Ví dụ: cầu lông, Thủ Đức..."
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
                <div className="hero-search-field">
                  <label>Môn thể thao</label>
                  <div className="hero-search-value">Bóng đá, cầu lông, tennis</div>
                </div>
                <div className="hero-search-field">
                  <label>Trạng thái</label>
                  <div className="hero-search-value">Sân đang hoạt động</div>
                </div>
                <button type="button" className="hero-search-submit" onClick={xuLyTimKiem}>
                  Tìm sân
                </button>
              </div>
            </div>

            <div className="hero-summary hero-summary-compact">
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
        </div>
      </section>

      <section className="fields-section">
        <div className="fields-header">
          <div>
            <span className="section-label">Danh sách nổi bật</span>
            <h2>Sân đang hoạt động</h2>
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
