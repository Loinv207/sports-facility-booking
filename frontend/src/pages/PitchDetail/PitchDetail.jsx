import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
  MapPin,
  ShieldCheck,
  Star,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const fallbackImagesBySport = {
  Football: [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1400',
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1000',
  ],
  Badminton: [
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1400',
    'https://images.unsplash.com/photo-1613918431703-aa508a2f4d2f?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000',
  ],
  Tennis: [
    'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1400',
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1530915365347-e35b749a0381?auto=format&fit=crop&q=80&w=1000',
  ],
}

const amenityBySport = {
  Football: ['Bai giu xe', 'Phong thay do', 'Den chieu sang', 'Can tin', 'Phong tam', 'Thue dung cu'],
  Badminton: ['Bai giu xe', 'May lanh', 'Khu khoi dong', 'Nuoc uong', 'Cho ngoi cho', 'Phong tam'],
  Tennis: ['Bai giu xe', 'Phong thay do', 'Shop phu kien', 'Den chieu sang', 'Phong tam', 'Khu lounge'],
}

const formatPrice = (price) => {
  if (price === null || price === undefined || price === '') {
    return 'Lien he'
  }

  const amount = Number(price)
  if (Number.isNaN(amount)) {
    return `${price} VND`
  }

  return `${new Intl.NumberFormat('vi-VN').format(amount)} VND`
}

const formatRating = (rating) => {
  if (rating === null || rating === undefined || rating === '') {
    return '4.5'
  }

  return Number(rating).toFixed(1)
}

const formatReviewDate = (value) => {
  if (!value) {
    return 'Vua xong'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const formatSlotLabel = (startTime, endTime) => `${String(startTime).slice(0, 5)} - ${String(endTime).slice(0, 5)}`

const getStatusClasses = (status) => {
  switch (status) {
    case 'AVAILABLE':
    case 'ACTIVE':
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700'
    case 'BOOKED':
    case 'RESERVED':
      return 'border-rose-500/20 bg-rose-500/10 text-rose-700'
    default:
      return 'border-slate-300 bg-slate-100 text-slate-700'
  }
}

const buildPreviewSchedules = (price) => {
  const today = new Date()
  const slots = [
    ['07:00', '08:00'],
    ['08:00', '09:00'],
    ['18:00', '19:00'],
    ['19:00', '20:00'],
    ['20:00', '21:00'],
  ]

  return Array.from({ length: 3 }, (_, dayOffset) => {
    const currentDate = new Date(today)
    currentDate.setDate(today.getDate() + dayOffset)

    return slots.map(([start, end], slotIndex) => ({
      id: `preview-${dayOffset}-${slotIndex}`,
      scheduleDate: currentDate.toISOString().slice(0, 10),
      startTime: `${start}:00`,
      endTime: `${end}:00`,
      price,
      status: slotIndex === 2 ? 'BOOKED' : 'AVAILABLE',
      isPreview: true,
    }))
  }).flat()
}

const groupSchedulesByDate = (schedules) => {
  const bucket = new Map()

  schedules.forEach((schedule) => {
    const dateKey = schedule.scheduleDate
    if (!bucket.has(dateKey)) {
      bucket.set(dateKey, [])
    }

    bucket.get(dateKey).push(schedule)
  })

  return Array.from(bucket.entries()).map(([date, items]) => ({
    date,
    items: items.sort((left, right) => `${left.startTime}`.localeCompare(`${right.startTime}`)),
  }))
}

const formatDateChip = (value) => {
  const date = new Date(`${value}T00:00:00`)
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  }).format(date)
}

const renderStars = (rating) => {
  const normalized = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)))
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={`star-${index}`}
      className={`h-4 w-4 ${index < normalized ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
    />
  ))
}

const PitchDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [detail, setDetail] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [reviewForm, setReviewForm] = useState({ rating: '5', comment: '' })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewMessage, setReviewMessage] = useState('')
  const [reviewError, setReviewError] = useState('')
  const [bookingSubmitting, setBookingSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [eligibleToReview, setEligibleToReview] = useState(false)
  const [reviewEligibilityLoading, setReviewEligibilityLoading] = useState(false)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchPitchDetail = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/fields/${id}/full-details`)
        setDetail(response.data)
      } catch (error) {
        console.error('Loi khi tai chi tiet san:', error)
        setDetail(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPitchDetail()
  }, [id])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true)
        const response = await axios.get(`/api/fields/${id}/reviews`)
        setReviews(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        console.error('Loi khi tai reviews:', error)
        setReviews([])
      } finally {
        setReviewsLoading(false)
      }
    }

    fetchReviews()
  }, [id])

  useEffect(() => {
    const fetchReviewEligibility = async () => {
      if (!token) {
        setEligibleToReview(false)
        return
      }

      try {
        setReviewEligibilityLoading(true)
        const response = await axios.get('/api/bookings/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userBookings = Array.isArray(response.data) ? response.data : []
        const canReview = userBookings.some(
          (booking) => booking.fieldId === id && booking.bookingStatus === 'COMPLETED'
        )
        setEligibleToReview(canReview)
      } catch (requestError) {
        console.error('Loi khi kiem tra quyen danh gia:', requestError)
        setEligibleToReview(false)
      } finally {
        setReviewEligibilityLoading(false)
      }
    }

    fetchReviewEligibility()
  }, [id, token])

  const galleryImages = useMemo(() => {
    if (!detail) {
      return fallbackImagesBySport.Football
    }

    const apiImages = (detail.images || []).map((item) => item.imageUrl).filter(Boolean)
    return apiImages.length > 0 ? apiImages : fallbackImagesBySport[detail.sportsType] || fallbackImagesBySport.Football
  }, [detail])

  const normalizedSchedules = useMemo(() => {
    if (!detail) {
      return []
    }

    const realSchedules = Array.isArray(detail.schedules) ? detail.schedules : []
    return realSchedules.length > 0 ? realSchedules : buildPreviewSchedules(detail.price)
  }, [detail])

  const groupedDates = useMemo(() => groupSchedulesByDate(normalizedSchedules), [normalizedSchedules])

  const selectedDateSlots = useMemo(
    () => groupedDates.find((item) => item.date === selectedDate)?.items || [],
    [groupedDates, selectedDate]
  )

  const selectedSlotInfo = useMemo(
    () => selectedDateSlots.find((item) => item.id === selectedSlot) || null,
    [selectedDateSlots, selectedSlot]
  )

  const averageReviewRating = useMemo(() => {
    if (!detail) {
      return 0
    }

    if (reviews.length === 0) {
      return Number(detail.rating || 0)
    }

    return reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
  }, [detail, reviews])

  useEffect(() => {
    if (galleryImages.length > 0) {
      setSelectedImage((current) => (current && galleryImages.includes(current) ? current : galleryImages[0]))
    }
  }, [galleryImages])

  useEffect(() => {
    if (groupedDates.length === 0) {
      setSelectedDate('')
      setSelectedSlot('')
      return
    }

    setSelectedDate((current) => (groupedDates.some((item) => item.date === current) ? current : groupedDates[0].date))
  }, [groupedDates])

  useEffect(() => {
    setSelectedSlot((current) => {
      const availableSlot = selectedDateSlots.find((item) => item.status !== 'BOOKED' && item.status !== 'RESERVED')
      if (current && selectedDateSlots.some((item) => item.id === current)) {
        return current
      }

      return availableSlot?.id || ''
    })
  }, [selectedDateSlots])

  const handleReviewFieldChange = (event) => {
    const { name, value } = event.target
    setReviewForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmitReview = async (event) => {
    event.preventDefault()
    setReviewMessage('')
    setReviewError('')

    if (!token) {
      setReviewError('Ban can dang nhap truoc khi gui danh gia.')
      return
    }

    try {
      setReviewSubmitting(true)
      const response = await axios.post(
        `/api/fields/${id}/reviews`,
        {
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setReviews((current) => [response.data, ...current])
      setReviewForm({ rating: '5', comment: '' })
      setReviewMessage('Danh gia cua ban da duoc gui thanh cong.')
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Khong the gui danh gia luc nay.')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const handleProceedToPayment = async () => {
    setBookingError('')

    if (!token) {
      navigate('/login')
      return
    }

    if (!selectedSlotInfo || !selectedSlot) {
      setBookingError('Ban can chon mot khung gio kha dung truoc khi thanh toan.')
      return
    }

    if (selectedSlotInfo.isPreview) {
      setBookingError('Khung gio nay chi la du lieu minh hoa. Hay tao lich that tu backend truoc khi dat san.')
      return
    }

    try {
      setBookingSubmitting(true)
      const response = await axios.post(
        '/api/bookings',
        {
          fieldScheduleId: selectedSlot,
          paymentMethod: 'BANK_TRANSFER',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      sessionStorage.setItem('pendingBooking', JSON.stringify(response.data))
      navigate('/payment', {
        state: {
          booking: response.data,
        },
      })
    } catch (error) {
      setBookingError(error.response?.data?.message || 'Khong the tao booking luc nay. Ban thu lai sau nhe.')
    } finally {
      setBookingSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f4f8ff,_#eef2ff_42%,_#f8fafc_100%)] px-4 py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-16 animate-pulse rounded-[28px] bg-white/80" />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_380px]">
            <div className="h-[520px] animate-pulse rounded-[32px] bg-white/80" />
            <div className="h-[520px] animate-pulse rounded-[32px] bg-white/80" />
          </div>
        </div>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f4f8ff,_#eef2ff_42%,_#f8fafc_100%)] px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <Card className="border-0 bg-white/92 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            <CardContent className="px-8 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
                <ImageIcon className="h-7 w-7 text-slate-500" />
              </div>
              <h1 className="mt-5 text-4xl font-semibold text-slate-950">Khong tai duoc thong tin san</h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Co the id san khong ton tai hoac backend chua tra ve du lieu chi tiet. Ban thu quay lai danh sach va mo lai mot san khac nhe.
              </p>
              <Button asChild className="mt-8 rounded-2xl">
                <Link to="/search">Ve trang tim kiem</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const amenities = amenityBySport[detail.sportsType] || amenityBySport.Football
  const centerName = detail.sportsCenter?.name || 'Trung tam the thao dang cap nhat'
  const centerAddress = detail.sportsCenter?.address || detail.address || 'Dia chi dang cap nhat'
  const selectedSlotPrice = selectedSlotInfo?.price ?? detail.price
  const hasPreviewSchedule = normalizedSchedules.some((item) => item.isPreview)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f4f8ff,_#eef2ff_42%,_#f8fafc_100%)] text-slate-900">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-10">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.25fr)_380px]">
          <section className="space-y-7">
            <Card className="overflow-hidden border-0 bg-white/92 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={selectedImage} alt={detail.fieldName} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.38))]" />
                <div className="absolute left-5 top-5">
                  <Badge className="rounded-full bg-white/85 px-4 py-1.5 text-slate-900 hover:bg-white/85">
                    {detail.sportsType || 'The thao'}
                  </Badge>
                </div>
              </div>
              <CardContent className="pt-5">
                <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                  {galleryImages.slice(0, 4).map((image) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`overflow-hidden rounded-[20px] border transition ${
                        selectedImage === image ? 'border-sky-500 shadow-[0_0_0_1px_rgba(14,165,233,0.35)]' : 'border-slate-200'
                      }`}
                    >
                      <img src={image} alt={detail.fieldName} className="aspect-[4/3] h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/92 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <CardTitle className="text-3xl text-slate-950">{detail.fieldName}</CardTitle>
                <CardDescription className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  {detail.address || centerAddress}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[24px] bg-slate-50 px-5 py-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Gia tu</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">{formatPrice(detail.price)}</p>
                  </div>
                  <div className="rounded-[24px] bg-slate-50 px-5 py-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Danh gia</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-1">{renderStars(averageReviewRating)}</div>
                      <span className="font-semibold text-slate-950">{formatRating(averageReviewRating)}</span>
                    </div>
                  </div>
                  <div className="rounded-[24px] bg-slate-50 px-5 py-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Trang thai</p>
                    <Badge variant="outline" className={`mt-3 rounded-full px-3 py-1 ${getStatusClasses(detail.status)}`}>
                      {detail.status || 'Dang cap nhat'}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm leading-8 text-slate-600">
                  {detail.description || 'San duoc bao duong dinh ky, khong gian sach se va toi uu cho ca tap luyen dinh ky lan thi dau phong trao.'}
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {amenities.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/92 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <CardTitle className="text-2xl">Thong tin trung tam</CardTitle>
                <CardDescription>{centerName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-start justify-between gap-4 rounded-[24px] bg-slate-50 px-5 py-5">
                  <div>
                    <p className="text-sm font-medium text-slate-950">{centerAddress}</p>
                    <p className="mt-2 text-sm text-slate-500">{detail.sportsCenter?.city || 'TP.HCM'}</p>
                  </div>
                  <Badge variant="outline" className="rounded-full border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-700">
                    {detail.sportsCenter?.approvalStatus || 'APPROVED'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/92 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">Review & Rating</CardTitle>
                    <CardDescription className="mt-2">
                      Xem nhan xet thuc te tu nguoi dung va chia se trai nghiem cua ban ve san nay.
                    </CardDescription>
                  </div>
                  <div className="rounded-[24px] bg-amber-50 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl font-semibold text-slate-950">{formatRating(averageReviewRating)}</span>
                      <div>
                        <div className="flex items-center gap-1">{renderStars(averageReviewRating)}</div>
                        <p className="mt-1 text-sm text-slate-500">{reviews.length} danh gia</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_380px]">
                <div className="space-y-4">
                  {reviewsLoading ? (
                    <div className="rounded-[24px] bg-slate-50 px-6 py-10 text-center text-slate-500">Dang tai danh sach danh gia...</div>
                  ) : reviews.length === 0 ? (
                    <div className="rounded-[24px] bg-slate-50 px-6 py-10 text-center text-slate-500">
                      Chua co danh gia nao. Ban co the la nguoi dau tien chia se trai nghiem.
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <article key={review.id} className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-950">{review.username || 'Nguoi dung Sports Now'}</p>
                            <div className="mt-2 flex items-center gap-1">{renderStars(review.rating)}</div>
                          </div>
                          <p className="text-sm text-slate-500">{formatReviewDate(review.createdAt)}</p>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-slate-600">{review.comment}</p>
                      </article>
                    ))
                  )}
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Your Review</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">Gui danh gia cua ban</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Chi nguoi dung da hoan thanh booking cua san nay moi co the gui danh gia.
                  </p>

                  {!token ? (
                    <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
                      Ban can <Link to="/login" className="font-semibold underline underline-offset-4">dang nhap</Link> de kiem tra quyen danh gia.
                    </div>
                  ) : reviewEligibilityLoading ? (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                      Dang kiem tra dieu kien danh gia...
                    </div>
                  ) : !eligibleToReview ? (
                    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      Nut danh gia chi mo sau khi booking cua ban chuyen sang trang thai COMPLETED.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="mt-6 space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">So sao</label>
                        <div className="grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5].map((value) => {
                            const active = Number(reviewForm.rating) === value
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setReviewForm((current) => ({ ...current, rating: String(value) }))}
                                className={`rounded-2xl border px-3 py-3 transition ${
                                  active
                                    ? 'border-amber-300 bg-amber-100 text-amber-700'
                                    : 'border-slate-200 bg-white text-slate-500'
                                }`}
                              >
                                <div className="flex justify-center">{renderStars(value)}</div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-slate-700">
                          Binh luan
                        </label>
                        <textarea
                          id="review-comment"
                          name="comment"
                          value={reviewForm.comment}
                          onChange={handleReviewFieldChange}
                          placeholder="San co sach se, den sang, nhan vien ho tro tot..."
                          rows={5}
                          className="w-full rounded-[22px] border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                          maxLength={1000}
                          required
                        />
                      </div>

                      {reviewMessage && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                          {reviewMessage}
                        </div>
                      )}

                      {reviewError && (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                          {reviewError}
                        </div>
                      )}

                      <Button type="submit" className="w-full rounded-2xl" disabled={reviewSubmitting}>
                        {reviewSubmitting ? 'Dang gui danh gia...' : 'Gui danh gia'}
                      </Button>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="border-0 bg-white/92 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-[clamp(2rem,4vw,2.6rem)] leading-[1.04]">{detail.fieldName}</CardTitle>
                    <CardDescription className="mt-2">Co so: {centerName}</CardDescription>
                  </div>
                  <Badge variant="outline" className={`rounded-full px-3 py-1 ${getStatusClasses(detail.status)}`}>
                    {detail.status || 'Dang cap nhat'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                    <span>{detail.address || centerAddress}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-slate-950">
                      {formatRating(averageReviewRating)} <span className="font-normal text-slate-500">({reviews.length} danh gia)</span>
                    </span>
                  </div>
                </div>

                <div className="rounded-[24px] bg-slate-50 px-5 py-5">
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-semibold text-slate-950">{formatPrice(detail.price)}</span>
                    <span className="pb-1 text-sm text-slate-500">/ gio</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" className="rounded-2xl">Dat san ngay</Button>
                  <Button type="button" variant="outline" className="rounded-2xl border-slate-300 bg-white">Luu san</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/92 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <CardTitle className="text-2xl">Khung gio kha dung</CardTitle>
                <CardDescription>Chon ngay dat san va xem khung gio hien co.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  {groupedDates.map(({ date }) => {
                    const active = selectedDate === date
                    return (
                      <button
                        key={date}
                        type="button"
                        onClick={() => setSelectedDate(date)}
                        className={`rounded-[18px] border px-3 py-3 text-left text-sm font-medium transition ${
                          active ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        {formatDateChip(date)}
                      </button>
                    )
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {selectedDateSlots.map((slot) => {
                    const active = selectedSlot === slot.id
                    const unavailable = slot.status === 'BOOKED' || slot.status === 'RESERVED'
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={unavailable}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`rounded-[18px] border px-3 py-3 text-sm font-semibold transition ${
                          unavailable
                            ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                            : active
                              ? 'border-sky-500 bg-sky-50 text-sky-700'
                              : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        {formatSlotLabel(slot.startTime, slot.endTime)}
                      </button>
                    )
                  })}
                </div>

                <div className="rounded-[22px] bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-slate-400" />
                      Khung gio dang chon
                    </span>
                    <span className="font-semibold text-slate-950">
                      {selectedSlotInfo ? formatSlotLabel(selectedSlotInfo.startTime, selectedSlotInfo.endTime) : 'Chua chon'}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-slate-400" />
                      Tam tinh
                    </span>
                    <span className="font-semibold text-slate-950">{formatPrice(selectedSlotPrice)}</span>
                  </div>
                </div>

                <div className="rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" />
                    <p>
                      * Thoi luong dat toi thieu la 60 phut.
                      {hasPreviewSchedule ? ' Khung gio hien tai dang o che do minh hoa vi san chua co lich dat tu backend.' : ''}
                    </p>
                  </div>
                </div>

                {bookingError && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {bookingError}
                  </div>
                )}

                <Button
                  type="button"
                  className="w-full rounded-2xl"
                  disabled={!selectedSlotInfo || bookingSubmitting || selectedSlotInfo?.isPreview}
                  onClick={handleProceedToPayment}
                >
                  {bookingSubmitting ? 'Dang tao booking...' : 'Tien hanh thanh toan'}
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}

export { PitchDetail }
