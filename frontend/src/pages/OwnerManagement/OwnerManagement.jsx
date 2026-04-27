import React, { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'

const API_BASE = 'http://localhost:8080'

const emptyField = {
  fieldName: '',
  sportsType: '',
  address: '',
  price: '',
  description: '',
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

const navItems = ['Trang chủ', 'Sân thể thao', 'Cơ sở', 'Đặt sân của tôi', 'Liên hệ']

const formatPrice = (value) => {
  const digits = String(value || '').replace(/\D/g, '')
  if (!digits) return '0 VND/giờ'
  return `${Number(digits).toLocaleString('vi-VN')} VND/giờ`
}

const DashboardCard = ({ title, description, children }) => (
  <section className="rounded-[28px] border border-white/10 bg-[#172131] shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
    <div className="border-b border-white/10 px-7 py-6">
      <h2 className="text-[24px] font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
    <div className="px-7 py-7">{children}</div>
  </section>
)

const SummaryBadge = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-semibold text-white">{value}</p>
  </div>
)

const TextInput = ({ label, ...props }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-300">{label}</label>
    <input
      {...props}
      className="h-12 w-full rounded-2xl border border-white/10 bg-[#0d1522] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
    />
  </div>
)

const TextArea = ({ label, ...props }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-300">{label}</label>
    <textarea
      {...props}
      className="w-full rounded-2xl border border-white/10 bg-[#0d1522] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
    />
  </div>
)

const OwnerManagement = () => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  if (!token || userRole !== 'OWNER') {
    return <Navigate to="/" replace />
  }

  const [fieldForm, setFieldForm] = useState(emptyField)
  const [scheduleForm, setScheduleForm] = useState(emptySchedule)
  const [centerForm, setCenterForm] = useState(emptyCenter)
  const [imageLinks, setImageLinks] = useState([''])
  const [field, setField] = useState(null)
  const [images, setImages] = useState([])
  const [schedules, setSchedules] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
  const [isSavingField, setIsSavingField] = useState(false)

  const fieldId = field?.id

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

  useEffect(() => {
    if (!fieldId) return
    loadImages(fieldId)
    loadSchedules(fieldId)
  }, [fieldId])

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

  const handleFieldChange = ({ target }) => {
    const { name, value } = target
    setFieldForm((prev) => ({ ...prev, [name]: value }))
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
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(fieldForm),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo sân mới')
      }

      setField(data)
      setFieldForm(emptyField)
      setStatusMessage('Tạo sân thành công. M có thể thêm ảnh, lịch và thông tin trung tâm tiếp theo.')
    } catch (error) {
      setStatusMessage(error.message || 'Có lỗi xảy ra khi tạo sân.')
    } finally {
      setIsSavingField(false)
    }
  }

  const saveImages = async () => {
    if (!fieldId) {
      setStatusMessage('Tạo sân trước rồi mới thêm ảnh được.')
      return
    }

    const imageUrls = imageLinks.map((url) => url.trim()).filter(Boolean)
    if (!imageUrls.length) {
      setStatusMessage('Nhập ít nhất 1 link ảnh.')
      return
    }

    const response = await fetch(`${API_BASE}/api/owner/fields/${fieldId}/images`, {
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
    if (!fieldId) {
      setStatusMessage('Tạo sân trước rồi mới thêm lịch được.')
      return
    }

    const response = await fetch(`${API_BASE}/api/owner/fields/${fieldId}/schedules/bulk`, {
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

  return (
    <div className="min-h-screen w-full bg-[#0f1723] text-slate-100">
      <header className="border-b border-white/5 bg-[#111827]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-4 xl:px-10">
          <div className="flex items-center gap-12">
            <div>
              <div className="text-[11px] uppercase tracking-[0.35em] text-sky-400">Sports booking</div>
              <div className="mt-1 text-lg font-bold text-white">SPORTS NOW</div>
            </div>

            <nav className="hidden items-center gap-8 text-[13px] text-slate-300 lg:flex">
              {navItems.map((item) => (
                <a key={item} href="#" className="transition hover:text-white">
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <div className="grid min-w-[280px] gap-3 sm:grid-cols-3">
            <SummaryBadge label="Trạng thái mặc định" value="PENDING" />
            <SummaryBadge label="Ảnh đã lưu" value={`${images.length} ảnh`} />
            <SummaryBadge label="Khung giờ" value={`${schedules.length} slot`} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-6 py-8 pb-14 xl:px-10">
        <div className="mb-8">
          <p className="text-sm text-slate-500">Trang chủ / Quản lý sân / Tài nguyên sân</p>
          <h1 className="mt-4 text-[38px] font-bold leading-tight text-white">Quản lý tài nguyên sân</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-300">
            Hoàn thiện sân mới, cập nhật thư viện ảnh, tạo lịch khung giờ và chỉnh sửa thông tin trung tâm thể thao trong một luồng làm việc thống nhất.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="space-y-6">
            <DashboardCard title="Tạo sân mới" description="Tạo sân trước để hệ thống sinh fieldId cho các bước tiếp theo.">
              <form className="space-y-5" onSubmit={createField}>
                <div className="grid gap-5 md:grid-cols-2">
                  <TextInput label="Tên sân" name="fieldName" value={fieldForm.fieldName} onChange={handleFieldChange} placeholder="VD: Sân bóng đá mini A1" />
                  <TextInput label="Loại sân" name="sportsType" value={fieldForm.sportsType} onChange={handleFieldChange} placeholder="Sân bóng đá 5 người" />
                </div>
                <TextInput label="Địa chỉ" name="address" value={fieldForm.address} onChange={handleFieldChange} placeholder="Số 123, Quận 7, TP.HCM" />
                <div className="grid gap-5 md:grid-cols-[1fr_0.9fr]">
                  <TextInput label="Giá thuê (VND/giờ)" name="price" value={fieldForm.price} onChange={handleFieldChange} placeholder="300000" />
                  <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-sky-300">Giá hiển thị</p>
                    <p className="mt-2 text-2xl font-bold text-white">{formatPrice(fieldForm.price || previewField.price)}</p>
                    <p className="mt-1 text-sm text-slate-400">Sẽ hiển thị sau khi sân được duyệt.</p>
                  </div>
                </div>
                <TextArea label="Mô tả sân" name="description" value={fieldForm.description} onChange={handleFieldChange} rows="5" placeholder="Mô tả cơ sở vật chất, chỗ gửi xe, đèn chiếu sáng..." />
                <button type="submit" disabled={!canCreateField || isSavingField} className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-500">
                  {isSavingField ? 'Đang lưu...' : 'Lưu sân'}
                </button>
              </form>
            </DashboardCard>

            <DashboardCard title="Thư viện ảnh sân" description="Lưu nhiều link ảnh vào bảng FieldImage để dùng cho trang chi tiết sân sau này.">
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
                      className="h-12 flex-1 rounded-2xl border border-white/10 bg-[#0d1522] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
                    />
                    <button type="button" onClick={() => setImageLinks((prev) => prev.length === 1 ? prev : prev.filter((_, idx) => idx !== index))} className="rounded-2xl border border-white/10 px-4 text-sm text-slate-300">
                      Xóa
                    </button>
                  </div>
                ))}
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => setImageLinks((prev) => [...prev, ''])} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-100">
                    + Thêm link ảnh
                  </button>
                  <button type="button" onClick={saveImages} className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white">
                    Lưu thư viện ảnh
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {images.map((image) => (
                    <div key={image.id} className="rounded-2xl border border-white/10 bg-[#0d1522] p-4">
                      <p className="truncate text-sm text-slate-300">{image.imageUrl}</p>
                      <button type="button" onClick={() => deleteImage(image.id)} className="mt-3 text-sm font-semibold text-rose-300">
                        Xóa ảnh
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Schedule Manager" description="Tạo hàng loạt khung giờ theo ngày, khung giờ hoạt động và số phút mỗi slot.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="Ngày áp dụng" type="date" name="scheduleDate" value={scheduleForm.scheduleDate} onChange={handleScheduleChange} />
                <TextInput label="Giá mỗi slot" name="price" value={scheduleForm.price} onChange={handleScheduleChange} placeholder="250000" />
                <TextInput label="Bắt đầu" type="time" name="startTime" value={scheduleForm.startTime} onChange={handleScheduleChange} />
                <TextInput label="Kết thúc" type="time" name="endTime" value={scheduleForm.endTime} onChange={handleScheduleChange} />
                <TextInput label="Số phút mỗi slot" name="slotMinutes" value={scheduleForm.slotMinutes} onChange={handleScheduleChange} />
              </div>
              <button type="button" onClick={createSchedules} className="mt-5 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white">
                Tạo lịch hàng loạt
              </button>
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                <div className="grid grid-cols-5 bg-white/[0.04] px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                  <span>Ngày</span>
                  <span>Bắt đầu</span>
                  <span>Kết thúc</span>
                  <span>Giá</span>
                  <span>Trạng thái</span>
                </div>
                {schedules.map((item) => (
                  <div key={item.id} className="grid grid-cols-5 border-t border-white/10 px-4 py-3 text-sm text-slate-200">
                    <span>{item.scheduleDate}</span>
                    <span>{item.startTime}</span>
                    <span>{item.endTime}</span>
                    <span>{Number(item.price).toLocaleString('vi-VN')}đ</span>
                    <span>{item.status}</span>
                  </div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard title="Thông tin trung tâm thể thao" description="Cập nhật bảng SportsCenter để đồng bộ thông tin cơ sở.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="Mã trung tâm" name="id" value={centerForm.id} onChange={handleCenterChange} placeholder="center-q7" />
                <TextInput label="Tên trung tâm" name="name" value={centerForm.name} onChange={handleCenterChange} placeholder="Sports Center Q7" />
                <TextInput label="Địa chỉ" name="address" value={centerForm.address} onChange={handleCenterChange} placeholder="123 đường số 1" />
                <TextInput label="Thành phố" name="city" value={centerForm.city} onChange={handleCenterChange} placeholder="HCM" />
                <TextInput label="Số điện thoại" name="phone" value={centerForm.phone} onChange={handleCenterChange} placeholder="0900000000" />
                <TextInput label="Trạng thái duyệt" name="approvalStatus" value={centerForm.approvalStatus} onChange={handleCenterChange} placeholder="PENDING" />
              </div>
              <div className="mt-5">
                <TextArea label="Mô tả trung tâm" name="description" value={centerForm.description} onChange={handleCenterChange} rows="4" placeholder="Mô tả ngắn về trung tâm thể thao" />
              </div>
              <button type="button" onClick={saveCenter} className="mt-5 rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white">
                Lưu thông tin trung tâm
              </button>
            </DashboardCard>
          </div>

          <aside className="space-y-6">
            <DashboardCard title="Xem trước sân" description="Thẻ xem trước giúp kiểm tra nhanh thông tin trước khi submit.">
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#0f1724]">
                <div className="flex h-[220px] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_45%),linear-gradient(180deg,#1b2840_0%,#111827_100%)]">
                  <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Sẵn sàng gửi duyệt
                  </div>
                </div>
                <div className="space-y-3 px-5 py-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-300">{String(previewField.sportsType).toUpperCase()}</span>
                    <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold text-amber-300">{previewField.status}</span>
                  </div>
                  <h3 className="text-[30px] font-bold leading-tight text-white">{previewField.fieldName}</h3>
                  <p className="text-[20px] font-semibold text-white">{formatPrice(previewField.price)}</p>
                  <p className="text-sm leading-6 text-slate-400">{previewField.address}</p>
                  <p className="text-sm leading-6 text-slate-300">{previewField.description}</p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Luồng làm việc" description="Thứ tự thao tác để demo với giảng viên hoặc review nội bộ.">
              <ul className="space-y-4 text-sm leading-6 text-slate-300">
                <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-sky-400" />Bước 1: tạo sân để lấy fieldId.</li>
                <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-sky-400" />Bước 2: thêm nhiều link ảnh và quản lý thư viện ảnh.</li>
                <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-sky-400" />Bước 3: tạo lịch hàng loạt cho một ngày cụ thể.</li>
                <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-sky-400" />Bước 4: cập nhật thông tin trung tâm thể thao.</li>
              </ul>
            </DashboardCard>
          </aside>
        </div>

        {statusMessage && (
          <section className="mt-8 rounded-[28px] border border-emerald-400/20 bg-emerald-500/10 px-6 py-5 text-center shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
            <p className="text-[15px] text-slate-100">{statusMessage}</p>
          </section>
        )}
      </main>
    </div>
  )
}

export default OwnerManagement
