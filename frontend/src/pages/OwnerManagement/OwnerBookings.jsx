import React from 'react'
import { ActionButton, DashboardCard, TextArea, TextInput } from './ownerManagementSections'

const statusTone = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

const OwnerBookings = ({ bookings, checkInForm, setCheckInForm, updateBookingStatus, checkInBooking, formatCurrency }) => (
  <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
    <DashboardCard title="Quản lý đơn đặt sân" description="Duyệt đơn, từ chối hoặc check-in khách trực tiếp tại sân.">
      <div className="space-y-4">
        {bookings.length ? bookings.map((booking) => (
          <div key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-5">
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

export default OwnerBookings
