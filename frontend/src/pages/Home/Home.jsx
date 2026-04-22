import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Compass, MapPin, Search, ShieldCheck, Sparkles, Star, Trophy, Wallet } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const fieldImages = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&q=80&w=1200',
]

const formatPrice = (price) => {
  if (price === null || price === undefined || price === '') {
    return 'Lien he'
  }

  const numericPrice = Number(price)
  if (Number.isNaN(numericPrice)) {
    return `${price} VND`
  }

  return `${new Intl.NumberFormat('vi-VN').format(numericPrice)} VND`
}

const formatRating = (rating) => {
  if (rating === null || rating === undefined || rating === '') {
    return '4.5'
  }

  return Number(rating).toFixed(1)
}

const getShortAddress = (address) => {
  if (!address) {
    return 'Khu vuc dang cap nhat'
  }

  const parts = address.split(',').map((item) => item.trim()).filter(Boolean)
  return parts.slice(0, 2).join(', ') || address
}

const getShortDescription = (description) => {
  if (!description) {
    return 'Co so the thao duoc xep hang tot, phu hop cho nhom ban va cac buoi tap luyen dinh ky.'
  }

  return description.length > 115 ? `${description.slice(0, 112)}...` : description
}

const getStatusClasses = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700'
    case 'PENDING':
      return 'border-amber-500/20 bg-amber-500/10 text-amber-700'
    default:
      return 'border-slate-300 bg-slate-100 text-slate-700'
  }
}

const SummaryCard = ({ icon: Icon, label, value, tone }) => (
  <Card className={`border-0 shadow-none ring-1 ${tone}`}>
    <CardContent className="flex items-center gap-4 px-5 py-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/75">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      </div>
    </CardContent>
  </Card>
)

const FeaturePill = ({ icon: Icon, children }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
    <Icon className="h-4 w-4 text-sky-700" />
    <span>{children}</span>
  </div>
)

const EmptyState = ({ loading }) => (
  <Card className="border-0 bg-white/90 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
    <CardContent className="px-6 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
        <Compass className="h-7 w-7 text-slate-500" />
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-slate-950">
        {loading ? 'Dang tai du lieu tu he thong...' : 'Hien tai chua co co so nao dang hoat dong'}
      </h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
        {loading
          ? 'Danh sach san dang duoc dong bo tu backend. Ban doi mot chut nhe.'
          : 'Ban co the quay lai sau hoac cap nhat du lieu san tu trang quan ly de hien thi tai day.'}
      </p>
    </CardContent>
  </Card>
)

const HomePage = () => {
  const navigate = useNavigate()
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    const fetchActiveFields = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/fields/active')
        if (!response.ok) {
          throw new Error('Khong the tai danh sach san')
        }

        const data = await response.json()
        setFields(data)
      } catch (error) {
        console.error('Loi khi goi API /api/fields/active:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActiveFields()
  }, [])

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim()
    const searchParams = new URLSearchParams()

    if (trimmedKeyword) {
      searchParams.set('keyword', trimmedKeyword)
    }

    navigate(`/search${searchParams.toString() ? `?${searchParams.toString()}` : ''}`)
  }

  const totalVisible = fields.length
  const totalSports = new Set(fields.map((field) => field.sportsType).filter(Boolean)).size
  const averageRating = fields.length
    ? (
        fields.reduce((sum, field) => sum + Number(field.rating || 4.5), 0) / fields.length
      ).toFixed(1)
    : '0.0'

  const featuredFields = useMemo(() => fields.slice(0, 6), [fields])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f4f8ff,_#eef2ff_42%,_#f8fafc_100%)] text-slate-900">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-10">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_420px]">
          <Card className="overflow-hidden border-0 bg-[linear-gradient(145deg,#0f172a,#172554_55%,#1d4ed8)] text-white shadow-[0_32px_90px_rgba(15,23,42,0.28)]">
            <CardContent className="relative px-6 py-8 lg:px-8 lg:py-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_40%)]" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">Trang chu / Co so the thao</p>
                <Badge className="mt-4 rounded-full bg-white/12 px-4 py-1.5 text-white hover:bg-white/12">
                  Sports now
                </Badge>
                <h1 className="mt-5 max-w-3xl text-[clamp(2.4rem,5vw,4.8rem)] font-semibold leading-[0.98]">
                  Kham pha co so the thao phu hop cho lich tap cua ban
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200">
                  Tim kiem san dang hoat dong, so sanh nhanh theo bo mon, khu vuc va muc gia de dat lich nhanh hon tren mot giao dien moi, ro rang va de thao tac.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <FeaturePill icon={ShieldCheck}>San dang mo</FeaturePill>
                  <FeaturePill icon={Wallet}>Gia minh bach</FeaturePill>
                  <FeaturePill icon={Sparkles}>Dat lich nhanh</FeaturePill>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[24px] border border-white/10 bg-white/10 px-5 py-5 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.18em] text-sky-100">Co so hien thi</p>
                    <p className="mt-2 text-4xl font-semibold">{loading ? '--' : totalVisible}</p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/10 px-5 py-5 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.18em] text-sky-100">Mon the thao</p>
                    <p className="mt-2 text-4xl font-semibold">{loading ? '--' : totalSports}</p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/10 px-5 py-5 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.18em] text-sky-100">Danh gia TB</p>
                    <p className="mt-2 text-4xl font-semibold">{loading ? '--' : averageRating}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/88 shadow-[0_32px_80px_rgba(15,23,42,0.08)] backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-950">Tim nhanh co so</CardTitle>
              <CardDescription>
                Nhap ten san, mon the thao, dia chi hoac tu khoa mo ta de di den trang tim kiem voi bo loc san sang.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="field-search" className="text-sm font-medium text-slate-700">
                  Tu khoa
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="field-search"
                    type="text"
                    placeholder="Vi du: cau long, Thu Duc, san 7 nguoi..."
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        handleSearch()
                      }
                    }}
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-10 text-slate-900"
                  />
                </div>
              </div>

              <Button type="button" className="h-12 w-full rounded-2xl text-sm font-semibold" onClick={handleSearch}>
                Tim co so
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="grid gap-3 pt-2">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">San dang mo va co lich</p>
                    <p className="text-xs text-slate-500">Uu tien cac co so co the thao tac dat lich nhanh.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <Wallet className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Gia tien de theo doi</p>
                    <p className="text-xs text-slate-500">So sanh nhanh muc gia truoc khi vao chi tiet tung san.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <Trophy className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Danh gia de tham khao</p>
                    <p className="text-xs text-slate-500">Nhin nhanh chat luong co so dua tren rating hien co.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard icon={Compass} label="Co so hien thi" value={loading ? '--' : totalVisible} tone="border-slate-200/80 bg-slate-50/80 text-slate-700" />
          <SummaryCard icon={Trophy} label="Mon the thao" value={loading ? '--' : totalSports} tone="border-sky-200/80 bg-sky-50 text-sky-700" />
          <SummaryCard icon={Star} label="Danh gia TB" value={loading ? '--' : averageRating} tone="border-amber-200/80 bg-amber-50 text-amber-700" />
          <SummaryCard icon={Wallet} label="San sang dat lich" value={loading ? '--' : featuredFields.length} tone="border-emerald-200/80 bg-emerald-50 text-emerald-700" />
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Danh sach noi bat</p>
              <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.02] text-slate-950">
                Co so the thao dang hoat dong
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                Giao dien moi uu tien su can doi, de xem nhanh thong tin quan trong va thao tac dat san tren mot bo card dong nhat voi dashboard nguoi dung.
              </p>
            </div>

            {!loading && (
              <Button asChild variant="outline" className="rounded-2xl border-slate-300 bg-white">
                <Link to="/search">
                  Xem toan bo danh sach
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          <div className="mt-8">
            {loading || fields.length === 0 ? (
              <EmptyState loading={loading} />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {featuredFields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="overflow-hidden border-0 bg-white/92 shadow-[0_28px_70px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_34px_90px_rgba(15,23,42,0.14)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={fieldImages[index % fieldImages.length]}
                        alt={field.fieldName}
                        className="h-full w-full object-cover transition duration-500 group-hover/card:scale-105"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.46))]" />
                      <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                        <Badge className="rounded-full bg-white/85 px-3 py-1 text-slate-900 hover:bg-white/85">
                          {field.sportsType || 'The thao tong hop'}
                        </Badge>
                        <div className="inline-flex items-center gap-1 rounded-full bg-slate-950/75 px-3 py-1 text-sm font-medium text-white backdrop-blur">
                          <Star className="h-3.5 w-3.5 fill-current text-amber-300" />
                          {formatRating(field.rating)}
                        </div>
                      </div>
                    </div>

                    <CardHeader className="pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-xl text-slate-950">{field.fieldName}</CardTitle>
                          <CardDescription className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="h-4 w-4" />
                            {getShortAddress(field.address)}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className={`rounded-full px-3 py-1 ${getStatusClasses(field.status || 'ACTIVE')}`}>
                          {field.status || 'ACTIVE'}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-5 pt-5">
                      <p className="text-sm leading-7 text-slate-600">{getShortDescription(field.description)}</p>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                          {field.sportsType || 'Da mon'}
                        </Badge>
                        <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                          Co san hoat dong
                        </Badge>
                        <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                          Dat linh hoat
                        </Badge>
                      </div>

                      <div className="flex items-end justify-between gap-4 rounded-[24px] bg-slate-50 px-4 py-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tu</p>
                          <p className="mt-1 text-2xl font-semibold text-slate-950">{formatPrice(field.price)}</p>
                        </div>
                        <Button asChild className="rounded-xl">
                          <Link to={`/pitch/${field.id}`}>
                            Xem co so
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage
