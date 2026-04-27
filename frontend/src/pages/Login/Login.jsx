import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import PublicShell from '../../components/PublicShell'
import './Auth.css'

const Login = () => {
  const navigate = useNavigate()
  const [shellKey, setShellKey] = useState(0)
  const [credentials, setCredentials] = useState({ usernameOrEmail: '', password: '' })
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', credentials)

      localStorage.setItem('token', response.data.accessToken)
      localStorage.setItem('role', response.data.user.role)
      setShellKey((prev) => prev + 1)

      if (remember) {
        localStorage.setItem('rememberedUsername', credentials.usernameOrEmail)
      } else {
        localStorage.removeItem('rememberedUsername')
      }

      if (response.data.user.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else if (response.data.user.role === 'OWNER') {
        navigate('/owner-management')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error(error)
      setErrorMessage(error.response?.data?.message || 'Sai tài khoản hoặc mật khẩu.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername')
    if (rememberedUsername) {
      setCredentials((prev) => ({ ...prev, usernameOrEmail: rememberedUsername }))
    }
  }, [])

  return (
    <PublicShell key={shellKey} breadcrumb="Trang chủ / Đăng nhập">
      <section className="auth-panel">
          <div className="auth-form-side">
            <div className="auth-copy">
              <h1>Đăng nhập</h1>
              <p>Đăng nhập để quản lý lịch đặt sân và tiếp tục sử dụng dịch vụ.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label>Email hoặc số điện thoại</label>
                <input
                  name="usernameOrEmail"
                  type="text"
                  placeholder="example@gmail.com"
                  value={credentials.usernameOrEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-field">
                <label>Mật khẩu</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-row auth-row-between">
                <label className="auth-check">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <button type="button" className="auth-inline-button">Quên mật khẩu?</button>
              </div>

              {errorMessage && <div className="auth-error">{errorMessage}</div>}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>

              <div className="auth-divider">
                <span>Hoặc</span>
              </div>

              <div className="auth-socials">
                <button type="button" className="auth-social">Google</button>
                <button type="button" className="auth-social">Facebook</button>
              </div>

              <p className="auth-switch">
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
              </p>
            </form>
          </div>

          <div className="auth-visual-side">
            <div className="auth-visual-box">
              <div className="auth-visual-placeholder" />
              <div className="auth-benefits">
                <h2>Nền tảng đặt sân hàng đầu</h2>
                <ul>
                  <li>Đặt sân nhanh chóng</li>
                  <li>Theo dõi lịch đặt dễ dàng</li>
                  <li>Thanh toán tiện lợi</li>
                </ul>
              </div>
            </div>
          </div>
      </section>
    </PublicShell>
  )
}

export default Login
