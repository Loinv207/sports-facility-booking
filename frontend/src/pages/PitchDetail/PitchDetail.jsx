import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PublicShell from '../../components/PublicShell'
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
  Football: ['Bãi giữ xe', 'Phòng thay đồ', 'Đèn chiếu sáng', 'Căn tin', 'Phòng tắm', 'Thuê dụng cụ'],
  Badminton: ['Bãi giữ xe', 'Máy lạnh', 'Khu khởi động', 'Nước uống', 'Chỗ ngồi chờ', 'Phòng tắm'],
  Tennis: ['Bãi giữ xe', 'Phòng thay đồ', 'Shop phụ kiện', 'Đèn chiếu sáng', 'Phòng tắm', 'Khu lounge'],
}

const formatPrice = (price) => {
  if (price === null || price === undefined || price === '') {
    return 'Liên hệ'
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
    return 'Vừa xong'
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

const calculateDurationHours = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return 0
  }

  const [startHour = '0', startMinute = '0'] = String(startTime).slice(0, 5).split(':')
  const [endHour = '0', endMinute = '0'] = String(endTime).slice(0, 5).split(':')

  const startTotalMinutes = Number(startHour) * 60 + Number(startMinute)
  const endTotalMinutes = Number(endHour) * 60 + Number(endMinute)
  const durationMinutes = Math.max(0, endTotalMinutes - startTotalMinutes)

  return durationMinutes / 60
}

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
        console.error('Lỗi khi tải chi tiết sân:', error)
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
        console.error('Lỗi khi tải reviews:', error)
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
        console.error('Lỗi khi kiểm tra quyền đánh giá:', requestError)
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

    return Array.isArray(detail.schedules) ? detail.schedules : []
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
      setReviewError('Bạn cần đăng nhập trước khi gửi đánh giá.')
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
      setReviewMessage('Đánh giá của bạn đã được gửi thành công.')
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Không thể gửi đánh giá lúc này.')
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
      setBookingError('Bạn cần chọn một khung giờ khả dụng trước khi thanh toán.')
      return
    }

    try {
      setBookingSubmitting(true)
      const response = await axios.post(
        '/api/bookings',
        {
          fieldScheduleId: selectedSlot,
          paymentMethod: 'VNPAY',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const booking = response.data
      sessionStorage.setItem('pendingBooking', JSON.stringify(booking))

      const paymentResponse = await axios.post('/api/payment/vnpay', null, {
        params: {
          bookingId: booking.bookingId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const paymentUrl = paymentResponse.data?.paymentUrl || paymentResponse.data
      if (!paymentUrl || typeof paymentUrl !== 'string') {
        throw new Error('Không nhận được link thanh toán VNPay')
      }

      window.location.href = paymentUrl
    } catch (error) {
      setBookingError(error.response?.data?.message || error.message || 'Không thể tạo booking lúc này. Bạn thử lại sau nhé.')
    } finally {
      setBookingSubmitting(false)
    }
  }

  if (loading) {
    return (
      <PublicShell>
        <div className="pitch-detail-page mx-auto max-w-7xl px-1 pb-8 pt-2 text-slate-900">
          <div className="space-y-6">
            <div className="h-16 animate-pulse rounded-[28px] bg-white/80" />
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_380px]">
              <div className="h-[520px] animate-pulse rounded-[32px] bg-white/80" />
              <div className="h-[520px] animate-pulse rounded-[32px] bg-white/80" />
            </div>
          </div>
        </div>
      </PublicShell>
    )
  }

  if (!detail) {
    return (
      <PublicShell>
        <div className="pitch-detail-page mx-auto max-w-3xl px-1 pb-8 pt-8 text-slate-900">
          <Card className="border-0 bg-white/92 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            <CardContent className="px-8 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
                <ImageIcon className="h-7 w-7 text-slate-500" />
              </div>
              <h1 className="mt-5 text-4xl font-semibold text-slate-950">Không tải được thông tin sân</h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Có thể ID sân không tồn tại hoặc backend chưa trả về dữ liệu chi tiết. Bạn thử quay lại danh sách và mở lại một sân khác nhé.
              </p>
              <Button asChild className="mt-8 rounded-2xl">
                <Link to="/search">Về trang tìm kiếm</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PublicShell>
    )
  }

  const amenities = amenityBySport[detail.sportsType] || amenityBySport.Football
  const centerName = detail.sportsCenter?.name || 'Trung tam the thao dang cap nhat'
  const centerAddress = detail.sportsCenter?.address || detail.address || 'Dia chi dang cap nhat'
  const selectedSlotPrice = selectedSlotInfo?.price ?? detail.price
  const bookingDurationHours = calculateDurationHours(selectedSlotInfo?.startTime, selectedSlotInfo?.endTime)
  const bookingTotal = Number(selectedSlotPrice || 0) * Math.max(bookingDurationHours || 1, 1)
  const hasRealSchedules = normalizedSchedules.length > 0

  return (
    <PublicShell>
      <main className="pitch-detail-page mx-auto max-w-7xl px-1 pb-8 pt-2 text-slate-900">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.25fr)_380px]">
          <section className="space-y-7">
            <Card className="overflow-hidden border-0 bg-white/92 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={selectedImage} alt={detail.fieldName} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.38))]" />
                <div className="absolute left-5 top-5">
                  <Badge className="rounded-full bg-white/85 px-4 py-1.5 text-slate-900 hover:bg-white/85">
                    {detail.sportsType || 'Thể thao'}
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
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Giá từ</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">{formatPrice(detail.price)}</p>
                  </div>
                  <div className="rounded-[24px] bg-slate-50 px-5 py-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Đánh giá</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-1">{renderStars(averageReviewRating)}</div>
                      <span className="font-semibold text-slate-950">{formatRating(averageReviewRating)}</span>
                    </div>
                  </div>
                  <div className="rounded-[24px] bg-slate-50 px-5 py-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Trạng thái</p>
                    <Badge variant="outline" className={`mt-3 rounded-full px-3 py-1 ${getStatusClasses(detail.status)}`}>
                      {detail.status || 'Đang cập nhật'}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm leading-8 text-slate-600">
                  {detail.description || 'Sân được bảo dưỡng định kỳ, không gian sạch sẽ và tối ưu cho cả tập luyện định kỳ lẫn thi đấu phong trào.'}
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
                <CardTitle className="text-2xl">Thông tin trung tâm</CardTitle>
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
                      Xem nhận xét thực tế từ người dùng và chia sẻ trải nghiệm của bạn về sân này.
                    </CardDescription>
                  </div>
                  <div className="rounded-[24px] bg-amber-50 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl font-semibold text-slate-950">{formatRating(averageReviewRating)}</span>
                      <div>
                        <div className="flex items-center gap-1">{renderStars(averageReviewRating)}</div>
                        <p className="mt-1 text-sm text-slate-500">{reviews.length} đánh giá</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_380px]">
                <div className="space-y-4">
                  {reviewsLoading ? (
                    <div className="rounded-[24px] bg-slate-50 px-6 py-10 text-center text-slate-500">Đang tải danh sách đánh giá...</div>
                  ) : reviews.length === 0 ? (
                    <div className="rounded-[24px] bg-slate-50 px-6 py-10 text-center text-slate-500">
                      Chưa có đánh giá nào. Bạn có thể là người đầu tiên chia sẻ trải nghiệm.
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <article key={review.id} className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-950">{review.username || 'Người dùng Sports Now'}</p>
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
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">Gửi đánh giá của bạn</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Chỉ người dùng đã hoàn thành booking của sân này mới có thể gửi đánh giá.
                  </p>

                  {!token ? (
                    <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
                      Bạn cần <Link to="/login" className="font-semibold underline underline-offset-4">đăng nhập</Link> để kiểm tra quyền đánh giá.
                    </div>
                  ) : reviewEligibilityLoading ? (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                      Đang kiểm tra điều kiện đánh giá...
                    </div>
                  ) : !eligibleToReview ? (
                    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      Nút đánh giá chỉ mở sau khi booking của bạn chuyển sang trạng thái COMPLETED.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="mt-6 space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Số sao</label>
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
                          Bình luận
                        </label>
                        <textarea
                          id="review-comment"
                          name="comment"
                          value={reviewForm.comment}
                          onChange={handleReviewFieldChange}
                          placeholder="Sân có sạch sẽ, đèn sáng, nhân viên hỗ trợ tốt..."
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
                        {reviewSubmitting ? 'Đang gửi đánh giá...' : 'Gửi đánh giá'}
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
                    <CardDescription className="mt-2">Cơ sở: {centerName}</CardDescription>
                  </div>
                  <Badge variant="outline" className={`rounded-full px-3 py-1 ${getStatusClasses(detail.status)}`}>
                    {detail.status || 'Đang cập nhật'}
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
                      {formatRating(averageReviewRating)} <span className="font-normal text-slate-500">({reviews.length} đánh giá)</span>
                    </span>
                  </div>
                </div>

                <div className="rounded-[24px] bg-slate-50 px-5 py-5">
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-semibold text-slate-950">{formatPrice(detail.price)}</span>
                    <span className="pb-1 text-sm text-slate-500">/ gio</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/92 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <CardTitle className="text-2xl">Khung giờ khả dụng</CardTitle>
                <CardDescription>
                  {hasRealSchedules ? 'Chọn ngày đặt sân và xem khung giờ hiện có.' : 'Chủ sân cần tạo lịch hoạt động trước khi khách có thể đặt sân.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {hasRealSchedules ? (
                  <>
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
                  </>
                ) : (
                  <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm leading-7 text-slate-600">
                    Sân này đã được hiển thị trên hệ thống nhưng chưa có lịch hoạt động. Chủ sân cần vào khu quản lý để tạo các khung giờ đặt sân, sau đó khách mới có thể chọn giờ và thanh toán.
                  </div>
                )}

                <div className="rounded-[22px] bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-slate-400" />
                      Khung giờ đang chọn
                    </span>
                    <span className="font-semibold text-slate-950">
                      {selectedSlotInfo ? formatSlotLabel(selectedSlotInfo.startTime, selectedSlotInfo.endTime) : 'Chưa chọn'}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-slate-400" />
                      Tạm tính
                    </span>
                    <span className="font-semibold text-slate-950">{formatPrice(selectedSlotPrice)}</span>
                  </div>
                </div>

                <div className="rounded-[26px] border border-slate-200 bg-white px-5 py-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-950">Thông tin đặt lịch</h3>
                    <Badge variant="outline" className="rounded-full border-sky-200 bg-sky-50 px-3 py-1 text-sky-700">
                      {selectedSlotInfo ? 'Sẵn sàng thanh toán' : 'Chọn khung giờ'}
                    </Badge>
                  </div>

                  <div className="mt-5 space-y-5">
                    <div className="rounded-[22px] bg-slate-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Thông tin sân</p>
                      <div className="mt-3 space-y-2 text-sm text-slate-600">
                        <p className="font-semibold text-slate-950">{detail.fieldName}</p>
                        <p>{detail.address || centerAddress}</p>
                      </div>
                    </div>

                    <div className="rounded-[22px] bg-slate-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Thông tin lịch đặt</p>
                      <div className="mt-3 space-y-3 text-sm text-slate-600">
                        <div className="flex items-center justify-between gap-4">
                          <span>Ngày đặt</span>
                          <span className="font-medium text-slate-950">
                            {selectedDate ? formatDateChip(selectedDate) : 'Chưa chọn'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span>Sân</span>
                          <span className="font-medium text-slate-950">{detail.fieldName}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span>Khung giờ</span>
                          <span className="font-medium text-slate-950">
                            {selectedSlotInfo ? formatSlotLabel(selectedSlotInfo.startTime, selectedSlotInfo.endTime) : 'Chưa chọn'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span>Giá / giờ</span>
                          <span className="font-medium text-slate-950">{formatPrice(selectedSlotPrice)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span>Tổng giờ</span>
                          <span className="font-medium text-slate-950">
                            {bookingDurationHours ? `${bookingDurationHours} giờ` : '0 giờ'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
                          <span className="font-semibold text-slate-950">Tổng tiền</span>
                          <span className="text-base font-semibold text-slate-950">
                            {selectedSlotInfo ? formatPrice(bookingTotal) : 'Chưa chọn'}
                          </span>
                        </div>
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
                      disabled={!selectedSlotInfo || bookingSubmitting}
                      onClick={handleProceedToPayment}
                    >
                      {bookingSubmitting ? 'Đang tạo booking...' : 'Xác nhận và thanh toán'}
                    </Button>
                  </div>
                </div>

                <div className="rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" />
                    <p>
                      * Thời lượng đặt tối thiểu là 60 phút.
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </PublicShell>
  )
}

export { PitchDetail }
