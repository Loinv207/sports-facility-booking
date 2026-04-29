import React, { useMemo, useState } from 'react'
import { ActionButton, DashboardCard, TextArea, TextInput } from './ownerManagementSections'

const statusTone = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  PENDING_PAYMENT: 'bg-amber-50 text-amber-700 border-amber-200',
  PAID: 'bg-sky-50 text-sky-700 border-sky-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  CANCELLED: 'bg-slate-100 text-slate-700 border-slate-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

const formatStatusLabel = (status) => {
  const labels = {
    PENDING: 'PENDING',
    PENDING_PAYMENT: 'Chờ thanh toán',
    PAID: 'Đã thanh toán',
    CONFIRMED: 'Đã xác nhận',
    REJECTED: 'Đã từ chối',
    CANCELLED: 'Đã hủy',
    COMPLETED: 'Hoàn tất',
  }

  return labels[status] || status
}

const confirmAction = (message) => window.confirm(message)

const OwnerBookings = ({ bookings, checkInForm, setCheckInForm, updateBookingStatus, cancelBooking, checkInBooking, formatCurrency }) => {
  const [modalState, setModalState] = useState(null)

  const pendingCheckIn = useMemo(
    () => bookings.find((booking) => booking.id === checkInForm.bookingId) || null,
    [bookings, checkInForm.bookingId],
  )

  const closeModal = () => setModalState(null)

  const openModal = (payload) => setModalState(payload)

  const submitModal = async () => {
    if (!modalState) return

    if (modalState.type === 'confirm') {
      await updateBookingStatus(modalState.booking.id, 'CONFIRMED', 'Chủ sân đã xác nhận lịch.')
    }

    if (modalState.type === 'cancel') {
      await cancelBooking(modalState.booking.id, 'Chủ sân đã hủy lịch. Slot được mở lại cho khách khác.')
    }

    if (modalState.type === 'checkin') {
      setCheckInForm((prev) => ({
        ...prev,
        bookingId: modalState.booking.id,
      }))
      await checkInBooking(modalState.booking.id)
    }

    closeModal()
  }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <DashboardCard title="Quản lý đơn đặt sân" description="Duyệt đơn, hủy lịch hoặc check-in khách trực tiếp tại sân.">
          <div className="space-y-4">
            {bookings.length ? bookings.map((booking) => (
              <div key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{booking.fieldName || booking.fieldId}</p>
                    <p className="mt-1 text-sm text-slate-500">Khách: {booking.customerName || 'Khách lẻ'} | Ngày: {booking.bookingDate} | {booking.startTime} - {booking.endTime}</p>
                    <p className="mt-2 text-sm text-slate-600">Đặt cọc online: {formatCurrency(booking.depositAmount)} | Tiền mặt tại sân: {formatCurrency(booking.extraCash)} | Tổng thực tế: {formatCurrency(booking.totalPrice)}</p>
                    {booking.note ? <p className="mt-2 text-sm italic text-slate-500">Ghi chú: {booking.note}</p> : null}
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${statusTone[booking.status] || statusTone.PENDING}`}>{formatStatusLabel(booking.status)}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <ActionButton tone="blue" type="button" onClick={() => openModal({ type: 'confirm', booking })} disabled={booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' || booking.status === 'CANCELLED' || booking.status === 'REJECTED'}>
                    Xác nhận
                  </ActionButton>
                  <ActionButton tone="rose" type="button" onClick={() => updateBookingStatus(booking.id, 'REJECTED', 'Chủ sân từ chối do không giữ được khung giờ.') } disabled={booking.status === 'REJECTED' || booking.status === 'COMPLETED' || booking.status === 'CANCELLED'}>
                    Từ chối
                  </ActionButton>
                  <ActionButton tone="ghost" type="button" onClick={() => openModal({ type: 'cancel', booking })} disabled={booking.status === 'COMPLETED' || booking.status === 'CANCELLED' || booking.status === 'REJECTED'}>
                    Hủy lịch
                  </ActionButton>
                  <ActionButton tone="emerald" type="button" onClick={() => {
                    setCheckInForm((prev) => ({ ...prev, bookingId: booking.id }))
                    openModal({ type: 'checkin', booking })
                  }} disabled={booking.status !== 'CONFIRMED' && booking.status !== 'PAID' && booking.status !== 'COMPLETED'}>
                    Check-in
                  </ActionButton>
                </div>
              </div>
            )) : <div className="rounded-3xl border border-dashed border-blue-200 bg-white p-8 text-center text-slate-500">Chưa có đơn đặt sân nào.</div>}
          </div>
        </DashboardCard>

        <DashboardCard title="Check-in thủ công" description="Dùng khi m muốn nhập booking id, thu thêm tiền mặt rồi xác nhận hoàn tất tại sân.">
          <div className="space-y-5">
            <TextInput label="Mã đơn đặt sân" value={checkInForm.bookingId} onChange={(event) => setCheckInForm((prev) => ({ ...prev, bookingId: event.target.value }))} placeholder="Dán booking id" />
            <TextInput label="Tiền mặt thu tại sân" value={checkInForm.extraCash} onChange={(event) => setCheckInForm((prev) => ({ ...prev, extraCash: event.target.value }))} placeholder="50000" />
            <TextArea label="Ghi chú check-in" value={checkInForm.note} onChange={(event) => setCheckInForm((prev) => ({ ...prev, note: event.target.value }))} rows="4" placeholder="Khách đến đủ người, đã thu thêm tiền nước hoặc phụ phí..." />
            {pendingCheckIn ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Sẽ hoàn tất đơn của <strong>{pendingCheckIn.customerName || 'khách lẻ'}</strong> tại sân <strong>{pendingCheckIn.fieldName}</strong>.
              </div>
            ) : null}
            <ActionButton tone="emerald" type="button" onClick={() => {
              if (!checkInForm.bookingId) return
              if (!confirmAction('Xác nhận check-in và chuyển booking sang COMPLETED?')) return
              checkInBooking(checkInForm.bookingId)
            }} disabled={!checkInForm.bookingId} className="w-full">Xác nhận check-in</ActionButton>
          </div>
        </DashboardCard>
      </div>

      {modalState ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">
              {modalState.type === 'confirm' ? 'Xác nhận lịch đặt?' : modalState.type === 'cancel' ? 'Hủy lịch này?' : 'Check-in đơn đặt này?'}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {modalState.type === 'confirm' && 'Sau khi xác nhận, khung giờ sẽ được giữ chặt cho khách và payment chuyển sang trạng thái đã thanh toán.'}
              {modalState.type === 'cancel' && 'Sau khi hủy, booking sẽ bị đóng và slot thời gian sẽ mở lại AVAILABLE cho khách khác đặt.'}
              {modalState.type === 'checkin' && 'Sau khi check-in, booking sẽ chuyển sang COMPLETED và doanh thu thực tế sẽ tính tiền cọc online cộng tiền mặt thu tại sân.'}
            </p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <p><strong>Sân:</strong> {modalState.booking.fieldName}</p>
              <p><strong>Khách:</strong> {modalState.booking.customerName || 'Khách lẻ'}</p>
              <p><strong>Khung giờ:</strong> {modalState.booking.bookingDate} | {modalState.booking.startTime} - {modalState.booking.endTime}</p>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <ActionButton tone="ghost" type="button" onClick={closeModal}>Đóng</ActionButton>
              <ActionButton tone={modalState.type === 'cancel' ? 'rose' : modalState.type === 'checkin' ? 'emerald' : 'blue'} type="button" onClick={submitModal}>
                {modalState.type === 'confirm' ? 'Xác nhận lịch' : modalState.type === 'cancel' ? 'Hủy lịch' : 'Check-in ngay'}
              </ActionButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default OwnerBookings
