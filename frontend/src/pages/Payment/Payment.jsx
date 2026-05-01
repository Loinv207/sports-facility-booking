import React, { useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useLocation } from 'react-router-dom'
import { CalendarClock, CircleAlert, CreditCard, Landmark, ReceiptText, ShieldCheck, Wallet } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (value) => {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('vi-VN').format(amount)
}

const formatDateLine = (bookingDate, startTime, endTime) => {
  if (!bookingDate) {
    return 'Dang cap nhat lich dat'
  }

  const dateText = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${bookingDate}T00:00:00`))

  if (!startTime || !endTime) {
    return dateText
  }

  return `${dateText} • ${String(startTime).slice(0, 5)} - ${String(endTime).slice(0, 5)}`
}

const paymentMethodConfig = {
  BANK_TRANSFER: {
    label: 'Chuyen khoan ngan hang',
    hint: 'Thuc hien chuyen khoan theo noi dung ma booking de he thong de doi soat.',
    icon: Landmark,
  },
  CASH: {
    label: 'Thanh toan tai san',
    hint: 'Thanh toan truc tiep tai quay truoc gio bat dau tran.',
    icon: Wallet,
  },
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

export const Payment = () => {
  const location = useLocation()
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const initialBooking = useMemo(() => location.state?.booking || fallbackBooking(), [location.state])
  const [booking, setBooking] = useState(initialBooking)
  const paymentInfo = paymentMethodConfig[booking?.paymentMethod] || paymentMethodConfig.BANK_TRANSFER
  const PaymentIcon = paymentInfo.icon
  const token = localStorage.getItem('token')

  const handleConfirmPayment = async () => {
    if (!booking?.bookingId || !token) {
      setError('Ban can dang nhap lai de xac nhan thanh toan.')
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
      setMessage('Thanh toan da duoc xac nhan. Booking cua ban hien da chuyen sang COMPLETED.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Khong the xac nhan thanh toan luc nay.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f4f8ff,_#eef2ff_42%,_#f8fafc_100%)] text-slate-900">
        <SiteHeader />
        <main className="mx-auto max-w-4xl px-4 py-10 lg:px-6">
          <Card className="border-0 bg-white/92 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            <CardContent className="px-8 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-50">
                <CircleAlert className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="mt-5 text-3xl font-semibold text-slate-950">Khong tim thay don thanh toan</h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Co the ban vua reload trang hoac chua tao booking tu trang chi tiet san. Ban quay lai Pitch Detail de chon khung gio va tao booking moi nhe.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild className="rounded-2xl">
                  <Link to="/search">Ve trang tim kiem</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-2xl border-slate-300 bg-white">
                  <Link to="/profile">Xem booking cua toi</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f4f8ff,_#eef2ff_42%,_#f8fafc_100%)] text-slate-900">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-6 lg:py-10">
        <section className="rounded-[32px] border border-slate-200/70 bg-white/88 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Payment</p>
              <h1 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.02] text-slate-950">
                Hoan tat thanh toan cho booking cua ban
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                Booking da duoc tao o trang thai cho thanh toan. Ban co the dung thong tin ben duoi de thanh toan va theo doi don trong trang profile.
              </p>
            </div>

            <Badge className="w-fit rounded-full bg-amber-50 px-4 py-2 text-amber-700 hover:bg-amber-50">
              {booking.bookingStatus || 'PENDING_PAYMENT'}
            </Badge>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_360px]">
          <section className="space-y-6">
            <Card className="border-0 bg-white/92 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <CardTitle className="text-2xl">Thong tin don dat san</CardTitle>
                <CardDescription>Ma booking va lich dat da duoc tao tu trang chi tiet san.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[22px] bg-slate-50 px-5 py-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Ma booking</p>
                  <p className="mt-2 font-semibold text-slate-950">{booking.bookingId}</p>
                </div>
                <div className="rounded-[22px] bg-slate-50 px-5 py-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Ma payment</p>
                  <p className="mt-2 font-semibold text-slate-950">{booking.paymentId}</p>
                </div>
                <div className="rounded-[22px] bg-slate-50 px-5 py-5 md:col-span-2">
                  <div className="flex items-start gap-3">
                    <CalendarClock className="mt-0.5 h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Lich dat</p>
                      <p className="mt-2 font-semibold text-slate-950">
                        {formatDateLine(booking.bookingDate, booking.startTime, booking.endTime)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/92 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <CardTitle className="text-2xl">Huong dan thanh toan</CardTitle>
                <CardDescription>
                  Backend hien da tao booking va payment pending. Buoc confirm payment thuc te co the duoc bo sung sau.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                      <PaymentIcon className="h-5 w-5 text-sky-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">{paymentInfo.label}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{paymentInfo.hint}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-sky-200 bg-sky-50 px-5 py-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-sky-700">Noi dung chuyen khoan goi y</p>
                  <p className="mt-2 break-all text-sm font-semibold text-slate-950">BOOKING {booking.bookingId}</p>
                </div>

                <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-5 text-sm leading-7 text-emerald-800">
                  Sau khi thanh toan, ban co the theo doi booking trong trang Profile. Hien tai frontend da hoan tat buoc tao booking va hien thi thong tin pending payment.
                </div>

                {message && (
                  <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="border-0 bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Tom tat thanh toan</CardTitle>
                <CardDescription className="text-slate-300">Thong tin tong hop cua don booking vua tao.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-[22px] border border-white/10 bg-white/10 px-5 py-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Tong thanh toan</p>
                  <p className="mt-2 text-4xl font-semibold">{formatCurrency(booking.totalPrice)} VND</p>
                </div>

                <div className="space-y-3 text-sm text-slate-200">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2">
                      <ReceiptText className="h-4 w-4 text-slate-400" />
                      Trang thai booking
                    </span>
                    <span>{booking.bookingStatus}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-slate-400" />
                      Trang thai payment
                    </span>
                    <span>{booking.paymentStatus}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-slate-400" />
                      Phuong thuc
                    </span>
                    <span>{paymentInfo.label}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    type="button"
                    className="rounded-2xl"
                    disabled={submitting || booking.bookingStatus !== 'PENDING_PAYMENT'}
                    onClick={handleConfirmPayment}
                  >
                    {submitting ? 'Dang xac nhan thanh toan...' : 'Xac nhan da thanh toan'}
                  </Button>
                  <Button asChild className="rounded-2xl">
                    <Link to="/profile">Xem booking cua toi</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-2xl border-white/20 bg-white/10 text-white hover:bg-white/15">
                    <Link to={`/pitch/${booking.fieldId}`}>Quay lai chi tiet san</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}
