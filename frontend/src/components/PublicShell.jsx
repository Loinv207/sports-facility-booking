import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const PublicShell = ({ breadcrumb, children }) => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f8ff_0%,#eef5ff_100%)] text-slate-900">
      <header className="border-b border-blue-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link to="/" className="text-xl font-bold text-blue-700">Sports Now</Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-blue-700">Trang chủ</Link>
            {role === 'OWNER' && <Link to="/owner-management" className="hover:text-blue-700">Quản lý chủ sân</Link>}
            {token ? (
              <>
                <Link to="/profile" className="hover:text-blue-700">Hồ sơ</Link>
                <button type="button" onClick={handleLogout} className="rounded-xl border border-slate-200 px-3 py-2 hover:border-blue-300 hover:text-blue-700">Đăng xuất</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-700">Đăng nhập</Link>
                <Link to="/register" className="rounded-xl bg-blue-600 px-3 py-2 text-white hover:bg-blue-500">Đăng ký</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
        {breadcrumb ? <p className="mb-4 text-sm text-slate-500">{breadcrumb}</p> : null}
        {children}
      </main>
    </div>
  )
}

export default PublicShell
