import React, { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import PublicShell from '../../components/PublicShell'
import OwnerBookings from './OwnerBookings'
import OwnerCenterForm from './OwnerCenterForm'
import OwnerCreateField from './OwnerCreateField'
import OwnerFieldManager from './OwnerFieldManager'
import OwnerOverview from './OwnerOverview'
import OwnerRevenue from './OwnerRevenue'
import { SummaryBadge } from './ownerManagementSections'
import { useOwnerBookings } from './useOwnerBookings'
import { useOwnerFields } from './useOwnerFields'

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

const OwnerManagement = () => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')
  const isOwner = Boolean(token && userRole === 'OWNER')
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  const [activeTab, setActiveTab] = useState('tong-quan')
  const [statusMessage, setStatusMessage] = useState('')

  const handleAction = async (callback) => {
  const canCreateField = useMemo(() => {
    return fieldForm.fieldName.trim() && fieldForm.sportsType.trim() && fieldForm.address.trim()
  }, [fieldForm])

  const selectedFieldId = field?.id || fields[0]?.id || ''

  useEffect(() => {
    if (!isOwner) return
    bootstrap()
    // bootstrap is intentionally run once after owner auth is known.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner])

  useEffect(() => {
    if (!isOwner || !selectedFieldId) return
    loadImages(selectedFieldId)
    loadSchedules(selectedFieldId)
  }, [isOwner, selectedFieldId])

  const bootstrap = async () => {
    await Promise.all([loadFields(), loadBookings(), loadRevenue()])
  }

  const loadFields = async () => {
    const response = await fetch(`${API_BASE}/api/fields`, {
      headers: authHeaders,
    })
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
    const response = await fetch(`${API_BASE}/api/owner/bookings`, {
      headers: authHeaders,
    })
    if (!response.ok) return
    setBookings(await response.json())
  }

  const loadRevenue = async () => {
    const response = await fetch(`${API_BASE}/api/owner/reports/revenue`, {
      headers: authHeaders,
    })
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
      await callback()
    } catch (error) {
      setStatusMessage(error.message || 'Có lỗi xảy ra.')
    }
  }

  const ownerFields = useOwnerFields(token, setStatusMessage)
  const ownerBookings = useOwnerBookings(token, setStatusMessage)

  const {
    fieldForm,
    setFieldForm,
    updateForm,
    setUpdateForm,
    scheduleForm,
    setScheduleForm,
    centerForm,
    setCenterForm,
    imageLinks,
    setImageLinks,
    fields,
    field,
    images,
    schedules,
    isSavingField,
    selectedFieldId,
    selectField,
    loadFields,
    loadImages,
    loadSchedules,
    createField,
    updateField,
    hideField,
    saveImages,
    deleteImage,
    createSchedules,
    saveCenter,
  } = ownerFields

  const {
    bookings,
    revenue,
    checkInForm,
    setCheckInForm,
    loadBookings,
    loadRevenue,
    updateBookingStatus,
    cancelBooking,
    checkInBooking,
  } = ownerBookings

  useEffect(() => {
    handleAction(async () => {
      await Promise.all([loadFields(), loadBookings(), loadRevenue()])
    })
  }, [])

  useEffect(() => {
    if (!selectedFieldId) return
    handleAction(async () => {
      await Promise.all([loadImages(selectedFieldId), loadSchedules(selectedFieldId)])
    })
  }, [selectedFieldId])

  const previewField = useMemo(() => {
    const currentField = field || fieldForm
    return {
      ...currentField,
      fieldName: currentField.fieldName || 'Sân bóng đá mini A1',
      sportsType: currentField.sportsType || 'Sân bóng đá',
      address: currentField.address || '123 Nguyễn Văn A, Quận 7, TP.HCM',
      price: currentField.price || '300000',
      priceLabel: formatPrice(currentField.price || '300000'),
      description: currentField.description || 'Sân cỏ nhân tạo chất lượng cao, có đèn chiếu sáng, khu gửi xe và khu nghỉ cho cầu thủ.',
      status: currentField.status || 'PENDING',
    }
  }, [field, fieldForm])

  const canCreateField = useMemo(() => {
    return fieldForm.fieldName.trim() && fieldForm.sportsType.trim() && fieldForm.address.trim()
  }, [fieldForm])

  const chartBars = revenue?.chart || []
  const maxRevenue = Math.max(...chartBars.map((item) => Number(item.totalRevenue || 0)), 1)

  const renderContent = () => {
    if (activeTab === 'tong-quan') {
      return (
        <OwnerOverview
          bookings={bookings}
          revenue={revenue}
          images={images}
          schedules={schedules}
          previewField={previewField}
          chartBars={chartBars}
          maxRevenue={maxRevenue}
          formatCurrency={formatCurrency}
        />
      )
    }

    if (activeTab === 'don-dat') {
      return (
        <OwnerBookings
          bookings={bookings}
          checkInForm={checkInForm}
          setCheckInForm={setCheckInForm}
          updateBookingStatus={(bookingId, status, note) => handleAction(() => updateBookingStatus(bookingId, status, note))}
          cancelBooking={(bookingId, note) => handleAction(() => cancelBooking(bookingId, note))}
          checkInBooking={(bookingId) => handleAction(() => checkInBooking(bookingId))}
          formatCurrency={formatCurrency}
        />
      )
    }

    if (activeTab === 'doanh-thu') {
      return (
        <OwnerRevenue
          revenue={revenue}
          chartBars={chartBars}
          maxRevenue={maxRevenue}
          formatCurrency={formatCurrency}
        />
      )
    }

    if (activeTab === 'tao-san') {
      return (
        <OwnerCreateField
          fieldForm={fieldForm}
          setFieldForm={setFieldForm}
          previewField={previewField}
          canCreateField={canCreateField}
          isSavingField={isSavingField}
          createField={() => handleAction(createField)}
          formatPrice={formatPrice}
        />
      )
    }

    if (activeTab === 'san-bong') {
      return (
        <OwnerFieldManager
          fields={fields}
          field={field}
          updateForm={updateForm}
          setUpdateForm={setUpdateForm}
          imageLinks={imageLinks}
          setImageLinks={setImageLinks}
          images={images}
          schedules={schedules}
          scheduleForm={scheduleForm}
          setScheduleForm={setScheduleForm}
          previewField={previewField}
          selectField={selectField}
          updateField={() => handleAction(updateField)}
          hideField={() => handleAction(hideField)}
          saveImages={() => handleAction(saveImages)}
          deleteImage={(imageId) => handleAction(() => deleteImage(imageId))}
          createSchedules={() => handleAction(createSchedules)}
          selectedFieldId={selectedFieldId}
        />
      )
    }

    return (
      <OwnerCenterForm
        centerForm={centerForm}
        setCenterForm={setCenterForm}
        saveCenter={() => handleAction(saveCenter)}
      />
    )
  }

  if (!isOwner) {
    return <Navigate to="/" replace />
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
                Tao tách trang này ra thành từng file cụ thể để m dễ đọc, dễ sửa và đỡ conflict hơn khi merge nhóm.
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
              `OwnerManagement.jsx` giờ chỉ giữ layout chính, tab điều hướng và ghép dữ liệu từ hooks.
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
