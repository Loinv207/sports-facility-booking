import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Banknote,
  CalendarDays,
  ChevronLeft,
  ChevronUp,
  CircleAlert,
  CircleDollarSign,
  Clock3,
  Phone,
  Trophy,
  UsersRound,
  X,
} from 'lucide-react'

import './Payment.css'

const holdDurationSeconds = 10 * 60

const formatCurrency = (value) => {
  const amount = Number(value || 0)
  return `${new Intl.NumberFormat('vi-VN').format(amount)} đ`
}

const formatDate = (bookingDate) => {
  if (!bookingDate) {
    return 'Đang cập nhật'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${bookingDate}T00:00:00`))
}

const formatTime = (time) => {
  if (!time) {
    return '--h--'
  }

  const [hour, minute] = String(time).slice(0, 5).split(':')
  return `${hour}h${minute}`
}

const formatCountdown = (seconds) => {
  const safeSeconds = Math.max(0, Number(seconds || 0))
  const minutes = Math.floor(safeSeconds / 60)
  const remainSeconds = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainSeconds).padStart(2, '0')}`
}

const createOrderCode = (bookingId) => {
  if (!bookingId) {
    return '----'
  }

  const compact = String(bookingId).replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  return compact.slice(-6) || compact
}

const getStoredProfile = () => {
  if (typeof window === 'undefined') {
    return {}
  }

  return {
    fullName: localStorage.getItem('fullName') || '',
    username: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || '',
    phoneNumber: localStorage.getItem('phoneNumber') || '',
  }
}

const fallbackBooking = () => {
  try {
    const raw = sessionStorage.getItem('pendingBooking')
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error('Không đọc được pending booking từ sessionStorage', error)
    return null
  }
}

const calculateHoldSeconds = (createdAt) => {
  if (!createdAt) {
    return holdDurationSeconds
  }

  const createdTime = new Date(createdAt).getTime()
  if (Number.isNaN(createdTime)) {
    return holdDurationSeconds
  }

  const expiresAt = createdTime + holdDurationSeconds * 1000
  return Math.ceil((expiresAt - Date.now()) / 1000)
}

const InfoRow = ({ icon, label, children }) => (
  <div className="payment-info-row">
    <span className="payment-info-icon">
      {icon}
    </span>
    <span>
      <span className="payment-info-label">{label}</span>
      <span className="payment-info-value">{children}</span>
    </span>
  </div>
)

const PaymentTopbar = ({ onBack }) => (
  <header className="payment-topbar">
    <button type="button" className="payment-back-button" onClick={onBack} aria-label="Quay lại">
      <ChevronLeft aria-hidden="true" />
    </button>
    <h1>Thanh toán</h1>
  </header>
)

export const Payment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const initialBooking = useMemo(() => location.state?.booking || fallbackBooking(), [location.state])

  const [booking, setBooking] = useState(initialBooking)
  const [profile, setProfile] = useState(getStoredProfile)
  const [secondsLeft, setSecondsLeft] = useState(() => calculateHoldSeconds(initialBooking?.createdAt))
  const [isPaymentExpired, setIsPaymentExpired] = useState(() => {
    const status = String(initialBooking?.bookingStatus || '').toUpperCase()
    return Boolean(initialBooking) && (status === 'CANCELLED' || calculateHoldSeconds(initialBooking?.createdAt) <= 0)
  })
  const [redirectingVnpay, setRedirectingVnpay] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const cancelRequestStarted = useRef(false)
  const callbackHandled = useRef(false)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
  const orderCode = useMemo(() => createOrderCode(booking?.bookingId), [booking?.bookingId])
  const totalAmount = formatCurrency(booking?.totalPrice)
  const customerName = profile.fullName || profile.username || profile.email || 'Khách hàng Sports Now'
  const customerPhone = profile.phoneNumber || 'Chưa cập nhật'
  const scheduleTime = `${formatTime(booking?.startTime)} - ${formatTime(booking?.endTime)}`
  const canConfirm = booking?.bookingStatus === 'PENDING_PAYMENT'

  useEffect(() => {
    if (!booking?.bookingId || callbackHandled.current) {
      return
    }

    const searchParams = new URLSearchParams(location.search)
    const txnRef = searchParams.get('vnp_TxnRef')
    if (!txnRef) {
      return
    }

    callbackHandled.current = true

    const callbackParams = {}
    searchParams.forEach((value, key) => {
      callbackParams[key] = value
    })

    axios.get('/api/payment/callback', {
      params: callbackParams,
    }).then((response) => {
      setMessage(typeof response.data === 'string' ? response.data : 'Đã xử lý thanh toán VNPay.')
      setError('')

      if (!token) {
        return
      }

      return axios.get('/api/bookings/user', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((bookingResponse) => {
        const matched = (bookingResponse.data || []).find((item) => item.bookingId === booking.bookingId)
        if (matched) {
          setBooking(matched)
          sessionStorage.setItem('pendingBooking', JSON.stringify(matched))
        }
      })
    }).catch((requestError) => {
      setError(requestError.response?.data?.message || 'Không thể xử lý callback thanh toán VNPay.')
    })
  }, [booking?.bookingId, location.search, token])

  useEffect(() => {
    if (!token) {
      return
    }

    axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      const nextProfile = response.data || {}
      setProfile(nextProfile)

      if (nextProfile.username) localStorage.setItem('username', nextProfile.username)
      if (nextProfile.fullName) localStorage.setItem('fullName', nextProfile.fullName)
      if (nextProfile.email) localStorage.setItem('email', nextProfile.email)
      if (nextProfile.phoneNumber) localStorage.setItem('phoneNumber', nextProfile.phoneNumber)
    }).catch(() => {
      setProfile(getStoredProfile())
    })
  }, [token])

  useEffect(() => {
    setSecondsLeft(calculateHoldSeconds(booking?.createdAt))

    const timer = window.setInterval(() => {
      setSecondsLeft(calculateHoldSeconds(booking?.createdAt))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [booking?.createdAt])

  useEffect(() => {
    const status = String(booking?.bookingStatus || '').toUpperCase()

    if (!booking || status !== 'PENDING_PAYMENT' || secondsLeft > 0 || cancelRequestStarted.current) {
      return
    }

    cancelRequestStarted.current = true
    setIsPaymentExpired(true)

    if (!token) {
      return
    }

    axios.put(`/api/bookings/user/${booking.bookingId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      setBooking(response.data)
      sessionStorage.setItem('pendingBooking', JSON.stringify(response.data))
    }).catch(() => {
      sessionStorage.setItem('pendingBooking', JSON.stringify({
        ...booking,
        bookingStatus: 'CANCELLED',
        paymentStatus: 'CANCELLED',
      }))
    })
  }, [booking, secondsLeft, token])

  const handleBack = () => {
    if (booking?.fieldId) {
      navigate(`/pitch/${booking.fieldId}`)
      return
    }

    navigate('/search')
  }

  const handlePayWithVnpay = async () => {
    if (!booking?.bookingId || !token) {
      setError('Bạn cần đăng nhập và có booking hợp lệ để thanh toán VNPay.')
      return
    }

    try {
      setRedirectingVnpay(true)
      setError('')
      setMessage('')

      const response = await axios.post('/api/payment/vnpay', null, {
        params: { bookingId: booking.bookingId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const paymentUrl = response.data?.paymentUrl || response.data
      if (!paymentUrl || typeof paymentUrl !== 'string') {
        throw new Error('Không nhận được link thanh toán VNPay')
      }

      window.location.href = paymentUrl
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không tạo được link thanh toán VNPay.')
      setRedirectingVnpay(false)
    }
  }

  if (!booking) {
    return (
      <div className="payment-page">
        <PaymentTopbar onBack={handleBack} />
        <main className="payment-empty">
          <div className="payment-empty-card">
            <CircleAlert aria-hidden="true" />
            <h2>Không tìm thấy đơn thanh toán</h2>
            <p>Có thể bạn vừa tải lại trang hoặc chưa tạo booking từ trang chi tiết sân.</p>
            <div>
              <Link to="/search">Về trang tìm kiếm</Link>
              <Link to="/profile">Xem booking của tôi</Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (isPaymentExpired) {
    return (
      <div className="payment-page payment-expired-page">
        <PaymentTopbar onBack={() => navigate('/')} />
        <main className="payment-expired">
          <div className="payment-expired-illustration" aria-hidden="true">
            <div className="payment-expired-clock">
              <Clock3 />
            </div>
            <div className="payment-expired-x">
              <X />
            </div>
          </div>

          <h2>Lịch đặt đã bị hủy</h2>
          <p>Đơn đã quá giờ thanh toán. Vui lòng tạo đơn mới.</p>

          <div className="payment-expired-actions">
            <Link className="payment-expired-primary" to="/profile">Xem lịch đặt sân</Link>
            <Link className="payment-expired-secondary" to="/">Quay về</Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="payment-page">
      <PaymentTopbar onBack={handleBack} />

      <main className="payment-layout">
        <section className="payment-main">
          <div className="payment-bank-card">
            <div className="payment-bank-details">
              <h2>1. Thanh toán qua VNPay</h2>
              <p>
                <span>Mã đơn:</span>
                <strong>#{orderCode}</strong>
              </p>
              <p>
                <span>Trạng thái booking:</span>
                <strong>{booking?.bookingStatus || 'PENDING_PAYMENT'}</strong>
              </p>
              <p>
                <span>Trạng thái payment:</span>
                <strong>{booking?.paymentStatus || 'PENDING'}</strong>
              </p>
            </div>
          </div>

          <div className="payment-alert">
            <AlertTriangle aria-hidden="true" />
            <span>
              Thanh toán đơn <strong>{totalAmount}</strong> qua VNPay. Hệ thống chỉ ghi nhận thanh toán khi callback từ VNPay trả về hợp lệ.
            </span>
          </div>

          <div className="payment-note">
            <p>Bạn sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất giao dịch.</p>
            <p>Đơn của bạn còn được giữ chỗ trong</p>
            <strong>{formatCountdown(secondsLeft)}</strong>
          </div>

          {message ? <div className="payment-message success">{message}</div> : null}
          {error ? <div className="payment-message error">{error}</div> : null}
          <button
            type="button"
            className="payment-submit-button"
            disabled={redirectingVnpay || !canConfirm}
            onClick={handlePayWithVnpay}
          >
            {redirectingVnpay ? 'ĐANG CHUYỂN TỚI VNPAY...' : canConfirm ? 'THANH TOÁN VNPAY' : 'ĐÃ THANH TOÁN'}
          </button>
        </section>

        <aside className="payment-summary-card">
          <div className="payment-summary-header">
            <h2>Thông tin lịch đặt</h2>
            <ChevronUp aria-hidden="true" />
          </div>

          <div className="payment-info-list">
            <InfoRow icon={<UsersRound aria-hidden="true" />} label="Tên">
              {customerName}
            </InfoRow>
            <InfoRow icon={<Phone aria-hidden="true" />} label="SĐT">
              {customerPhone}
            </InfoRow>
            <InfoRow icon={<Trophy aria-hidden="true" />} label="Mã đơn">
              #{orderCode}
            </InfoRow>
            <InfoRow icon={<CalendarDays aria-hidden="true" />} label="Chi tiết đơn">
              {formatDate(booking.bookingDate)}
              <br />
              - {booking.fieldName || 'Sân đã chọn'}: {scheduleTime}
            </InfoRow>
            <InfoRow icon={<Banknote aria-hidden="true" />} label="Tổng đơn">
              {totalAmount}
            </InfoRow>
            <InfoRow icon={<CircleDollarSign aria-hidden="true" />} label="Cần thanh toán">
              {totalAmount}
            </InfoRow>
          </div>
        </aside>
      </main>

    </div>
  )
}
