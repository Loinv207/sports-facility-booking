import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { UserRound } from 'lucide-react'

import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/', label: 'Trang chủ' },
  { to: '/search', label: 'Sân thể thao' },
  { to: '/owner-management', label: 'Cơ sở' },
  { to: '/profile', label: 'Đặt sân của tôi' },
]

const getProfileName = () => {
  const fullName = localStorage.getItem('fullName')
  const username = localStorage.getItem('username')
  const email = localStorage.getItem('email')

  return fullName || username || email || 'Profile'
}

const getInitials = (name) => {
  const trimmedName = String(name || '').trim()
  if (!trimmedName) {
    return 'P'
  }

  const parts = trimmedName.split(/\s+/).filter(Boolean)
  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase()
  }

  return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase()
}

export const SiteHeader = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const profileName = getProfileName()
  const initials = getInitials(profileName)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('username')
    localStorage.removeItem('fullName')
    localStorage.removeItem('email')
    navigate('/')
  }

  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 lg:px-6">
        <Link to="/" className="text-sm font-extrabold tracking-[0.16em] text-slate-950">
          SPORTS NOW
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          {navItems.map((item) => {
            const active = location.pathname === item.to

            return (
              <Link key={item.to} to={item.to} className={active ? 'font-semibold text-slate-950' : 'transition hover:text-slate-950'}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {token ? (
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="h-auto rounded-2xl border-slate-300 bg-white px-3 py-2">
              <Link to="/profile" className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  {initials}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Profile</span>
                  <span className="block max-w-[140px] truncate text-sm font-semibold text-slate-950">{profileName}</span>
                </span>
                <UserRound className="h-4 w-4 text-slate-500 sm:hidden" />
              </Link>
            </Button>
            <Button type="button" variant="outline" className="rounded-xl border-slate-300 bg-white" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="rounded-xl border-slate-300 bg-white">
              <Link to="/login">Đăng nhập</Link>
            </Button>
            <Button asChild className="rounded-xl">
              <Link to="/register">Đăng ký</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
