import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import PublicShell from '../../components/PublicShell'

const emptyPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const getApiErrorMessage = (error, fallback) => {
  const details = error.response?.data?.details
  if (Array.isArray(details) && details.length > 0) {
    return details[0].message || fallback
  }

  return error.response?.data?.message || fallback
}

const formatCurrency = (value) => {
  const amount = Number(value || 0)
  return `${new Intl.NumberFormat('vi-VN').format(amount)} đ`
}

const formatBookingDate = (value) => {
  if (!value) return 'Đang cập nhật'

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

const formatBookingTime = (startTime, endTime) => {
  if (!startTime || !endTime) return 'Đang cập nhật'
  return `${String(startTime).slice(0, 5)} - ${String(endTime).slice(0, 5)}`
}

const bookingStatusConfig = {
  PENDING_PAYMENT: { label: 'Chờ thanh toán', className: 'pending' },
  COMPLETED: { label: 'Đã hoàn tất', className: 'success' },
  CANCELLED: { label: 'Đã hủy', className: 'cancelled' },
  BOOKED: { label: 'Đã đặt', className: 'success' },
}

const getBookingStatus = (status) => {
  return bookingStatusConfig[String(status || '').toUpperCase()] || {
    label: status || 'Đang cập nhật',
    className: 'pending',
  }
}

const Profile = () => {
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null
  const laChuSan = role === 'OWNER'
  const [avatarUrl, setAvatarUrl] = useState('')
  const [fullName, setFullName] = useState(laChuSan ? 'Chủ sân Sports Now' : 'Khách hàng Sports Now')
  const [phoneNumber, setPhoneNumber] = useState('0900000000')
  const [email, setEmail] = useState('example@gmail.com')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm)
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [bookingError, setBookingError] = useState('')

  const profileStats = useMemo(() => {
    const completedCount = bookings.filter((booking) => booking.bookingStatus === 'COMPLETED').length
    const pendingCount = bookings.filter((booking) => booking.bookingStatus === 'PENDING_PAYMENT').length

    return [
      { label: 'Lượt đặt sân', value: String(bookings.length) },
      { label: 'Đã hoàn tất', value: String(completedCount) },
      { label: 'Chờ thanh toán', value: String(pendingCount) },
    ]
  }, [bookings])

  const syncProfile = useCallback((user) => {
    setFullName(user.fullName || user.fullname || '')
    setPhoneNumber(user.phoneNumber || '')
    setEmail(user.email || '')
    setAvatarUrl(user.avatarUrl || '')

    if (user.username) localStorage.setItem('username', user.username)
    if (user.fullName || user.fullname) localStorage.setItem('fullName', user.fullName || user.fullname)
    if (user.email) localStorage.setItem('email', user.email)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      syncProfile(response.data)
    }).catch((error) => {
      setProfileError(error.response?.data?.message || 'Không thể tải thông tin hồ sơ.')
    })
  }, [syncProfile])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || role !== 'USER') {
      setBookings([])
      return
    }

    const fetchBookings = async () => {
      setLoadingBookings(true)
      setBookingError('')

      try {
        const response = await axios.get('/api/bookings/user', {
          headers: { Authorization: `Bearer ${token}` },
        })

        setBookings(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        setBookings([])
        setBookingError(getApiErrorMessage(error, 'Không thể tải lịch sử đặt sân.'))
      } finally {
        setLoadingBookings(false)
      }
    }

    fetchBookings()
  }, [role])

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setProfileError('Bạn cần đăng nhập lại để lưu hồ sơ.')
      return
    }

    setSavingProfile(true)
    setProfileMessage('')
    setProfileError('')

    try {
      const response = await axios.put('/api/auth/me', {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        avatarUrl,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      syncProfile(response.data)
      setProfileMessage('Đã lưu thay đổi hồ sơ.')
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Không thể lưu thay đổi hồ sơ.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordInputChange = (event) => {
    const { name, value } = event.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleTogglePasswordForm = () => {
    if (showPasswordForm) {
      setPasswordForm(emptyPasswordForm)
    }
    setShowPasswordForm((prev) => !prev)
    setPasswordMessage('')
    setPasswordError('')
  }

  const handleChangePassword = async (event) => {
    event.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      setPasswordError('Bạn cần đăng nhập lại để đổi mật khẩu.')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Xác nhận mật khẩu mới không khớp.')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Mật khẩu mới cần tối thiểu 8 ký tự.')
      return
    }

    setSavingPassword(true)
    setPasswordMessage('')
    setPasswordError('')

    try {
      await axios.put('/api/auth/me/password', passwordForm, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setPasswordForm(emptyPasswordForm)
      setPasswordMessage('Đã đổi mật khẩu.')
    } catch (error) {
      setPasswordError(getApiErrorMessage(error, 'Không thể đổi mật khẩu.'))
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <PublicShell>
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
            {profileStats.map((item) => (
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
              <button type="button" className="profile-button primary" onClick={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
              <button type="button" className="profile-button ghost" onClick={handleTogglePasswordForm}>
                {showPasswordForm ? 'Đóng đổi mật khẩu' : 'Đổi mật khẩu'}
              </button>
            </div>

            {profileMessage && <div className="profile-message success">{profileMessage}</div>}
            {profileError && <div className="profile-message error">{profileError}</div>}

            {showPasswordForm && (
              <form className="profile-password-form" onSubmit={handleChangePassword}>
                <div className="profile-form-grid">
                  <div className="profile-field">
                    <label>Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInputChange}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                  <div className="profile-field">
                    <label>Mật khẩu mới</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInputChange}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                  </div>
                  <div className="profile-field">
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordInputChange}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                  </div>
                </div>

                <div className="profile-actions">
                  <button type="submit" className="profile-button primary" disabled={savingPassword}>
                    {savingPassword ? 'Đang đổi...' : 'Cập nhật mật khẩu'}
                  </button>
                  <button type="button" className="profile-button ghost" onClick={() => setPasswordForm(emptyPasswordForm)} disabled={savingPassword}>
                    Xóa nội dung
                  </button>
                </div>

                {passwordMessage && <div className="profile-message success">{passwordMessage}</div>}
                {passwordError && <div className="profile-message error">{passwordError}</div>}
              </form>
            )}
          </section>

          <section className="profile-card">
            <div className="profile-card-header">
              <div>
                <p className="profile-section-label">Hoạt động gần đây</p>
                <h2>Lịch đặt sân của tôi</h2>
              </div>
            </div>

            <div className="profile-booking-list">
              {loadingBookings && <div className="profile-empty-state">Đang tải lịch sử đặt sân...</div>}
              {!loadingBookings && bookingError && <div className="profile-message error">{bookingError}</div>}
              {!loadingBookings && !bookingError && bookings.length === 0 && (
                <div className="profile-empty-state">Bạn chưa có lịch đặt sân nào.</div>
              )}
              {!loadingBookings && !bookingError && bookings.map((booking) => {
                const status = getBookingStatus(booking.bookingStatus)

                return (
                  <article key={booking.bookingId} className="profile-booking-item">
                    <div>
                      <h3>{booking.fieldName || booking.fieldId || 'Sân thể thao'}</h3>
                      <p>
                        Mã booking: {booking.bookingId}
                        {booking.paymentStatus ? ` | Thanh toán: ${booking.paymentStatus}` : ''}
                      </p>
                    </div>
                    <div className="profile-booking-meta">
                      <span>{formatBookingDate(booking.bookingDate)}</span>
                      <span>{formatBookingTime(booking.startTime, booking.endTime)}</span>
                      <span className={`profile-status ${status.className}`}>{status.label}</span>
                      <strong>{formatCurrency(booking.totalPrice)}</strong>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        </div>
      </section>
    </PublicShell>
  )
}

export { Profile }
