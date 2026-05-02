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
  Copy,
  Image as ImageIcon,
  Phone,
  Plus,
  Trophy,
  UsersRound,
  X,
} from 'lucide-react'

import './Payment.css'

const bankInfo = {
  accountName: 'Ho Ngoc Minh',
  accountNumber: '1032102190',
  bankName: 'Vietcombank',
  bankBin: '970436',
}

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
    console.error('Khong doc duoc pending booking tu sessionStorage', error)
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

const buildVietQrUrl = (booking, orderCode) => {
  const amount = Math.max(0, Math.round(Number(booking?.totalPrice || 0)))
  const addInfo = encodeURIComponent(`SPORTS NOW ${orderCode}`)
  const accountName = encodeURIComponent(bankInfo.accountName)

  return `https://img.vietqr.io/image/${bankInfo.bankBin}-${bankInfo.accountNumber}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`
}

const makePreview = (file) => ({
  file,
  preview: file?.type?.startsWith('image/') ? URL.createObjectURL(file) : '',
})

const UploadBox = ({ id, icon, fileState, title, required, onChange }) => (
  <label className={`payment-upload-box ${fileState ? 'has-file' : ''}`} htmlFor={id}>
    <input id={id} type="file" accept="image/*" className="sr-only" onChange={onChange} />
    {fileState?.preview ? (
      <img src={fileState.preview} alt={fileState.file.name} />
    ) : (
      <span className="payment-upload-placeholder">
        {icon}
        <span>{title}</span>
      </span>
    )}
    {fileState ? <span className="payment-upload-name">{fileState.file.name}</span> : null}
    {required ? <span className="payment-upload-required">(*)</span> : null}
  </label>
)

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
  const [paymentProof, setPaymentProof] = useState(null)
  const [discountProof, setDiscountProof] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(() => calculateHoldSeconds(initialBooking?.createdAt))
  const [isPaymentExpired, setIsPaymentExpired] = useState(() => {
    const status = String(initialBooking?.bookingStatus || '').toUpperCase()
    return Boolean(initialBooking) && (status === 'CANCELLED' || calculateHoldSeconds(initialBooking?.createdAt) <= 0)
  })
  const [submitting, setSubmitting] = useState(false)
  const [redirectingVnpay, setRedirectingVnpay] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [qrFailed, setQrFailed] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const cancelRequestStarted = useRef(false)
  const callbackHandled = useRef(false)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
  const orderCode = useMemo(() => createOrderCode(booking?.bookingId), [booking?.bookingId])
  const qrImageUrl = useMemo(() => buildVietQrUrl(booking, orderCode), [booking, orderCode])
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
      setMessage(typeof response.data === 'string' ? response.data : 'Da xu ly thanh toan VNPay.')
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
      setError(requestError.response?.data?.message || 'Khong the xu ly callback thanh toan VNPay.')
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
    setIsQrModalOpen(false)

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

  useEffect(() => () => {
    if (paymentProof?.preview) {
      URL.revokeObjectURL(paymentProof.preview)
    }
  }, [paymentProof])

  useEffect(() => () => {
    if (discountProof?.preview) {
      URL.revokeObjectURL(discountProof.preview)
    }
  }, [discountProof])

  useEffect(() => {
    if (!isQrModalOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsQrModalOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isQrModalOpen])

  const handleBack = () => {
    if (booking?.fieldId) {
      navigate(`/pitch/${booking.fieldId}`)
      return
    }

    navigate('/search')
  }

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(bankInfo.accountNumber)
      setMessage('Đã sao chép số tài khoản ngân hàng.')
      setError('')
    } catch {
      setError('Không thể sao chép tự động. Bạn vui lòng copy số tài khoản thủ công.')
    }
  }

  const handleSaveQr = () => {
    const link = document.createElement('a')
    link.href = qrImageUrl
    link.download = `sports-now-qr-${orderCode}.png`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleConfirmPayment = async () => {
    if (!paymentProof) {
      setError('Vui lòng tải ảnh thanh toán trước khi xác nhận đặt.')
      return
    }

    if (!booking?.bookingId || !token) {
      setError('Bạn cần đăng nhập lại để xác nhận thanh toán.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      setMessage('')

      const response = await axios.post(
        `/api/bookings/user/${booking.bookingId}/confirm-payment`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setBooking(response.data)
      sessionStorage.setItem('pendingBooking', JSON.stringify(response.data))
      setMessage('Đã xác nhận đặt sân. Bạn có thể kiểm tra trạng thái lịch đặt trong tài khoản.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể xác nhận thanh toán lúc này.')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayWithVnpay = async () => {
    if (!booking?.bookingId || !token) {
      setError('Ban can dang nhap va co booking hop le de thanh toan VNPay.')
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
        throw new Error('Khong nhan duoc link thanh toan VNPay')
      }

      window.location.href = paymentUrl
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Khong tao duoc link thanh toan VNPay.')
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
              <h2>1. Tài khoản ngân hàng</h2>
              <p>
                <span>Tên tài khoản:</span>
                <strong>{bankInfo.accountName}</strong>
              </p>
              <p>
                <span>Số tài khoản:</span>
                <strong>{bankInfo.accountNumber}</strong>
              </p>
              <p>
                <span>Ngân hàng:</span>
                <strong>{bankInfo.bankName}</strong>
              </p>
            </div>

            <button type="button" className="payment-copy-button" onClick={handleCopyAccount} aria-label="Sao chép số tài khoản">
              <Copy aria-hidden="true" />
            </button>

            <button type="button" className="payment-qr" onClick={() => setIsQrModalOpen(true)} aria-label="Mở mã QR thanh toán">
              {qrFailed ? (
                <div className="payment-qr-fallback">QR</div>
              ) : (
                <img src={qrImageUrl} alt="Mã QR chuyển khoản" onError={() => setQrFailed(true)} />
              )}
            </button>
          </div>

          <div className="payment-alert">
            <AlertTriangle aria-hidden="true" />
            <span>
              Vui lòng chuyển khoản <strong>{totalAmount}</strong> và gửi ảnh vào ô bên dưới để hoàn tất đặt lịch.
            </span>
          </div>

          <div className="payment-note">
            <p>Sau khi gửi ảnh, vui lòng kiểm tra trạng thái lịch đặt tại tab “Tài khoản” tới khi chủ sân xác nhận đơn.</p>
            <p>Đơn của bạn còn được giữ chỗ trong</p>
            <strong>{formatCountdown(secondsLeft)}</strong>
          </div>

          <div className="payment-upload-grid">
            <UploadBox
              id="payment-proof"
              icon={<ImageIcon aria-hidden="true" />}
              fileState={paymentProof}
              title="Nhấn vào để tải hình thanh toán"
              required
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) setPaymentProof(makePreview(file))
              }}
            />
            <UploadBox
              id="discount-proof"
              icon={<Plus aria-hidden="true" />}
              fileState={discountProof}
              title="Nhấn vào để tải minh chứng bạn là HSSV, hoặc đối tượng được ưu đãi khác."
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) setDiscountProof(makePreview(file))
              }}
            />
          </div>

          {message ? <div className="payment-message success">{message}</div> : null}
          {error ? <div className="payment-message error">{error}</div> : null}

          <button
            type="button"
            className="payment-submit-button"
            disabled={submitting || !canConfirm}
            onClick={handleConfirmPayment}
          >
            {submitting ? 'ĐANG XÁC NHẬN...' : canConfirm ? 'XÁC NHẬN ĐẶT' : 'ĐÃ XÁC NHẬN'}
          </button>
          <button
            type="button"
            className="payment-submit-button"
            disabled={redirectingVnpay || !canConfirm}
            onClick={handlePayWithVnpay}
          >
            {redirectingVnpay ? 'DANG CHUYEN TOI VNPAY...' : canConfirm ? 'THANH TOAN VNPAY' : 'DA THANH TOAN'}
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

      {isQrModalOpen ? (
        <div className="payment-qr-modal" role="dialog" aria-modal="true" aria-labelledby="payment-qr-modal-title">
          <div className="payment-qr-modal-header">
            <h2 id="payment-qr-modal-title">Mã QR thanh toán</h2>
            <button type="button" className="payment-qr-modal-close" onClick={() => setIsQrModalOpen(false)} aria-label="Đóng mã QR">
              <X aria-hidden="true" />
            </button>
          </div>

          <div className="payment-qr-modal-body">
            {qrFailed ? (
              <div className="payment-qr-modal-fallback">QR</div>
            ) : (
              <img className="payment-qr-modal-image" src={qrImageUrl} alt="Mã QR thanh toán" onError={() => setQrFailed(true)} />
            )}
            <div className="payment-qr-modal-info">
              <strong>{bankInfo.accountName}</strong>
              <span>{bankInfo.accountNumber}</span>
              <span>{bankInfo.bankName}</span>
            </div>
          </div>

          <div className="payment-qr-modal-actions">
            <button type="button" className="payment-qr-save-button" onClick={handleSaveQr}>
              Lưu mã QR
            </button>
            <button type="button" className="payment-qr-copy-button" onClick={handleCopyAccount}>
              Sao chép STK
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
