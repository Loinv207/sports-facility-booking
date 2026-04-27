import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PublicShell from '../../components/PublicShell'

const duLieuDatSan = [
  {
    id: 'DS001',
    tenSan: 'Sân bóng đá mini A1',
    diaDiem: 'Quận 7, TP.HCM',
    ngay: '24/04/2026',
    gio: '18:00 - 19:30',
    trangThai: 'Đã xác nhận',
    tongTien: '450.000 đ',
  },
  {
    id: 'DS002',
    tenSan: 'Sân cầu lông Trung Sơn',
    diaDiem: 'Bình Chánh, TP.HCM',
    ngay: '26/04/2026',
    gio: '07:00 - 08:30',
    trangThai: 'Đang chờ',
    tongTien: '180.000 đ',
  },
]

const thongKe = [
  { label: 'Lượt đặt sân', value: '12' },
  { label: 'Sân yêu thích', value: '5' },
  { label: 'Ví ưu đãi', value: '320.000 đ' },
]

const Profile = () => {
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null
  const laChuSan = role === 'OWNER'
  const [avatarUrl, setAvatarUrl] = useState('')
  const [profileId, setProfileId] = useState('')
  const [fullName, setFullName] = useState(laChuSan ? 'Chủ sân Sports Now' : 'Khách hàng Sports Now')
  const [phoneNumber, setPhoneNumber] = useState('0900000000')
  const [email, setEmail] = useState('example@gmail.com')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const username = payload.sub
      if (!username) return

      axios.get('http://localhost:8080/api/users', {
        params: { search: username, page: 0, size: 1 },
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        const user = response.data?.content?.[0]
        if (!user) return
        setProfileId(user.id)
        setFullName(user.fullname || '')
        setPhoneNumber(user.phoneNumber || '')
        setEmail(user.email || '')
        setAvatarUrl(user.avatarUrl || '')
      }).catch(() => {})
    } catch (error) {
      console.error(error)
    }
  }, [])

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token')
    if (!token || !profileId) return

    await axios.put(`http://localhost:8080/api/users/${profileId}/profile`, {
      fullName,
      phoneNumber,
      email,
      avatarUrl,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  return (
    <PublicShell breadcrumb="Trang chủ / Hồ sơ">
      <section className="profile-page">
        <div className="profile-hero-card">
          <div className="profile-hero-content">
            <div className="profile-avatar profile-avatar-large">{avatarUrl ? <img src={avatarUrl} alt="Ảnh đại diện" className="profile-avatar-image" /> : (laChuSan ? 'O' : 'U')}</div>
            <div>
              <p className="profile-kicker">Tài khoản cá nhân</p>
              <h1>{laChuSan ? 'Hồ sơ chủ sân' : 'Hồ sơ khách hàng'}</h1>
              <p className="profile-description">
                Quản lý thông tin cá nhân, theo dõi lịch đặt sân và cập nhật trạng thái tài khoản ở cùng một nơi.
              </p>
            </div>
          </div>

          <div className="profile-stat-grid">
            {thongKe.map((item) => (
              <div key={item.label} className="profile-stat-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-layout">
          <section className="profile-card">
            <div className="profile-card-header">
              <div>
                <p className="profile-section-label">Thông tin tài khoản</p>
                <h2>Thông tin cá nhân</h2>
              </div>
            </div>

            <div className="profile-avatar-editor">
              <div className="profile-avatar profile-avatar-medium">
                {avatarUrl ? <img src={avatarUrl} alt="Ảnh đại diện" className="profile-avatar-image" /> : (laChuSan ? 'O' : 'U')}
              </div>
              <div className="profile-avatar-actions">
                <label className="profile-button ghost profile-upload-button">
                  Tải ảnh đại diện
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => setAvatarUrl(reader.result)
                        reader.readAsDataURL(file)
                      }
                    }}
                    hidden
                  />
                </label>
                {avatarUrl ? <button type="button" className="profile-button ghost" onClick={() => setAvatarUrl('')}>Xóa ảnh</button> : null}
              </div>
            </div>

            <div className="profile-form-grid">
              <div className="profile-field">
                <label>Họ và tên</label>
                <input type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} />
              </div>
              <div className="profile-field">
                <label>Số điện thoại</label>
                <input type="text" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} />
              </div>
              <div className="profile-field">
                <label>Email</label>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className="profile-field">
                <label>Vai trò</label>
                <input type="text" defaultValue={laChuSan ? 'Chủ sân' : 'Khách hàng'} />
              </div>
            </div>

            <div className="profile-actions">
              <button type="button" className="profile-button primary" onClick={handleSaveProfile}>Lưu thay đổi</button>
              <button type="button" className="profile-button ghost">Đổi mật khẩu</button>
            </div>
          </section>

          <section className="profile-card">
            <div className="profile-card-header">
              <div>
                <p className="profile-section-label">Hoạt động gần đây</p>
                <h2>Lịch đặt sân của tôi</h2>
              </div>
            </div>

            <div className="profile-booking-list">
              {duLieuDatSan.map((item) => (
                <article key={item.id} className="profile-booking-item">
                  <div>
                    <h3>{item.tenSan}</h3>
                    <p>{item.diaDiem}</p>
                  </div>
                  <div className="profile-booking-meta">
                    <span>{item.ngay}</span>
                    <span>{item.gio}</span>
                    <span className={`profile-status ${item.trangThai === 'Đã xác nhận' ? 'success' : 'pending'}`}>{item.trangThai}</span>
                    <strong>{item.tongTien}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </PublicShell>
  )
}

export { Profile }
