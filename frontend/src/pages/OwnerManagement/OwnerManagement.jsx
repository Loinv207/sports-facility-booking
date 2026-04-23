import React, { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import PublicShell from '../../components/PublicShell'

const API_BASE = 'http://localhost:8080'

const emptyField = {
  fieldName: '',
  sportsType: '',
  address: '',
  price: '',
  description: '',
  status: 'PENDING',
}

const emptySchedule = {
  scheduleDate: '',
  startTime: '06:00',
  endTime: '22:00',
  price: '',
  slotMinutes: 60,
}

const emptyCenter = {
  id: '',
  name: '',
  address: '',
  city: '',
  phone: '',
  description: '',
  approvalStatus: 'PENDING',
}

const emptyCheckIn = {
  bookingId: '',
  extraCash: '',
  note: '',
}

const ownerTabs = [
  { id: 'tong-quan', label: 'Tổng quan' },
  { id: 'don-dat', label: 'Đơn đặt sân' },
  { id: 'doanh-thu', label: 'Doanh thu' },
  { id: 'tao-san', label: 'Tạo sân mới' },
  { id: 'san-bong', label: 'Quản lý sân' },
  { id: 'co-so', label: 'Thông tin cơ sở' },
]

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')} đ`

const formatPrice = (value) => {
  const digits = String(value || '').replace(/\D/g, '')
  if (!digits) return '0 VND/giờ'
  return `${Number(digits).toLocaleString('vi-VN')} VND/giờ`
}

const panelClass = 'rounded-[28px] border border-blue-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] shadow-[0_20px_60px_rgba(59,130,246,0.08)]'
const softCardClass = 'rounded-3xl border border-slate-200 bg-white p-5'
const inputClass = 'h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
const textAreaClass = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'

const DashboardCard = ({ title, description, children, action, className = '' }) => (
  <section className={`${panelClass} ${className}`}>
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-blue-50 px-6 py-5">
      <div>
        <h2 className="text-[22px] font-bold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {action}
    </div>
    <div className="px-6 py-6">{children}</div>
  </section>
)

const SummaryBadge = ({ label, value }) => (
  <div className="rounded-3xl border border-blue-100 bg-white px-4 py-4 shadow-sm">
    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
    <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
  </div>
)

const TextInput = ({ label, ...props }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
    <input {...props} className={inputClass} />
  </div>
)

const TextArea = ({ label, ...props }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
    <textarea {...props} className={textAreaClass} />
  </div>
)

const ActionButton = ({ children, tone = 'default', className = '', ...props }) => {
  const tones = {
    default: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
    blue: 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_18px_30px_rgba(37,99,235,0.18)]',
    emerald: 'bg-emerald-500 text-white hover:bg-emerald-400',
    violet: 'bg-violet-500 text-white hover:bg-violet-400',
    rose: 'bg-rose-500 text-white hover:bg-rose-400',
    ghost: 'border border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-700',
  }

  return (
    <button
      {...props}
      className={`rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  )
}

const statusTone = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  HIDDEN: 'bg-slate-100 text-slate-700 border-slate-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

const PreviewCard = ({ field, badge = 'Sẵn sàng gửi duyệt', badgeTone = 'emerald' }) => {
  const badgeClass = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-blue-100 bg-white shadow-sm">
      <div className="flex h-[210px] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.22),transparent_45%),linear-gradient(180deg,#f8fbff_0%,#dbeafe_100%)]">
        <div className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${badgeClass[badgeTone]}`}>
          {badge}
        </div>
      </div>
      <div className="space-y-3 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-700">{String(field.sportsType).toUpperCase()}</span>
          <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${statusTone[field.status] || statusTone.PENDING}`}>{field.status}</span>
        </div>
        <h3 className="text-[30px] font-bold leading-tight text-slate-900">{field.fieldName}</h3>
        <p className="text-[20px] font-semibold text-blue-700">{formatPrice(field.price)}</p>
        <p className="text-sm leading-6 text-slate-500">{field.address}</p>
        <p className="text-sm leading-6 text-slate-600">{field.description}</p>
      </div>
    </div>
  )
}

const OwnerManagement = () => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')

  if (!token || userRole !== 'OWNER') {
    return <Navigate to="/" replace />
  }

  const [activeTab, setActiveTab] = useState('tong-quan')
  const [fieldForm, setFieldForm] = useState(emptyField)
  const [scheduleForm, setScheduleForm] = useState(emptySchedule)
  const [centerForm, setCenterForm] = useState(emptyCenter)
  const [updateForm, setUpdateForm] = useState(emptyField)
  const [imageLinks, setImageLinks] = useState([''])
  const [field, setField] = useState(null)
  const [fields, setFields] = useState([])
  const [images, setImages] = useState([])
  const [schedules, setSchedules] = useState([])
  const [bookings, setBookings] = useState([])
  const [revenue, setRevenue] = useState(null)
  const [checkInForm, setCheckInForm] = useState(emptyCheckIn)
  const [statusMessage, setStatusMessage] = useState('')
  const [isSavingField, setIsSavingField] = useState(false)

  const previewField = field || {
    ...fieldForm,
    fieldName: fieldForm.fieldName || 'Sân bóng đá mini A1',
    sportsType: fieldForm.sportsType || 'Sân bóng đá',
    address: fieldForm.address || '123 Nguyễn Văn A, Quận 7, TP.HCM',
    price: fieldForm.price || '300000',
    description: fieldForm.description || 'Sân cỏ nhân tạo chất lượng cao, có đèn chiếu sáng, khu gửi xe và khu nghỉ cho cầu thủ.',
    status: 'PENDING',
  }

  const canCreateField = useMemo(() => {
    return fieldForm.fieldName.trim() && fieldForm.sportsType.trim() && fieldForm.address.trim()
  }, [fieldForm])

  const selectedFieldId = field?.id || fields[0]?.id || ''

  useEffect(() => {
    bootstrap()
  }, [])

  useEffect(() => {
    if (!selectedFieldId) return
    loadImages(selectedFieldId)
    loadSchedules(selectedFieldId)
  }, [selectedFieldId])

  const bootstrap = async () => {
    await Promise.all([loadFields(), loadBookings(), loadRevenue()])
  }

  const loadFields = async () => {
    const response = await fetch(`${API_BASE}/api/fields`)
    if (!response.ok) return
    const data = await response.json()
    setFields(data)
    if (!field && data.length) {
      setField(data[0])
      setUpdateForm({
        fieldName: data[0].fieldName || '',
        sportsType: data[0].sportsType || '',
        address: data[0].address || '',
        price: data[0].price || '',
        description: data[0].description || '',
        status: data[0].status || 'PENDING',
      })
    }
  }

  const loadImages = async (id) => {
    const response = await fetch(`${API_BASE}/api/owner/fields/${id}/images`)
    if (response.ok) {
      setImages(await response.json())
    }
  }

  const loadSchedules = async (id) => {
    const response = await fetch(`${API_BASE}/api/owner/fields/${id}/schedules`)
    if (response.ok) {
      setSchedules(await response.json())
    }
  }

  const loadBookings = async () => {
    const response = await fetch(`${API_BASE}/api/owner/bookings`)
    if (!response.ok) return
    setBookings(await response.json())
  }

  const loadRevenue = async () => {
    const response = await fetch(`${API_BASE}/api/owner/reports/revenue`)
    if (!response.ok) return
    setRevenue(await response.json())
  }

  const handleFieldChange = ({ target }) => {
    const { name, value } = target
    setFieldForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateChange = ({ target }) => {
    const { name, value } = target
    setUpdateForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleScheduleChange = ({ target }) => {
    const { name, value } = target
    setScheduleForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCenterChange = ({ target }) => {
    const { name, value } = target
    setCenterForm((prev) => ({ ...prev, [name]: value }))
  }

  const createField = async (event) => {
    event.preventDefault()
    setIsSavingField(true)
    setStatusMessage('')

    try {
      const response = await fetch(`${API_BASE}/api/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldForm),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo sân mới')
      }

      setField(data)
      setFields((prev) => [data, ...prev])
      setUpdateForm({
        fieldName: data.fieldName || '',
        sportsType: data.sportsType || '',
        address: data.address || '',
        price: data.price || '',
        description: data.description || '',
        status: data.status || 'PENDING',
      })
      setFieldForm(emptyField)
      setStatusMessage('Tạo sân thành công. M có thể thêm ảnh, lịch và cấu hình tiếp ở các tab bên dưới.')
    } catch (error) {
      setStatusMessage(error.message || 'Có lỗi xảy ra khi tạo sân.')
    } finally {
      setIsSavingField(false)
    }
  }

  const saveImages = async () => {
    if (!selectedFieldId) {
      setStatusMessage('Tạo hoặc chọn sân trước rồi mới thêm ảnh được.')
      return
    }

    const imageUrls = imageLinks.map((url) => url.trim()).filter(Boolean)
    if (!imageUrls.length) {
      setStatusMessage('Nhập ít nhất 1 link ảnh.')
      return
    }

    const response = await fetch(`${API_BASE}/api/owner/fields/${selectedFieldId}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrls }),
    })

    const data = await response.json()
    if (!response.ok) {
      setStatusMessage(data.message || 'Không thể lưu ảnh.')
      return
    }

    setImages(data)
    setImageLinks([''])
    setStatusMessage('Đã lưu thư viện ảnh.')
  }

  const deleteImage = async (imageId) => {
    const response = await fetch(`${API_BASE}/api/owner/fields/images/${imageId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      setStatusMessage('Không thể xóa ảnh.')
      return
    }

    setImages((prev) => prev.filter((image) => image.id !== imageId))
    setStatusMessage('Đã xóa ảnh khỏi thư viện.')
  }

  const createSchedules = async () => {
    if (!selectedFieldId) {
      setStatusMessage('Tạo hoặc chọn sân trước rồi mới thêm lịch được.')
      return
    }

    const response = await fetch(`${API_BASE}/api/owner/fields/${selectedFieldId}/schedules/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...scheduleForm,
        price: Number(scheduleForm.price),
        slotMinutes: Number(scheduleForm.slotMinutes),
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      setStatusMessage(data.message || 'Không thể tạo khung giờ.')
      return
    }

    setSchedules(data)
    setStatusMessage('Đã tạo lịch cho sân.')
  }

  const saveCenter = async () => {
    if (!centerForm.id.trim()) {
      setStatusMessage('Nhập mã trung tâm trước khi lưu.')
      return
    }

    const response = await fetch(`${API_BASE}/api/owner/centers/${centerForm.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(centerForm),
    })

    const data = await response.json()
    if (!response.ok) {
      setStatusMessage(data.message || 'Không thể lưu thông tin trung tâm.')
      return
    }

    setCenterForm((prev) => ({ ...prev, ...data }))
    setStatusMessage('Đã cập nhật thông tin trung tâm.')
  }

  const selectField = (currentField) => {
    setField(currentField)
    setUpdateForm({
      fieldName: currentField.fieldName || '',
      sportsType: currentField.sportsType || '',
      address: currentField.address || '',
      price: currentField.price || '',
      description: currentField.description || '',
      status: currentField.status || 'PENDING',
    })
  }

  const updateField = async () => {
    if (!selectedFieldId) {
      setStatusMessage('Chưa có sân để cập nhật.')
      return
    }

    const response = await fetch(`${API_BASE}/api/fields/${selectedFieldId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updateForm,
        price: Number(updateForm.price),
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      setStatusMessage(data.message || 'Không thể cập nhật sân.')
      return
    }

    setField(data)
    setFields((prev) => prev.map((item) => (item.id === data.id ? data : item)))
    setStatusMessage('Đã cập nhật thông tin sân.')
  }

  const hideField = async () => {
    if (!selectedFieldId) {
      setStatusMessage('Chưa có sân để ẩn.')
      return
    }

    const response = await fetch(`${API_BASE}/api/fields/${selectedFieldId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      setStatusMessage('Không thể ẩn sân.')
      return
    }

    await loadFields()
    setStatusMessage('Đã ẩn sân khỏi danh sách hoạt động.')
  }

  const updateBookingStatus = async (bookingId, status) => {
    const response = await fetch(`${API_BASE}/api/owner/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note: status === 'REJECTED' ? 'Chủ sân từ chối do không giữ được khung giờ.' : 'Chủ sân đã xác nhận lịch.' }),
    })

    const data = await response.json()
    if (!response.ok) {
      setStatusMessage(data.message || 'Không thể cập nhật đơn đặt sân.')
      return
    }

    setBookings((prev) => prev.map((item) => (item.id === data.id ? data : item)))
    setStatusMessage(`Đã chuyển đơn đặt sang ${data.status}.`)
    await loadRevenue()
  }

  const checkInBooking = async (bookingId) => {
    const response = await fetch(`${API_BASE}/api/owner/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId,
        extraCash: Number(checkInForm.extraCash || 0),
        note: checkInForm.note,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      setStatusMessage(data.message || 'Không thể check-in.')
      return
    }

    setBookings((prev) => prev.map((item) => (item.id === data.id ? data : item)))
    setCheckInForm(emptyCheckIn)
    setStatusMessage('Check-in thành công, đơn đặt đã chuyển sang COMPLETED.')
    await loadRevenue()
  }

  const chartBars = revenue?.chart || []
  const maxRevenue = Math.max(...chartBars.map((item) => Number(item.totalRevenue || 0)), 1)

  const renderTongQuan = () => (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
      <div className="space-y-6">
        <DashboardCard title="Tổng quan hoạt động" description="Nhìn nhanh tình trạng đơn đặt, doanh thu và dữ liệu sân đang quản lý.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryBadge label="Đơn đặt sân" value={`${bookings.length} đơn`} />
            <SummaryBadge label="Doanh thu" value={formatCurrency(revenue?.totalRevenue || 0)} />
            <SummaryBadge label="Ảnh sân" value={`${images.length} ảnh`} />
            <SummaryBadge label="Khung giờ" value={`${schedules.length} slot`} />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className={softCardClass}>
              <p className="text-sm font-semibold text-slate-900">Tiến độ xử lý đơn</p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between"><span>Đang chờ</span><span>{bookings.filter((item) => item.status === 'PENDING').length}</span></div>
                <div className="flex items-center justify-between"><span>Đã xác nhận</span><span>{bookings.filter((item) => item.status === 'CONFIRMED').length}</span></div>
                <div className="flex items-center justify-between"><span>Hoàn tất</span><span>{bookings.filter((item) => item.status === 'COMPLETED').length}</span></div>
              </div>
            </div>
            <div className={softCardClass}>
              <p className="text-sm font-semibold text-slate-900">Gợi ý thao tác</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>1. Tạo hoặc chọn sân ở tab Quản lý sân.</li>
                <li>2. Thêm thư viện ảnh và lịch hoạt động.</li>
                <li>3. Xác nhận đơn đặt rồi check-in khách tại sân.</li>
              </ul>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Xem trước sân" description="Thẻ xem trước giúp kiểm tra nhanh thông tin đang chọn trước khi lưu.">
          <PreviewCard field={previewField} />
        </DashboardCard>
      </div>

      <div className="space-y-6">
        <DashboardCard title="Biểu đồ doanh thu nhanh" description="Bản rút gọn để xem xu hướng thu tiền mà không cần chuyển tab.">
          <div className="space-y-4">
            {chartBars.slice(0, 4).map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>{item.label}</span>
                  <span>{formatCurrency(item.totalRevenue)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${Math.max((Number(item.totalRevenue || 0) / maxRevenue) * 100, 8)}%` }} />
                </div>
              </div>
            ))}
            {!chartBars.length && <p className="text-sm text-slate-500">Chưa có dữ liệu doanh thu để hiển thị.</p>}
          </div>
        </DashboardCard>

        <DashboardCard title="Kiểm tra API nhanh" description="Checklist ngắn để m chụp Postman hoặc test lại flow demo.">
          <ul className="space-y-4 text-sm leading-6 text-slate-600">
            <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-blue-500" />GET /api/owner/bookings để lấy danh sách đơn đặt.</li>
            <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-blue-500" />PUT /api/owner/bookings/{'{id}'}/status để xác nhận hoặc từ chối.</li>
            <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-blue-500" />POST /api/owner/check-in để hoàn tất check-in.</li>
            <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-blue-500" />GET /api/owner/reports/revenue để xem doanh thu.</li>
          </ul>
        </DashboardCard>
      </div>
    </div>
  )

  const renderDonDat = () => (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
      <DashboardCard title="Quản lý đơn đặt sân" description="Duyệt đơn, từ chối hoặc check-in khách trực tiếp tại sân.">
        <div className="space-y-4">
          {bookings.length ? bookings.map((booking) => (
            <div key={booking.id} className={softCardClass}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{booking.fieldName || booking.fieldId}</p>
                  <p className="mt-1 text-sm text-slate-500">Khách: {booking.customerName || 'Khách lẻ'} | Ngày: {booking.bookingDate} | {booking.startTime} - {booking.endTime}</p>
                  <p className="mt-2 text-sm text-slate-600">Đặt cọc online: {formatCurrency(booking.depositAmount)} | Tổng tiền: {formatCurrency(booking.totalPrice)}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${statusTone[booking.status] || statusTone.PENDING}`}>{booking.status}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <ActionButton tone="blue" type="button" onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')} disabled={booking.status === 'CONFIRMED' || booking.status === 'COMPLETED'}>Xác nhận</ActionButton>
                <ActionButton tone="rose" type="button" onClick={() => updateBookingStatus(booking.id, 'REJECTED')} disabled={booking.status === 'REJECTED' || booking.status === 'COMPLETED'}>Từ chối</ActionButton>
                <ActionButton tone="emerald" type="button" onClick={() => {
                  setCheckInForm((prev) => ({ ...prev, bookingId: booking.id }))
                  checkInBooking(booking.id)
                }} disabled={booking.status !== 'CONFIRMED' && booking.status !== 'COMPLETED'}>Check-in</ActionButton>
              </div>
            </div>
          )) : <div className="rounded-3xl border border-dashed border-blue-200 bg-white p-8 text-center text-slate-500">Chưa có đơn đặt sân nào.</div>}
        </div>
      </DashboardCard>

      <DashboardCard title="Check-in thủ công" description="Dùng khi m muốn nhập mã đơn và xử lý thủ công tại quầy.">
        <div className="space-y-5">
          <TextInput label="Mã đơn đặt sân" value={checkInForm.bookingId} onChange={(event) => setCheckInForm((prev) => ({ ...prev, bookingId: event.target.value }))} placeholder="Dán booking id" />
          <TextInput label="Tiền mặt thu thêm" value={checkInForm.extraCash} onChange={(event) => setCheckInForm((prev) => ({ ...prev, extraCash: event.target.value }))} placeholder="50000" />
          <TextArea label="Ghi chú check-in" value={checkInForm.note} onChange={(event) => setCheckInForm((prev) => ({ ...prev, note: event.target.value }))} rows="4" placeholder="Khách đến đúng giờ, đã thanh toán phần phụ thu..." />
          <ActionButton tone="emerald" type="button" onClick={() => checkInBooking(checkInForm.bookingId)} disabled={!checkInForm.bookingId} className="w-full">Xác nhận check-in</ActionButton>
        </div>
      </DashboardCard>
    </div>
  )

  const renderDoanhThu = () => (
    <div className="space-y-6">
      <DashboardCard title="Tổng hợp doanh thu" description="Theo dõi tiền cọc online, tiền mặt tại sân và số đơn đã hoàn tất.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryBadge label="Đặt cọc online" value={formatCurrency(revenue?.totalDepositOnline || 0)} />
          <SummaryBadge label="Tiền mặt tại sân" value={formatCurrency(revenue?.totalExtraCash || 0)} />
          <SummaryBadge label="Tổng doanh thu" value={formatCurrency(revenue?.totalRevenue || 0)} />
          <SummaryBadge label="Hoàn tất / xác nhận" value={`${revenue?.completedBookings || 0} / ${revenue?.confirmedBookings || 0}`} />
        </div>
      </DashboardCard>

      <DashboardCard title="Biểu đồ doanh thu" description="So sánh doanh thu theo từng mốc dữ liệu trả về từ backend.">
        <div className="grid min-h-[260px] grid-cols-1 gap-4 md:grid-cols-4">
          {chartBars.length ? chartBars.map((item) => (
            <div key={item.label} className={softCardClass}>
              <div className="flex h-40 items-end gap-3">
                <div className="w-1/2 rounded-t-2xl bg-blue-500/80" style={{ height: `${Math.max((Number(item.depositOnline || 0) / maxRevenue) * 100, 8)}%` }} />
                <div className="w-1/2 rounded-t-2xl bg-emerald-400/80" style={{ height: `${Math.max((Number(item.extraCash || 0) / maxRevenue) * 100, 8)}%` }} />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-900">{item.label}</p>
              <p className="mt-2 text-xs text-slate-500">Cọc: {formatCurrency(item.depositOnline)}</p>
              <p className="text-xs text-slate-500">Tiền mặt: {formatCurrency(item.extraCash)}</p>
              <p className="text-xs text-slate-700">Tổng: {formatCurrency(item.totalRevenue)}</p>
            </div>
          )) : <div className="md:col-span-4 rounded-3xl border border-dashed border-blue-200 bg-white p-8 text-center text-slate-500">Chưa có dữ liệu biểu đồ. Chạy luồng đặt sân rồi tải lại là có.</div>}
        </div>
      </DashboardCard>
    </div>
  )

  const renderTaoSan = () => (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <DashboardCard title="Tạo sân mới" description="Tạo riêng một sân mới với đầy đủ tên sân, loại sân, địa chỉ, giá thuê và mô tả.">
        <form className="space-y-5" onSubmit={createField}>
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput label="Tên sân" name="fieldName" value={fieldForm.fieldName} onChange={handleFieldChange} placeholder="VD: Sân bóng đá mini A1" />
            <TextInput label="Loại sân" name="sportsType" value={fieldForm.sportsType} onChange={handleFieldChange} placeholder="Sân bóng đá 5 người" />
          </div>
          <TextInput label="Địa chỉ" name="address" value={fieldForm.address} onChange={handleFieldChange} placeholder="Số 123, Quận 7, TP.HCM" />
          <div className="grid gap-5 md:grid-cols-[1fr_0.9fr]">
            <TextInput label="Giá thuê (VND/giờ)" name="price" value={fieldForm.price} onChange={handleFieldChange} placeholder="300000" />
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-blue-700">Giá hiển thị</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatPrice(fieldForm.price || previewField.price)}</p>
              <p className="mt-1 text-sm text-slate-500">Sẽ hiển thị sau khi sân được duyệt.</p>
            </div>
          </div>
          <TextArea label="Mô tả sân" name="description" value={fieldForm.description} onChange={handleFieldChange} rows="5" placeholder="Mô tả cơ sở vật chất, chỗ gửi xe, đèn chiếu sáng..." />
          <ActionButton tone="blue" type="submit" disabled={!canCreateField || isSavingField}>{isSavingField ? 'Đang lưu...' : 'Lưu sân mới'}</ActionButton>
        </form>
      </DashboardCard>

      <DashboardCard title="Xem trước trước khi tạo" description="Kiểm tra nhanh thông tin sân mới trước khi gửi lên hệ thống.">
        <PreviewCard field={previewField} badge="Sân mới chờ duyệt" badgeTone="amber" />
      </DashboardCard>
    </div>
  )

  const renderQuanLySan = () => (
    <div className="space-y-6">
      <DashboardCard title="Danh sách sân hiện có" description="Chọn nhanh sân cần chỉnh sửa hoặc dùng cho thư viện ảnh và lịch hoạt động.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {fields.map((item) => (
            <button key={item.id} type="button" onClick={() => selectField(item)} className={`rounded-2xl border px-4 py-4 text-left transition ${field?.id === item.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-200'}`}>
              <p className="font-semibold text-slate-900">{item.fieldName}</p>
              <p className="mt-1 text-xs text-slate-500">{item.id}</p>
              <p className="mt-2 text-xs text-slate-600">{item.status}</p>
            </button>
          ))}
        </div>
      </DashboardCard>

      <div className="grid items-start gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <DashboardCard title="Cập nhật thông tin sân" description="Chỉnh sửa nhanh sân đang chọn và ẩn sân khi cần.">
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput label="Tên sân" name="fieldName" value={updateForm.fieldName} onChange={handleUpdateChange} placeholder="VD: Sân bóng đá mini A1" />
              <TextInput label="Loại sân" name="sportsType" value={updateForm.sportsType} onChange={handleUpdateChange} placeholder="Sân bóng đá 7 người" />
              <TextInput label="Địa chỉ" name="address" value={updateForm.address} onChange={handleUpdateChange} placeholder="Số 123, Quận 7" />
              <TextInput label="Giá thuê" name="price" value={updateForm.price} onChange={handleUpdateChange} placeholder="350000" />
              <TextInput label="Trạng thái" name="status" value={updateForm.status} onChange={handleUpdateChange} placeholder="ACTIVE / PENDING / HIDDEN" />
            </div>
            <div className="mt-5">
              <TextArea label="Mô tả sân" name="description" value={updateForm.description} onChange={handleUpdateChange} rows="4" placeholder="Mô tả tiện ích, mặt sân, bãi xe..." />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <ActionButton tone="violet" type="button" onClick={updateField} disabled={!selectedFieldId}>Cập nhật sân</ActionButton>
              <ActionButton tone="ghost" type="button" onClick={hideField} disabled={!selectedFieldId}>Ẩn sân</ActionButton>
            </div>
          </DashboardCard>

          <DashboardCard title="Thư viện ảnh sân" description="Lưu nhiều link ảnh để dùng cho trang chi tiết sân sau này.">
            <div className="space-y-4">
              {imageLinks.map((link, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    value={link}
                    onChange={(event) => {
                      const nextLinks = [...imageLinks]
                      nextLinks[index] = event.target.value
                      setImageLinks(nextLinks)
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                  <ActionButton type="button" tone="ghost" onClick={() => setImageLinks((prev) => prev.length === 1 ? prev : prev.filter((_, idx) => idx !== index))}>Xóa</ActionButton>
                </div>
              ))}
              <div className="flex flex-wrap gap-3">
                <ActionButton type="button" tone="ghost" onClick={() => setImageLinks((prev) => [...prev, ''])}>+ Thêm link ảnh</ActionButton>
                <ActionButton type="button" tone="blue" onClick={saveImages}>Lưu thư viện ảnh</ActionButton>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {images.map((image) => (
                  <div key={image.id} className={softCardClass}>
                    <p className="truncate text-sm text-slate-600">{image.imageUrl}</p>
                    <button type="button" onClick={() => deleteImage(image.id)} className="mt-3 text-sm font-semibold text-rose-500">Xóa ảnh</button>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Xem trước sân đang chọn" description="Giúp kiểm tra nhanh thông tin sân hiện tại trước khi cập nhật.">
            <PreviewCard field={previewField} badge="Sân đang chọn" badgeTone="blue" />
          </DashboardCard>

          <DashboardCard title="Quản lý lịch hoạt động" description="Tạo hàng loạt khung giờ theo ngày, giờ bắt đầu, giờ kết thúc và giá cho từng khung giờ.">
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput label="Ngày áp dụng" type="date" name="scheduleDate" value={scheduleForm.scheduleDate} onChange={handleScheduleChange} />
              <TextInput label="Giá cho mỗi khung giờ" name="price" value={scheduleForm.price} onChange={handleScheduleChange} placeholder="250000" />
              <TextInput label="Bắt đầu" type="time" name="startTime" value={scheduleForm.startTime} onChange={handleScheduleChange} />
              <TextInput label="Kết thúc" type="time" name="endTime" value={scheduleForm.endTime} onChange={handleScheduleChange} />
              <TextInput label="Thời lượng mỗi khung giờ (phút)" name="slotMinutes" value={scheduleForm.slotMinutes} onChange={handleScheduleChange} />
            </div>
            <ActionButton type="button" tone="emerald" className="mt-5" onClick={createSchedules}>Tạo lịch hàng loạt</ActionButton>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-5 bg-slate-50 px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                <span>Ngày</span>
                <span>Bắt đầu</span>
                <span>Kết thúc</span>
                <span>Giá</span>
                <span>Trạng thái</span>
              </div>
              {schedules.map((item) => (
                <div key={item.id} className="grid grid-cols-5 border-t border-slate-200 px-4 py-3 text-sm text-slate-700">
                  <span>{item.scheduleDate}</span>
                  <span>{item.startTime}</span>
                  <span>{item.endTime}</span>
                  <span>{Number(item.price).toLocaleString('vi-VN')}đ</span>
                  <span>{item.status}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  )

  const renderThongTinCoSo = () => (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <DashboardCard title="Thông tin trung tâm thể thao" description="Cập nhật bảng SportsCenter để đồng bộ thông tin cơ sở.">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput label="Mã trung tâm" name="id" value={centerForm.id} onChange={handleCenterChange} placeholder="center-q7" />
          <TextInput label="Tên trung tâm" name="name" value={centerForm.name} onChange={handleCenterChange} placeholder="Trung tâm thể thao Quận 7" />
          <TextInput label="Địa chỉ" name="address" value={centerForm.address} onChange={handleCenterChange} placeholder="123 đường số 1" />
          <TextInput label="Thành phố" name="city" value={centerForm.city} onChange={handleCenterChange} placeholder="TP.HCM" />
          <TextInput label="Số điện thoại" name="phone" value={centerForm.phone} onChange={handleCenterChange} placeholder="0900000000" />
          <TextInput label="Trạng thái duyệt" name="approvalStatus" value={centerForm.approvalStatus} onChange={handleCenterChange} placeholder="PENDING" />
        </div>
        <div className="mt-5">
          <TextArea label="Mô tả trung tâm" name="description" value={centerForm.description} onChange={handleCenterChange} rows="4" placeholder="Mô tả ngắn về trung tâm thể thao" />
        </div>
        <ActionButton type="button" tone="violet" className="mt-5" onClick={saveCenter}>Lưu thông tin trung tâm</ActionButton>
      </DashboardCard>

      <DashboardCard title="Ghi chú vận hành" description="Khu vực phụ để trình bày đẹp hơn và hỗ trợ lúc demo.">
        <div className="space-y-4 text-sm leading-6 text-slate-600">
          <p>• Chủ sân chỉ nhìn thấy trang này khi đăng nhập bằng role OWNER.</p>
          <p>• Khách hàng sẽ không thấy menu Quản lý chủ sân và không vào được route này.</p>
          <p>• M có thể dùng tab Quản lý sân để tạo dữ liệu trước, sau đó quay lại đây để hoàn thiện hồ sơ cơ sở.</p>
        </div>
      </DashboardCard>
    </div>
  )

  const renderContent = () => {
    if (activeTab === 'tong-quan') return renderTongQuan()
    if (activeTab === 'don-dat') return renderDonDat()
    if (activeTab === 'doanh-thu') return renderDoanhThu()
    if (activeTab === 'tao-san') return renderTaoSan()
    if (activeTab === 'san-bong') return renderQuanLySan()
    return renderThongTinCoSo()
  }

  return (
    <PublicShell breadcrumb="Trang chủ / Chủ sân / Quản lý cơ sở">
      <div className="mx-auto w-full max-w-7xl px-1 pb-10 text-slate-900">
        <div className="mb-8 overflow-hidden rounded-[32px] border border-blue-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(239,246,255,0.92))] px-6 py-8 shadow-[0_25px_70px_rgba(59,130,246,0.08)] md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Quản lý chủ sân
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">Trang quản lý chủ sân</h1>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600 md:text-base">
                Tao kéo trang này về cùng tông với Home để nhìn đồng bộ hơn, sáng hơn và đỡ cảm giác tab nào cũng một kiểu khác nhau.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryBadge label="Đơn đặt sân" value={`${bookings.length} đơn`} />
              <SummaryBadge label="Doanh thu" value={formatCurrency(revenue?.totalRevenue || 0)} />
              <SummaryBadge label="Ảnh đã lưu" value={`${images.length} ảnh`} />
              <SummaryBadge label="Khung giờ" value={`${schedules.length} slot`} />
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm text-slate-500">Trang chủ / Chủ sân / Quản lý cơ sở</p>
            <h2 className="mt-4 text-[38px] font-bold leading-tight text-slate-900">Không gian quản lý theo từng tab</h2>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">
              Mỗi nhóm chức năng được tách riêng để m demo dễ hơn, thao tác gọn hơn và nhìn cũng gần với giao diện public bên ngoài hơn.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {ownerTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-[0_18px_30px_rgba(37,99,235,0.18)]' : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {renderContent()}

        {statusMessage && (
          <section className="mt-8 rounded-[28px] border border-emerald-200 bg-emerald-50 px-6 py-5 text-center shadow-sm">
            <p className="text-[15px] text-emerald-800">{statusMessage}</p>
          </section>
        )}
      </div>
    </PublicShell>
  )
}

export default OwnerManagement
