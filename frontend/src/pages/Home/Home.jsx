import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Home.css'

const fieldImages = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&q=80&w=1200',
]

const formatPrice = (price) => {
  if (price === null || price === undefined || price === '') {
    return 'Lien he'
  }

  const numericPrice = Number(price)
  if (Number.isNaN(numericPrice)) {
    return `${price} VND`
  }

  return `${new Intl.NumberFormat('vi-VN').format(numericPrice)} VND`
}

const formatRating = (rating) => {
  if (rating === null || rating === undefined || rating === '') {
    return '4.5'
  }

  return Number(rating).toFixed(1)
}

const getShortAddress = (address) => {
  if (!address) {
    return 'Khu vuc dang cap nhat'
  }

  const parts = address.split(',').map((item) => item.trim()).filter(Boolean)
  return parts.slice(0, 2).join(', ') || address
}

const getShortDescription = (description) => {
  if (!description) {
    return 'Co so the thao duoc xep hang tot, phu hop cho nhom ban va cac buoi tap luyen dinh ky.'
  }

  return description.length > 115 ? `${description.slice(0, 112)}...` : description
}

const HomePage = () => {
  const navigate = useNavigate()
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    const fetchActiveFields = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/fields/active')
        if (!response.ok) {
          throw new Error('Khong the tai danh sach san')
        }

        const data = await response.json()
        setFields(data)
      } catch (error) {
        console.error('Loi khi goi API /api/fields/active:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActiveFields()
  }, [])

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim()
    const searchParams = new URLSearchParams()

    if (trimmedKeyword) {
      searchParams.set('keyword', trimmedKeyword)
    }

    navigate(`/search${searchParams.toString() ? `?${searchParams.toString()}` : ''}`)
  }

  const totalVisible = fields.length
  const totalSports = new Set(fields.map((field) => field.sportsType).filter(Boolean)).size
  const averageRating = fields.length
    ? (
        fields.reduce((sum, field) => sum + Number(field.rating || 4.5), 0) / fields.length
      ).toFixed(1)
    : '0.0'

  return (
    <div className="home-page">
      <div className="home-shell">
        <header className="home-topbar">
          <Link to="/" className="home-brand">
            SPORTS NOW
          </Link>

          <nav className="home-nav">
            <Link to="/" className="home-nav-link">Trang chu</Link>
            <Link to="/search" className="home-nav-link">San the thao</Link>
            <Link to="/owner-management" className="home-nav-link">Co so</Link>
            <Link to="/profile" className="home-nav-link">Dat san cua toi</Link>
          </nav>

          <div className="home-auth">
            <Link to="/login" className="home-auth-link home-auth-login">
              Dang nhap
            </Link>
            <Link to="/register" className="home-auth-link home-auth-register">
              Dang ky
            </Link>
          </div>
        </header>

        <section className="home-hero">
          <div className="hero-copy">
            <p className="hero-breadcrumb">Trang chu / Co so the thao</p>
            <span className="hero-kicker">Sports now</span>
            <h1 className="hero-title">Khám phá cơ sở thể thao phù hợp cho lịch tập của bạn</h1>
            <p className="hero-description">
              Tim kiem san dang hoat dong, so sanh nhanh theo bo mon, khu vuc va muc gia de dat lich nhanh hon.
            </p>

            <div className="hero-summary">
              <div className="summary-item">
                <strong>{loading ? '--' : totalVisible}</strong>
                <span>Co so hien thi</span>
              </div>
              <div className="summary-item">
                <strong>{loading ? '--' : totalSports}</strong>
                <span>Mon the thao</span>
              </div>
              <div className="summary-item">
                <strong>{loading ? '--' : averageRating}</strong>
                <span>Danh gia trung binh</span>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="search-panel">
              <div className="search-heading">
                <h2>Tim nhanh co so</h2>
                <p>Nhap ten san, mon the thao, dia chi hoac tu khoa mo ta.</p>
              </div>

              <div className="search-box">
                <div className="search-input-wrap">
                  <label htmlFor="field-search">Tu khoa</label>
                  <input
                    id="field-search"
                    type="text"
                    placeholder="Vi du: cau long, Thu Duc, san 7 nguoi..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSearch()
                      }
                    }}
                  />
                </div>
                <button type="button" className="search-button" onClick={handleSearch}>
                  Tim co so
                </button>
              </div>

              <div className="quick-filters">
                <span>San dang mo</span>
                <span>Gia minh bach</span>
                <span>Dat lich nhanh</span>
              </div>
            </div>
          </div>
        </section>

        <section className="fields-section">
          <div className="fields-header">
            <div>
              <span className="section-label">Danh sach noi bat</span>
              <h2>Cơ sở thể thao đang hoạt động</h2>
              <p>
                Giao dien moi uu tien su can doi, de xem nhanh thong tin quan trong va thao tac dat san.
              </p>
            </div>
            {!loading && <div className="field-count">{totalVisible} co so</div>}
          </div>

          {loading ? (
            <div className="empty-box">Dang tai du lieu tu he thong...</div>
          ) : fields.length === 0 ? (
            <div className="empty-box">Hien tai chua co co so nao dang hoat dong.</div>
          ) : (
            <div className="field-grid">
              {fields.map((field, index) => (
                <article key={field.id} className="field-card">
                  <div className="field-image">
                    <img
                      src={fieldImages[index % fieldImages.length]}
                      alt={field.fieldName}
                    />
                    <div className="image-overlay" />
                    <div className="field-badges">
                      <span className="field-type">{field.sportsType || 'The thao tong hop'}</span>
                      <span className="field-rating">★ {formatRating(field.rating)}</span>
                    </div>
                  </div>

                  <div className="field-content">
                    <div className="field-top">
                      <div>
                        <h3>{field.fieldName}</h3>
                        <p className="field-address">{getShortAddress(field.address)}</p>
                      </div>
                      <span className="field-status">{field.status || 'ACTIVE'}</span>
                    </div>

                    <p className="field-description">{getShortDescription(field.description)}</p>

                    <div className="field-meta">
                      <span>{field.sportsType || 'Da mon'}</span>
                      <span>Co san hoat dong</span>
                      <span>Dat linh hoat</span>
                    </div>

                    <div className="field-footer">
                      <div className="price-block">
                        <p className="price-label">Tu</p>
                        <p className="price-value">{formatPrice(field.price)}</p>
                      </div>
                      <Link to={`/pitch/${field.id}`} className="field-action">
                        Xem co so
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default HomePage
