import { useMemo, useState } from 'react'
import { createOwnerApi } from './ownerApi'

const emptyCheckIn = {
  bookingId: '',
  extraCash: '',
  note: '',
}

export const useOwnerBookings = (token, onStatusChange) => {
  const api = useMemo(() => createOwnerApi(token), [token])
  const [bookings, setBookings] = useState([])
  const [revenue, setRevenue] = useState(null)
  const [checkInForm, setCheckInForm] = useState(emptyCheckIn)

  const loadBookings = async () => {
    const data = await api.getBookings()
    setBookings(data)
    return data
  }

  const loadRevenue = async () => {
    const data = await api.getRevenue()
    setRevenue(data)
    return data
  }

  const syncBooking = (data) => {
    setBookings((prev) => prev.map((item) => (item.id === data.id ? data : item)))
  }

  const updateBookingStatus = async (bookingId, status, note) => {
    const data = await api.updateBookingStatus(bookingId, {
      status,
      note: note || (status === 'REJECTED' ? 'Chủ sân từ chối do không giữ được khung giờ.' : 'Chủ sân đã xác nhận lịch.'),
    })
    syncBooking(data)
    onStatusChange(`Đã chuyển đơn đặt sang ${data.status}.`)
    await loadRevenue()
    return data
  }

  const cancelBooking = async (bookingId, note = 'Chủ sân đã hủy lịch và mở lại khung giờ cho khách khác.') => {
    const data = await api.cancelBookingByOwner(bookingId, { note })
    syncBooking(data)
    onStatusChange('Đã hủy lịch, slot thời gian đã mở lại AVAILABLE.')
    await loadRevenue()
    return data
  }

  const checkInBooking = async (bookingId) => {
    const data = await api.checkInBooking({
      bookingId,
      extraCash: Number(checkInForm.extraCash || 0),
      note: checkInForm.note,
    })
    syncBooking(data)
    setCheckInForm(emptyCheckIn)
    onStatusChange('Check-in thành công, đơn đặt đã chuyển sang COMPLETED.')
    await loadRevenue()
    return data
  }

  return {
    bookings,
    revenue,
    checkInForm,
    setCheckInForm,
    loadBookings,
    loadRevenue,
    updateBookingStatus,
    cancelBooking,
    checkInBooking,
  }
}
