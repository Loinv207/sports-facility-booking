import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Filter, MapPin, Search as SearchIcon, SlidersHorizontal, Star, Trophy } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const initialFilters = {
  keyword: '',
  sportsType: '',
  address: '',
  minPrice: '',
  maxPrice: '',
  minRating: '',
  sortBy: 'rating',
  sortDir: 'desc',
}

const fieldImages = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&q=80&w=900',
]

const formatPrice = (price) => {
  if (price === null || price === undefined || price === '') {
    return 'Lien he'
  }

  return `${new Intl.NumberFormat('vi-VN').format(Number(price))} VND/gio`
}

const activeFilterCount = (filters) =>
  Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy' || key === 'sortDir') {
      return false
    }

    return value !== '' && value !== null && value !== undefined
  }).length

const buildActiveFilterLabels = (filters) => {
  const labels = []

  if (filters.keyword) labels.push(`Tu khoa: ${filters.keyword}`)
  if (filters.sportsType) labels.push(`Loai: ${filters.sportsType}`)
  if (filters.address) labels.push(`Khu vuc: ${filters.address}`)
  if (filters.minPrice) labels.push(`Gia tu: ${filters.minPrice}`)
  if (filters.maxPrice) labels.push(`Gia den: ${filters.maxPrice}`)
  if (filters.minRating) labels.push(`Rating: ${filters.minRating}+`)

  return labels
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

const Search = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState(initialFilters)
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageInfo, setPageInfo] = useState({
    number: 0,
    totalPages: 0,
    totalElements: 0,
    size: 9,
  })

  const filterCount = useMemo(() => activeFilterCount(filters), [filters])
  const activeFilterLabels = useMemo(() => buildActiveFilterLabels(filters), [filters])

  const fetchFields = async (page = 0, nextFilters = filters) => {
    try {
      setLoading(true)

      const params = {
        ...Object.fromEntries(
          Object.entries(nextFilters).filter(([, value]) => value !== '' && value !== null && value !== undefined)
        ),
        page,
        size: pageInfo.size,
      }

      const res = await axios.get('http://localhost:8080/api/fields/search', { params })
      setFields(res.data.content || [])
      setPageInfo({
        number: res.data.number ?? 0,
        totalPages: res.data.totalPages ?? 0,
        totalElements: res.data.totalElements ?? 0,
        size: res.data.size ?? 9,
      })
    } catch (err) {
      console.error('Loi khi fetch du lieu san:', err)
      setFields([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const keywordFromUrl = searchParams.get('keyword') || ''
    const nextFilters = { ...initialFilters, keyword: keywordFromUrl }
    setFilters(nextFilters)
    fetchFields(0, nextFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleSearch = (event) => {
    event.preventDefault()
    fetchFields(0)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleResetFilters = () => {
    setFilters(initialFilters)
    navigate('/search')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f4f8ff,_#eef2ff_42%,_#f8fafc_100%)] text-slate-900">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Card className="border-0 bg-white/88 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <CardContent className="grid gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1.1fr)_320px] lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Search Center</p>
              <h1 className="mt-3 text-[clamp(2.2rem,4vw,4rem)] font-semibold leading-[0.98] text-slate-950">
                Tim kiem san the thao theo bo loc chi tiet
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                Tap trung vao bo loc thuc dung, ket qua dang card de so sanh nhanh va mot giao dien dong bo voi dashboard lich su dat san.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge className="rounded-full bg-sky-50 px-3 py-1.5 text-sky-700 hover:bg-sky-50">Search refined</Badge>
                <Badge className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-700 hover:bg-amber-50">Loc theo gia va rating</Badge>
                <Badge className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 hover:bg-emerald-50">Card view de so sanh</Badge>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              <Card className="border-0 bg-slate-50 shadow-none ring-1 ring-slate-200">
                <CardContent className="flex items-center gap-4 px-5 py-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                    <SearchIcon className="h-5 w-5 text-sky-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ket qua</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{loading ? '--' : pageInfo.totalElements}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 bg-amber-50 shadow-none ring-1 ring-amber-200">
                <CardContent className="flex items-center gap-4 px-5 py-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                    <Filter className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Bo loc</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{filterCount}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 bg-emerald-50 shadow-none ring-1 ring-emerald-200">
                <CardContent className="flex items-center gap-4 px-5 py-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                    <Trophy className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Trang</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">
                      {loading ? '--' : `${pageInfo.number + 1}/${Math.max(pageInfo.totalPages, 1)}`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-6 xl:self-start">
            <Card className="border-0 bg-white/92 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <SlidersHorizontal className="h-5 w-5 text-sky-700" />
                      Bo loc tim kiem
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Tinh chinh nhanh khu vuc, gia va muc danh gia de loc ket qua chat hon.
                    </CardDescription>
                  </div>
                  <Badge className="rounded-full bg-slate-900 px-3 py-1 text-white hover:bg-slate-900">
                    {filterCount} dang dung
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSearch} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Tu khoa</label>
                    <Input
                      name="keyword"
                      value={filters.keyword}
                      onChange={handleChange}
                      placeholder="Ten san, mo ta, dia chi..."
                      className="h-11 rounded-2xl border-slate-200 bg-slate-50 px-4"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Loai san</label>
                    <select
                      name="sportsType"
                      value={filters.sportsType}
                      onChange={handleChange}
                      className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-200/70"
                    >
                      <option value="">Tat ca</option>
                      <option value="Football">Bong da</option>
                      <option value="Badminton">Cau long</option>
                      <option value="Tennis">Tennis</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Khu vuc</label>
                    <Input
                      name="address"
                      value={filters.address}
                      onChange={handleChange}
                      placeholder="Thu Duc, Quan 7..."
                      className="h-11 rounded-2xl border-slate-200 bg-slate-50 px-4"
                    />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Khoang gia</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        name="minPrice"
                        type="number"
                        value={filters.minPrice}
                        onChange={handleChange}
                        placeholder="50000"
                        className="h-11 rounded-2xl border-slate-200 bg-white px-4"
                      />
                      <Input
                        name="maxPrice"
                        type="number"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        placeholder="300000"
                        className="h-11 rounded-2xl border-slate-200 bg-white px-4"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Rating toi thieu</label>
                    <select
                      name="minRating"
                      value={filters.minRating}
                      onChange={handleChange}
                      className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-200/70"
                    >
                      <option value="">Khong gioi han</option>
                      <option value="3">Tu 3.0</option>
                      <option value="4">Tu 4.0</option>
                      <option value="4.5">Tu 4.5</option>
                    </select>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Sap xep ket qua</p>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleChange}
                        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-200/70"
                      >
                        <option value="rating">Rating</option>
                        <option value="price">Gia</option>
                        <option value="fieldName">Ten san</option>
                      </select>
                      <select
                        name="sortDir"
                        value={filters.sortDir}
                        onChange={handleChange}
                        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-200/70"
                      >
                        <option value="desc">Giam dan</option>
                        <option value="asc">Tang dan</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" className="h-11 flex-1 rounded-2xl">
                      Tim ket qua
                    </Button>
                    <Button type="button" variant="outline" className="h-11 rounded-2xl border-slate-300 bg-white" onClick={handleResetFilters}>
                      Xoa loc
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </aside>

          <section className="space-y-6">
            <Card className="border-0 bg-white/92 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl">Danh sach ket qua dang card</CardTitle>
                    <CardDescription className="mt-2">
                      Xem nhanh thong tin san, gia tham khao va truy cap sang trang chi tiet.
                    </CardDescription>
                  </div>
                  <Button asChild variant="outline" className="rounded-2xl border-slate-300 bg-white">
                    <Link to="/">Ve trang chu</Link>
                  </Button>
                </div>

                {activeFilterLabels.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeFilterLabels.map((label) => (
                      <Badge key={label} className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-700 hover:bg-amber-50">
                        {label}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
            </Card>

            {fields.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {fields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="overflow-hidden border-0 bg-white/92 shadow-[0_24px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_32px_80px_rgba(15,23,42,0.12)]"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={fieldImages[index % fieldImages.length]}
                        alt={field.fieldName}
                        className="h-full w-full object-cover transition duration-500 group-hover/card:scale-105"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.46))]" />
                      <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                        <Badge className="rounded-full bg-white/85 px-3 py-1 text-slate-900 hover:bg-white/85">
                          {field.sportsType || 'The thao'}
                        </Badge>
                        <div className="inline-flex items-center gap-1 rounded-full bg-slate-950/75 px-3 py-1 text-sm font-medium text-white backdrop-blur">
                          <Star className="h-3.5 w-3.5 fill-current text-amber-300" />
                          {Number(field.rating || 4.5).toFixed(1)}
                        </div>
                      </div>
                    </div>

                    <CardHeader className="pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-xl">{field.fieldName}</CardTitle>
                          <CardDescription className="mt-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {field.address}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className={`rounded-full px-3 py-1 ${getStatusClasses(field.status)}`}>
                          {field.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-5 pt-5">
                      <p className="text-sm leading-7 text-slate-600">
                        {field.description || 'Thong tin mo ta dang duoc cap nhat cho co so nay.'}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                          {field.sportsType || 'Da mon'}
                        </Badge>
                        <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                          Danh gia cao
                        </Badge>
                        <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                          Dat nhanh
                        </Badge>
                      </div>

                      <div className="flex items-end justify-between gap-4 rounded-[22px] bg-slate-50 px-4 py-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Gia tham khao</p>
                          <p className="mt-1 text-xl font-semibold text-slate-950">{formatPrice(field.price)}</p>
                        </div>
                        <Button asChild className="rounded-xl">
                          <Link to={`/pitch/${field.id}`}>
                            Xem chi tiet
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 bg-white/90 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                <CardContent className="px-6 py-20 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
                    <SearchIcon className="h-7 w-7 text-slate-500" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-slate-950">
                    {loading ? 'Dang tai du lieu...' : 'Khong tim thay san nao phu hop'}
                  </h3>
                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    Dieu chinh bo loc hoac thu mot tu khoa khac de mo rong danh sach ket qua.
                  </p>
                </CardContent>
              </Card>
            )}

            {pageInfo.totalPages > 1 && (
              <Card className="border-0 bg-white/92 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                <CardContent className="flex flex-wrap items-center justify-center gap-3 px-5 py-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-slate-300 bg-white"
                    disabled={pageInfo.number === 0 || loading}
                    onClick={() => fetchFields(pageInfo.number - 1)}
                  >
                    Trang truoc
                  </Button>
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                    Trang {pageInfo.number + 1} / {pageInfo.totalPages}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-slate-300 bg-white"
                    disabled={pageInfo.number + 1 >= pageInfo.totalPages || loading}
                    onClick={() => fetchFields(pageInfo.number + 1)}
                  >
                    Trang sau
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default Search
