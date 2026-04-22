import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarClock,
  CircleCheckBig,
  CircleSlash,
  Clock3,
  MapPin,
  ReceiptText,
  RefreshCw,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const API_BASE_URL = 'http://localhost:8080'

const formatCurrency = (value) => {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('vi-VN').format(amount)
}

const formatDateTime = (value) => {
  if (!value) {
    return 'Dang cap nhat'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const formatBookingDate = (bookingDate, startTime, endTime) => {
  if (!bookingDate) {
    return 'Dang cap nhat'
  }

  const dateText = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${bookingDate}T00:00:00`))

  if (!startTime || !endTime) {
    return dateText
  }

  return `${dateText} • ${String(startTime).slice(0, 5)} - ${String(endTime).slice(0, 5)}`
}

const getStatusConfig = (status) => {
  switch (status) {
    case 'PENDING_PAYMENT':
      return {
        label: 'Da coc',
        variant: 'secondary',
        className: 'border-amber-500/20 bg-amber-500/10 text-amber-700',
        icon: Clock3,
      }
    case 'CANCELLED':
      return {
        label: 'Da huy',
        variant: 'destructive',
        className: 'border-rose-500/20 bg-rose-500/10 text-rose-700',
        icon: CircleSlash,
      }
    case 'COMPLETED':
    case 'PAID':
      return {
        label: 'Da hoan thanh',
        variant: 'default',
        className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700',
        icon: CircleCheckBig,
      }
    default:
      return {
        label: status || 'Dang xu ly',
        variant: 'outline',
        className: 'border-slate-300 bg-slate-100 text-slate-700',
        icon: ReceiptText,
      }
  }
}

const SummaryCard = ({ icon: Icon, label, value, tone }) => (
  <Card className={`border-0 shadow-none ring-1 ${tone}`}>
    <CardContent className="flex items-center gap-4 px-5 py-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      </div>
    </CardContent>
  </Card>
)

export const Profile = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState('')

  const token = localStorage.getItem('token')

  const fetchBookings = async () => {
    if (!token) {
      setBookings([])
      setError('')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await axios.get(`${API_BASE_URL}/api/bookings/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setBookings(Array.isArray(response.data) ? response.data : [])
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Khong the tai lich su dat san luc nay.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const summary = useMemo(() => {
    const deposited = bookings.filter((booking) => booking.bookingStatus === 'PENDING_PAYMENT').length
    const cancelled = bookings.filter((booking) => booking.bookingStatus === 'CANCELLED').length
    const completed = bookings.filter((booking) => ['COMPLETED', 'PAID'].includes(booking.bookingStatus)).length

    return {
      total: bookings.length,
      deposited,
      cancelled,
      completed,
    }
  }, [bookings])

  const handleCancelBooking = async (bookingId) => {
    if (!token) {
      return
    }

    try {
      setCancellingId(bookingId)
      const response = await axios.put(
        `${API_BASE_URL}/api/bookings/user/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setBookings((current) =>
        current.map((booking) => (booking.bookingId === bookingId ? response.data : booking))
      )
    } catch (cancelError) {
      window.alert(cancelError.response?.data?.message || 'Khong the huy lich vao luc nay.')
    } finally {
      setCancellingId('')
    }
  }

  const handleGoToPayment = (booking) => {
    sessionStorage.setItem('pendingBooking', JSON.stringify(booking))
    navigate('/payment', {
      state: {
        booking,
      },
    })
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f4f8ff,_#eef2ff_42%,_#f8fafc_100%)] text-slate-900">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-10">
        <section className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">User Dashboard</p>
              <h1 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.02] text-slate-950">
                Lich su dat san
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                Theo doi toan bo lich dat cua ban, xem nhanh trang thai da coc, da huy hoac da hoan thanh va thao tac huy lich khi booking con cho thanh toan.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-slate-300 bg-white"
              onClick={fetchBookings}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Lam moi danh sach
            </Button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard icon={ReceiptText} label="Tong booking" value={summary.total} tone="border-slate-200/80 bg-slate-50/80 text-slate-700" />
            <SummaryCard icon={Clock3} label="Da coc" value={summary.deposited} tone="border-amber-200/80 bg-amber-50 text-amber-700" />
            <SummaryCard icon={CircleSlash} label="Da huy" value={summary.cancelled} tone="border-rose-200/80 bg-rose-50 text-rose-700" />
            <SummaryCard icon={CircleCheckBig} label="Da hoan thanh" value={summary.completed} tone="border-emerald-200/80 bg-emerald-50 text-emerald-700" />
          </div>
        </section>

        {!token ? (
          <Card className="mt-8 border-0 bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-2xl">Ban chua dang nhap</CardTitle>
              <CardDescription className="text-slate-300">
                Dang nhap de xem lich su dat san, theo doi trang thai va quan ly cac booking cua minh.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Button asChild className="rounded-xl">
                <Link to="/login">Dang nhap ngay</Link>
              </Button>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="mt-8 grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-[28px] border border-slate-200/70 bg-white/80" />
            ))}
          </div>
        ) : error ? (
          <Card className="mt-8 border-0 bg-rose-50 ring-1 ring-rose-200">
            <CardHeader>
              <CardTitle className="text-rose-700">Khong tai duoc lich su dat san</CardTitle>
              <CardDescription className="text-rose-600">{error}</CardDescription>
            </CardHeader>
          </Card>
        ) : bookings.length === 0 ? (
          <Card className="mt-8 border-0 bg-white/85 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            <CardHeader>
              <CardTitle>Chua co booking nao</CardTitle>
              <CardDescription>
                Lich su dat san cua ban se hien tai day ngay khi ban tao booking dau tien tu trang chi tiet san.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="rounded-xl">
                <Link to="/search">Kham pha san the thao</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mt-8 hidden lg:block">
              <Card className="border-0 bg-white/90 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
                <CardHeader>
                  <CardTitle className="text-xl">Bang tong hop booking</CardTitle>
                  <CardDescription>
                    Theo doi nhanh ngay dat, gia tien, trang thai thanh toan va thao tac huy lich cho cac booking con hieu luc.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-200">
                        <TableHead>San</TableHead>
                        <TableHead>Lich dat</TableHead>
                        <TableHead>Trang thai</TableHead>
                        <TableHead>Thanh toan</TableHead>
                        <TableHead className="text-right">Tam tinh</TableHead>
                        <TableHead className="text-right">Thao tac</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => {
                        const status = getStatusConfig(booking.bookingStatus)
                        const StatusIcon = status.icon
                        const canPay = booking.bookingStatus === 'PENDING_PAYMENT'
                        const canCancel = booking.bookingStatus === 'PENDING_PAYMENT'

                        return (
                          <TableRow key={booking.bookingId} className="border-slate-200/80">
                            <TableCell className="align-top">
                              <div>
                                <p className="font-semibold text-slate-900">{booking.fieldName || 'San dang cap nhat'}</p>
                                <p className="mt-1 text-xs text-slate-500">Ma booking: {booking.bookingId}</p>
                              </div>
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="flex items-start gap-2 text-slate-700">
                                <CalendarClock className="mt-0.5 h-4 w-4 text-slate-400" />
                                <div>
                                  <p>{formatBookingDate(booking.bookingDate, booking.startTime, booking.endTime)}</p>
                                  <p className="mt-1 text-xs text-slate-500">Tao luc {formatDateTime(booking.createdAt)}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="align-top">
                              <Badge variant={status.variant} className={`gap-1.5 rounded-full px-3 py-1 ${status.className}`}>
                                <StatusIcon className="h-3.5 w-3.5" />
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="text-sm text-slate-700">
                                <p className="font-medium">{booking.paymentMethod || 'Chua cap nhat'}</p>
                                <p className="mt-1 text-xs text-slate-500">{booking.paymentStatus || 'Chua cap nhat'}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right align-top font-semibold text-slate-900">
                              {formatCurrency(booking.totalPrice)} VND
                            </TableCell>
                            <TableCell className="text-right align-top">
                              {canPay ? (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    className="rounded-xl"
                                    onClick={() => handleGoToPayment(booking)}
                                  >
                                    Thanh toan
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="rounded-xl"
                                    disabled={cancellingId === booking.bookingId}
                                    onClick={() => handleCancelBooking(booking.bookingId)}
                                  >
                                    {cancellingId === booking.bookingId ? 'Dang huy...' : 'Huy lich'}
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Hoan tat</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 grid gap-5 lg:hidden">
              {bookings.map((booking) => {
                const status = getStatusConfig(booking.bookingStatus)
                const StatusIcon = status.icon
                const canPay = booking.bookingStatus === 'PENDING_PAYMENT'
                const canCancel = booking.bookingStatus === 'PENDING_PAYMENT'

                return (
                  <Card key={booking.bookingId} className="border-0 bg-white/90 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg">{booking.fieldName || 'San dang cap nhat'}</CardTitle>
                          <CardDescription className="mt-2 text-xs">Ma booking: {booking.bookingId}</CardDescription>
                        </div>
                        <Badge variant={status.variant} className={`gap-1.5 rounded-full px-3 py-1 ${status.className}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-2xl bg-slate-50 px-4 py-4">
                        <div className="flex items-start gap-3 text-sm text-slate-700">
                          <CalendarClock className="mt-0.5 h-4 w-4 text-slate-400" />
                          <div>
                            <p className="font-medium">{formatBookingDate(booking.bookingDate, booking.startTime, booking.endTime)}</p>
                            <p className="mt-1 text-xs text-slate-500">Tao luc {formatDateTime(booking.createdAt)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Thanh toan</p>
                          <p className="mt-2 font-medium text-slate-900">{booking.paymentMethod || 'Chua cap nhat'}</p>
                          <p className="mt-1 text-sm text-slate-500">{booking.paymentStatus || 'Chua cap nhat'}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Tam tinh</p>
                          <p className="mt-2 font-medium text-slate-900">{formatCurrency(booking.totalPrice)} VND</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.fieldId}</span>
                        </div>

                        {canPay ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              className="rounded-xl"
                              onClick={() => handleGoToPayment(booking)}
                            >
                              Thanh toan
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="rounded-xl"
                              disabled={cancellingId === booking.bookingId}
                              onClick={() => handleCancelBooking(booking.bookingId)}
                            >
                              {cancellingId === booking.bookingId ? 'Dang huy...' : 'Huy lich'}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Khong co thao tac</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
