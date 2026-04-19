import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'

const fallbackImagesBySport = {
  Football: [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1400',
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&q=80&w=1000',
  ],
  Badminton: [
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1400',
    'https://images.unsplash.com/photo-1613918431703-aa508a2f4d2f?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1000',
  ],
  Tennis: [
    'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1400',
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1530915365347-e35b749a0381?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1542144582-1ba00456b5e3?auto=format&fit=crop&q=80&w=1000',
  ],
}

const statCardsBySport = {
  Football: [
    { label: 'Loai mat san', value: 'Co nhan tao 3G' },
    { label: 'Kich thuoc', value: '20m x 40m' },
    { label: 'Suc chua', value: '10 - 14 nguoi' },
    { label: 'Gio hoat dong', value: '06:00 - 23:00' },
  ],
  Badminton: [
    { label: 'Loai mat san', value: 'Tham PVC chuyen dung' },
    { label: 'Kich thuoc', value: '13.4m x 6.1m' },
    { label: 'Suc chua', value: '4 - 8 nguoi' },
    { label: 'Gio hoat dong', value: '06:00 - 22:30' },
  ],
  Tennis: [
    { label: 'Loai mat san', value: 'San acrylic ngoai troi' },
    { label: 'Kich thuoc', value: '23.7m x 10.97m' },
    { label: 'Suc chua', value: '2 - 6 nguoi' },
    { label: 'Gio hoat dong', value: '05:30 - 22:00' },
  ],
}

const amenityBySport = {
  Football: ['Bai giu xe', 'Phong thay do', 'Phong tam', 'Den chieu sang', 'Thue dung cu', 'Can tin'],
  Badminton: ['Bai giu xe', 'Khu khoi dong', 'May lanh', 'Phong tam', 'Nuoc uong', 'Cho ngoi cho'],
  Tennis: ['Bai giu xe', 'Phong thay do', 'Phong tam', 'Den chieu sang', 'Shop phu kien', 'Khu lounge'],
}

const sampleTimeRanges = [
  ['07:00', '08:00'],
  ['08:00', '09:00'],
  ['09:00', '10:00'],
  ['10:00', '11:00'],
  ['17:00', '18:00'],
  ['18:00', '19:00'],
  ['19:00', '20:00'],
  ['20:00', '21:00'],
]

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

const renderStars = (rating, className = 'h-4 w-4') => {
  const normalizedRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)))

  return Array.from({ length: 5 }, (_, index) => (
    <svg
      key={`star-${index}`}
      viewBox="0 0 24 24"
      fill={index < normalizedRating ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
    >
      <path d="m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9L12 3Z" />
    </svg>
  ))
}

const formatReviewDate = (value) => {
  if (!value) {
    return 'Vua xong'
  }

  const date = new Date(value)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const formatSlotLabel = (startTime, endTime) => `${String(startTime).slice(0, 5)} - ${String(endTime).slice(0, 5)}`

const getSportLabel = (sportsType) => {
  switch (sportsType) {
    case 'Football':
      return 'Bong da 5 nguoi'
    case 'Badminton':
      return 'San cau long'
    case 'Tennis':
      return 'San tennis'
    default:
      return 'San the thao'
  }
}

const getFallbackImages = (sportsType) => fallbackImagesBySport[sportsType] || fallbackImagesBySport.Football

const getAmenityList = (sportsType) => amenityBySport[sportsType] || amenityBySport.Football

const getStatCards = (sportsType) => statCardsBySport[sportsType] || statCardsBySport.Football

const buildPreviewSchedules = (price) => {
  const today = new Date()

  return Array.from({ length: 4 }, (_, dayOffset) => {
    const currentDate = new Date(today)
    currentDate.setDate(today.getDate() + dayOffset)

    return sampleTimeRanges.map(([start, end], slotIndex) => ({
      id: `preview-${dayOffset}-${slotIndex}`,
      scheduleDate: currentDate.toISOString().slice(0, 10),
      startTime: `${start}:00`,
      endTime: `${end}:00`,
      price,
      status: slotIndex < 2 || slotIndex === 5 ? 'BOOKED' : 'AVAILABLE',
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
  const weekDay = new Intl.DateTimeFormat('vi-VN', { weekday: 'short' }).format(date).replace('.', '')
  const day = new Intl.DateTimeFormat('vi-VN', { day: '2-digit' }).format(date)
  const month = new Intl.DateTimeFormat('vi-VN', { month: '2-digit' }).format(date)

  return {
    weekDay: weekDay.charAt(0).toUpperCase() + weekDay.slice(1),
    day,
    month,
  }
}

const getStatusLabel = (status) => {
  if (status === 'ACTIVE' || status === 'AVAILABLE') {
    return 'Con trong'
  }

  if (status === 'BOOKED') {
    return 'Da dat'
  }

  return status || 'Dang cap nhat'
}

const DetailIcon = ({ children }) => (
  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      {children}
    </svg>
  </span>
)

const PitchDetail = () => {
  const { id } = useParams()
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

  useEffect(() => {
    const fetchPitchDetail = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:8080/api/fields/${id}/full-details`)
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
        const response = await axios.get(`http://localhost:8080/api/fields/${id}/reviews`)
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

  const galleryImages = useMemo(() => {
    if (!detail) {
      return getFallbackImages('Football')
    }

    const apiImages = (detail.images || []).map((item) => item.imageUrl).filter(Boolean)
    return apiImages.length > 0 ? apiImages : getFallbackImages(detail.sportsType)
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

    setSelectedDate((current) => {
      const nextDate = groupedDates.some((item) => item.date === current) ? current : groupedDates[0].date
      return nextDate
    })
  }, [groupedDates])

  useEffect(() => {
    setSelectedSlot((current) => {
      const availableSlot = selectedDateSlots.find((item) => item.status !== 'BOOKED')
      if (current && selectedDateSlots.some((item) => item.id === current)) {
        return current
      }

      return availableSlot?.id || ''
    })
  }, [selectedDateSlots])

  const token = localStorage.getItem('token')
  const averageReviewRating = useMemo(() => {
    if (!detail) {
      return 0
    }

    if (reviews.length === 0) {
      return Number(detail.rating || 0)
    }

    return reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
  }, [detail, reviews])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#17191d] px-4 py-10 text-slate-100">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-14 rounded-2xl bg-white/5" />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_380px]">
            <div className="h-[520px] rounded-[32px] bg-white/5" />
            <div className="h-[520px] rounded-[32px] bg-white/5" />
          </div>
        </div>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-[#17191d] px-4 py-16 text-slate-100">
        <div className="mx-auto max-w-3xl rounded-[30px] border border-white/10 bg-[#202329] px-8 py-16 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Pitch Detail</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Khong tai duoc thong tin san</h1>
          <p className="mt-4 text-base leading-7 text-slate-400">
            Co the id san khong ton tai hoac backend chua tra ve du lieu chi tiet. Ban thu quay lai danh sach va mo lai mot san khac nhe.
          </p>
          <Link
            to="/search"
            className="mt-8 inline-flex items-center rounded-2xl bg-[#29344f] px-5 py-3 font-semibold text-white transition hover:bg-[#33415f]"
          >
            Ve trang tim kiem
          </Link>
        </div>
      </div>
    )
  }

  const sportLabel = getSportLabel(detail.sportsType)
  const amenities = getAmenityList(detail.sportsType)
  const statCards = getStatCards(detail.sportsType)
  const centerName = detail.sportsCenter?.name || 'Trung tam the thao dang cap nhat'
  const centerAddress = detail.sportsCenter?.address || detail.address || 'Dia chi dang cap nhat'
  const selectedSlotPrice = selectedSlotInfo?.price ?? detail.price
  const hasPreviewSchedule = normalizedSchedules.some((item) => item.isPreview)

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
        `http://localhost:8080/api/fields/${id}/reviews`,
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

  return (
    <div className="min-h-screen bg-[#17191d] text-slate-100">
      <header className="border-b border-white/8 bg-[#181a1f]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 lg:px-6">
          <Link to="/" className="text-sm font-extrabold tracking-[0.14em] text-white">
            SPORTS NOW
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <Link to="/" className="transition hover:text-white">Trang chu</Link>
            <Link to="/search" className="border-b border-slate-200 pb-1 text-white">San the thao</Link>
            <Link to="/owner-management" className="transition hover:text-white">Co so</Link>
            <Link to="/profile" className="transition hover:text-white">Dat san cua toi</Link>
            <Link to="/login" className="transition hover:text-white">Dang nhap</Link>
          </nav>
          <Link
            to="/register"
            className="rounded-xl border border-[#34405a] bg-[#25324d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#30405f]"
          >
            Dang ky
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-10">
        <div className="mb-8 text-sm text-slate-500">
          <Link to="/" className="transition hover:text-slate-300">Trang chu</Link>
          <span className="mx-2">/</span>
          <Link to="/search" className="transition hover:text-slate-300">San the thao</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-300">Chi tiet san</span>
        </div>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.25fr)_360px] xl:grid-cols-[minmax(0,1.34fr)_390px]">
          <section className="space-y-7">
            <div>
              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#202329] shadow-[0_36px_80px_rgba(0,0,0,0.32)]">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={selectedImage}
                    alt={detail.fieldName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,18,25,0.04),rgba(15,18,25,0.38))]" />
                <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                  {detail.sportsType || 'The thao'}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3">
                {galleryImages.slice(0, 4).map((image) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`group relative overflow-hidden rounded-[20px] border transition ${
                      selectedImage === image
                        ? 'border-[#6c87bb] shadow-[0_0_0_1px_rgba(108,135,187,0.55)]'
                        : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="aspect-[1.4/1] overflow-hidden bg-white/5">
                      <img src={image} alt="Thumbnail san" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,18,25,0.04),rgba(15,18,25,0.42))]" />
                  </button>
                ))}
              </div>
            </div>

            <section>
              <h2 className="text-[28px] font-semibold text-white">Thong tin san</h2>
              <div className="mt-4 rounded-[28px] border border-white/10 bg-[#1f2228] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.24)]">
                <div className="grid gap-4 sm:grid-cols-2">
                  {statCards.map((item) => (
                    <div key={item.label} className="flex items-center gap-4 rounded-[22px] border border-white/6 bg-[#181b20] px-4 py-4">
                      <DetailIcon>
                        <path d="M4 7h16" />
                        <path d="M7 4v6" />
                        <path d="M17 4v6" />
                        <path d="M6 20h12" />
                      </DetailIcon>
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-100">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-5 max-w-4xl text-[15px] leading-8 text-slate-400">
                {detail.description || 'San duoc bao duong dinh ky, khong gian sach se va toi uu cho ca tap luyen dinh ky lan thi dau phong trao.'}
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-semibold text-white">Thong tin trung tam</h2>
              <div className="mt-4 rounded-[28px] border border-white/10 bg-[#1f2228] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.24)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sports Center</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{centerName}</h3>
                    <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-400">{centerAddress}</p>
                    <p className="mt-2 text-sm text-slate-500">{detail.sportsCenter?.city || 'TP.HCM'}</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                    {detail.sportsCenter?.approvalStatus || 'APPROVED'}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-[28px] font-semibold text-white">Tien ich</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {amenities.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-[#1f2228] px-4 py-4 text-sm font-medium text-slate-200">
                    <DetailIcon>
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </DetailIcon>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-[28px] font-semibold text-white">Review & Rating</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Xem nhan xet thuc te tu nguoi dung va chia se trai nghiem cua ban ve san nay.
                  </p>
                </div>
                <div className="rounded-[24px] border border-amber-400/15 bg-amber-400/10 px-5 py-4 shadow-[0_16px_40px_rgba(245,158,11,0.08)]">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-semibold leading-none text-white">{formatRating(averageReviewRating)}</span>
                    <div>
                      <div className="flex items-center gap-1 text-amber-300">
                        {renderStars(averageReviewRating)}
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{reviews.length} danh gia tu khach hang</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_380px]">
                <div className="space-y-4">
                  {reviewsLoading ? (
                    <div className="rounded-[28px] border border-white/10 bg-[#1f2228] px-6 py-10 text-center text-slate-400">
                      Dang tai danh sach danh gia...
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="rounded-[28px] border border-white/10 bg-[#1f2228] px-6 py-10 text-center text-slate-400">
                      Chua co danh gia nao. Ban co the la nguoi dau tien chia se trai nghiem.
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <article
                        key={review.id}
                        className="rounded-[28px] border border-white/10 bg-[#1f2228] p-5 shadow-[0_22px_50px_rgba(0,0,0,0.2)]"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-lg font-semibold text-white">{review.username || 'Nguoi dung Sports Now'}</p>
                            <div className="mt-2 flex items-center gap-1 text-amber-300">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <p className="text-sm text-slate-500">{formatReviewDate(review.createdAt)}</p>
                        </div>
                        <p className="mt-4 text-[15px] leading-8 text-slate-300">{review.comment}</p>
                      </article>
                    ))
                  )}
                </div>

                <aside className="rounded-[30px] border border-white/10 bg-[#1f2228] p-6 shadow-[0_32px_70px_rgba(0,0,0,0.26)]">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Your Review</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Gui danh gia cua ban</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Cham diem nhanh bang sao va de lai mot binh luan ngan de nguoi dung khac tham khao.
                  </p>

                  <form onSubmit={handleSubmitReview} className="mt-6 space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">So sao</label>
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
                                  ? 'border-amber-300/40 bg-amber-400/10 text-amber-300'
                                  : 'border-white/10 bg-[#181b20] text-slate-400 hover:border-white/20 hover:text-slate-200'
                              }`}
                            >
                              <div className="flex justify-center">{renderStars(value, 'h-4 w-4')}</div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-slate-300">
                        Binh luan
                      </label>
                      <textarea
                        id="review-comment"
                        name="comment"
                        value={reviewForm.comment}
                        onChange={handleReviewFieldChange}
                        placeholder="San co sach se, den sang, nhan vien ho tro tot..."
                        rows={5}
                        className="w-full rounded-[22px] border border-white/10 bg-[#181b20] px-4 py-3.5 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#6c87bb] focus:ring-4 focus:ring-[#34415f]/50"
                        maxLength={1000}
                        required
                      />
                      <div className="mt-2 text-right text-xs text-slate-500">{reviewForm.comment.length}/1000</div>
                    </div>

                    {!token && (
                      <div className="rounded-2xl border border-sky-400/15 bg-sky-400/10 px-4 py-3 text-sm text-sky-200">
                        Ban can <Link to="/login" className="font-semibold underline underline-offset-4">dang nhap</Link> de gui danh gia.
                      </div>
                    )}

                    {reviewMessage && (
                      <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                        {reviewMessage}
                      </div>
                    )}

                    {reviewError && (
                      <div className="rounded-2xl border border-rose-400/15 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                        {reviewError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="w-full rounded-2xl bg-[#2f4266] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3b5078] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {reviewSubmitting ? 'Dang gui danh gia...' : 'Gui danh gia'}
                    </button>
                  </form>
                </aside>
              </div>
            </section>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[30px] border border-white/10 bg-[#1f2228] p-6 shadow-[0_32px_70px_rgba(0,0,0,0.3)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="m-0 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.08] text-white">
                    {detail.fieldName}
                  </h1>
                  <p className="mt-3 text-sm text-slate-400">Co so: {centerName}</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200">
                  {getStatusLabel(detail.status)}
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-slate-400">
                <div className="flex items-start gap-3">
                  <DetailIcon>
                    <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z" />
                    <circle cx="12" cy="11" r="2.5" />
                  </DetailIcon>
                  <span className="leading-7">{detail.address || centerAddress}</span>
                </div>
                <div className="flex items-center gap-3">
                  <DetailIcon>
                    <path d="m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9L12 3Z" />
                  </DetailIcon>
                  <span className="font-semibold text-slate-100">
                    {formatRating(averageReviewRating)} <span className="font-normal text-slate-400">({reviews.length} danh gia)</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <DetailIcon>
                    <path d="M4 18V8l8-4 8 4v10" />
                    <path d="M9 22v-6h6v6" />
                  </DetailIcon>
                  <span>{sportLabel}</span>
                </div>
              </div>

              <div className="mt-6 border-y border-white/8 py-5">
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-semibold leading-none text-white">{formatPrice(detail.price)}</span>
                  <span className="pb-1 text-sm text-slate-500">/ gio</span>
                </div>
              </div>

              <p className="mt-5 text-[15px] leading-7 text-slate-400">
                {detail.description || 'San co chat luong van hanh on dinh, khong gian gon gang va phu hop cho ca nhom ban lan nguoi choi dat lich thuong xuyen.'}
              </p>

              <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
                <button
                  type="button"
                  className="rounded-2xl bg-[#2f4266] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3b5078]"
                >
                  Dat san ngay
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/7"
                >
                  Luu san
                </button>
              </div>
            </section>

            <section className="rounded-[30px] border border-white/10 bg-[#1f2228] p-6 shadow-[0_32px_70px_rgba(0,0,0,0.3)]">
              <h2 className="text-[28px] font-semibold text-white">Khung gio kha dung</h2>
              <p className="mt-2 text-sm text-slate-500">Chon ngay dat san:</p>

              <div className="mt-5 grid grid-cols-4 gap-3">
                {groupedDates.map(({ date }) => {
                  const chip = formatDateChip(date)
                  const active = selectedDate === date

                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={`rounded-[18px] border px-3 py-3 text-center transition ${
                        active
                          ? 'border-[#6c87bb] bg-[#273552] text-white shadow-[0_0_0_1px_rgba(108,135,187,0.45)]'
                          : 'border-white/10 bg-[#181b20] text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs font-medium uppercase tracking-[0.14em]">{chip.weekDay}</div>
                      <div className="mt-1 text-xl font-semibold leading-none">{chip.day}</div>
                      <div className="mt-1 text-xs text-slate-400">{chip.month}</div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {selectedDateSlots.map((slot) => {
                  const active = selectedSlot === slot.id
                  const isBooked = slot.status === 'BOOKED'

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`rounded-[18px] border px-3 py-3 text-sm font-semibold transition ${
                        isBooked
                          ? 'cursor-not-allowed border-white/5 bg-[#17191d] text-slate-600'
                          : active
                            ? 'border-[#7f9bd3] bg-[#30405f] text-white shadow-[0_0_0_1px_rgba(127,155,211,0.45)]'
                            : 'border-white/10 bg-[#181b20] text-slate-200 hover:border-white/25 hover:bg-[#20262d]'
                      }`}
                    >
                      {formatSlotLabel(slot.startTime, slot.endTime)}
                    </button>
                  )
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-white/8 bg-[#181b20] px-4 py-4 text-sm text-slate-400">
                <div className="flex items-center justify-between gap-3">
                  <span>Khung gio dang chon</span>
                  <span className="font-semibold text-slate-100">
                    {selectedSlotInfo ? formatSlotLabel(selectedSlotInfo.startTime, selectedSlotInfo.endTime) : 'Chua chon'}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span>Tam tinh</span>
                  <span className="font-semibold text-white">{formatPrice(selectedSlotPrice)}</span>
                </div>
              </div>

              <p className="mt-4 text-xs italic text-slate-500">
                * Thoi luong dat toi thieu la 60 phut.
                {hasPreviewSchedule ? ' Khung gio hien tai dang o che do minh hoa vi san chua co lich dat tu backend.' : ''}
              </p>

              <button
                type="button"
                className="mt-6 w-full rounded-2xl bg-[#2f4266] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3b5078]"
              >
                Tien hanh thanh toan
              </button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}

export { PitchDetail }
