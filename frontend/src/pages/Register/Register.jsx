import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import PublicShell from '../../components/PublicShell'
import '../Login/Auth.css'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    role: 'USER',
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getErrorMessage = (error) => {
    const data = error.response?.data

    if (data?.details?.length) {
      return data.details.map((item) => item.message || item.field).filter(Boolean).join(' ')
    }

    return data?.message || 'Đăng ký thất bại'
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')

    const payload = {
      ...formData,
      username: formData.username.trim(),
      email: formData.email.trim(),
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
    }

    if (payload.phoneNumber && !/^[0-9]{9,15}$/.test(payload.phoneNumber)) {
      setErrorMessage('Số điện thoại chỉ nhập 9-15 chữ số.')
      setLoading(false)
      return
    }

    try {
      await axios.post('/api/auth/register', payload)
      navigate('/login')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicShell breadcrumb="Trang chủ / Đăng ký">
      <section className="auth-panel">
        <div className="auth-form-side">
          <div className="auth-copy">
            <h1>Đăng ký</h1>
            <p>Tạo tài khoản đầy đủ để đặt sân hoặc quản lý sân ngay trên hệ thống SPORTS NOW.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Họ và tên</label>
              <input
                name="fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="auth-field">
              <label>Tên tài khoản</label>
              <input
                name="username"
                type="text"
                placeholder="NguyenVanA"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label>Số điện thoại</label>
              <input
                name="phoneNumber"
                type="tel"
                placeholder="0900000000"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength={15}
              />
            </div>

            <div className="auth-field">
              <label>Vai trò</label>
              <select name="role" value={formData.role} onChange={handleChange} className="auth-select" required>
                <option value="USER">Khách hàng</option>
                <option value="OWNER">Chủ sân</option>
              </select>
            </div>

            <div className="auth-field">
              <label>Mật khẩu</label>
              <input
                name="password"
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {errorMessage && <div className="auth-error">{errorMessage}</div>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </button>

            <div className="auth-divider">
              <span>Hoặc</span>
            </div>

            <div className="auth-socials">
              <button type="button" className="auth-social">Google</button>
              <button type="button" className="auth-social">Facebook</button>
            </div>

            <p className="auth-switch">
              Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </p>
          </form>
        </div>

        <div className="auth-visual-side">
          <div className="auth-visual-box">
            <div className="auth-visual-placeholder" />
            <div className="auth-benefits">
              <h2>Bắt đầu cùng SPORTS NOW</h2>
              <ul>
                <li>Khách hàng có thể tìm sân và đặt lịch nhanh</li>
                <li>Chủ sân có thể quản lý booking và doanh thu</li>
                <li>Dữ liệu tài khoản đồng bộ đúng với database hệ thống</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}

export default RegisterPage
