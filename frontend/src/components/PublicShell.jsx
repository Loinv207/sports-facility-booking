import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const navLinkClass = ({ isActive }) =>
  `transition ${isActive ? 'text-blue-700' : 'text-slate-600 hover:text-slate-950'}`

const PublicShell = ({ breadcrumb, children, actions }) => {
  const navigate = useNavigate()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null

  const daDangNhap = Boolean(token)
  const laChuSan = role === 'OWNER'
  const tenHienThi = laChuSan ? 'Chủ sân' : 'Khách hàng'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
    window.location.reload()
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <header className="auth-topbar">
          <Link to="/" className="auth-brand">SPORTS NOW</Link>

          <nav className="auth-nav">
            <NavLink to="/" end className={navLinkClass}>Trang chủ</NavLink>
            <NavLink to="/search" className={navLinkClass}>Sân thể thao</NavLink>
            {laChuSan ? <NavLink to="/owner-management" className={navLinkClass}>Quản lý chủ sân</NavLink> : null}
            <a href="#footer" className="text-slate-600 transition hover:text-slate-950">Liên hệ</a>
          </nav>

          {daDangNhap ? (
            <div className="auth-userbar">
              <button type="button" className="auth-user-icon" aria-label="Tin nhắn">💬</button>
              <button type="button" className="auth-user-icon" aria-label="Thông báo">🔔</button>
              <Link to="/profile" className="auth-user-profile">
                <span className="auth-user-avatar">{laChuSan ? 'O' : 'U'}</span>
                <span className="auth-user-name">{tenHienThi}</span>
              </Link>
              <button type="button" className="auth-logout-button" onClick={handleLogout}>Đăng xuất</button>
            </div>
          ) : (
            <div className="auth-topbar-actions">
              <Link to="/login" className="auth-link-button is-ghost">Đăng nhập</Link>
              <Link to="/register" className="auth-link-button is-primary">Đăng ký</Link>
            </div>
          )}
        </header>

        {breadcrumb && <div className="auth-breadcrumb">{breadcrumb}</div>}

        {children}

        {actions}

        <footer id="footer" className="auth-footer">SPORTS NOW, giao diện đồng bộ giữa các trang công khai.</footer>
      </div>
    </div>
  )
}

export default PublicShell
