import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

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

  const handleSearch = (e) => {
    e.preventDefault()
    fetchFields(0)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleResetFilters = () => {
    setFilters(initialFilters)
    navigate('/search')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),transparent_24%),linear-gradient(180deg,#f6f0e6_0%,#efe5d5_100%)] px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 overflow-hidden rounded-[32px] border border-stone-200/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,248,239,0.92))] px-6 py-8 shadow-[0_25px_70px_rgba(111,88,53,0.08)] md:px-8">
          <p className="text-sm font-medium text-stone-500">Trang chu / Tim kiem nang cao</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                Sports now
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">Tim kiem san the thao</h1>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-stone-600 md:text-base">
                Bo loc da nang nam gon ben trai, ket qua hien thi dang card ben phai de ban so sanh nhanh va chon san phu hop hon.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-600 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Tong ket</div>
              <div className="mt-1 font-semibold text-slate-900">
                {loading ? 'Dang tai ket qua...' : `Tim thay ${pageInfo.totalElements} san phu hop`}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-6 xl:self-start">
            <form onSubmit={handleSearch} className="rounded-[30px] border border-stone-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbf6ee_100%)] p-6 shadow-[0_20px_60px_rgba(103,81,48,0.08)]">
              <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">Filter Panel</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">Bo loc tim kiem</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">Tinh chinh nhanh khu vuc, gia va muc danh gia de loc ket qua chat hon.</p>
                </div>
                <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  {filterCount} dang dung
                </div>
              </div>

              <div className="mt-5 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">Tu khoa</label>
                  <input
                    name="keyword"
                    value={filters.keyword}
                    onChange={handleChange}
                    placeholder="Ten san, mo ta, dia chi..."
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 outline-none transition placeholder:text-stone-400 focus:border-slate-900 focus:ring-4 focus:ring-stone-200/70"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">Loai san</label>
                  <select
                    name="sportsType"
                    value={filters.sportsType}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-stone-200/70"
                  >
                    <option value="">Tat ca</option>
                    <option value="Football">Bong da</option>
                    <option value="Badminton">Cau long</option>
                    <option value="Tennis">Tennis</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">Khu vuc</label>
                  <input
                    name="address"
                    value={filters.address}
                    onChange={handleChange}
                    placeholder="Thu Duc, Quan 7..."
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 outline-none transition placeholder:text-stone-400 focus:border-slate-900 focus:ring-4 focus:ring-stone-200/70"
                  />
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white/70 p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Khoang gia</div>
                  <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-stone-700">Gia tu</label>
                    <input
                      name="minPrice"
                      type="number"
                      value={filters.minPrice}
                      onChange={handleChange}
                      placeholder="50000"
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 outline-none transition placeholder:text-stone-400 focus:border-slate-900 focus:ring-4 focus:ring-stone-200/70"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-stone-700">Gia den</label>
                    <input
                      name="maxPrice"
                      type="number"
                      value={filters.maxPrice}
                      onChange={handleChange}
                      placeholder="300000"
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 outline-none transition placeholder:text-stone-400 focus:border-slate-900 focus:ring-4 focus:ring-stone-200/70"
                    />
                  </div>
                </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">Rating toi thieu</label>
                  <select
                    name="minRating"
                    value={filters.minRating}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-stone-200/70"
                  >
                    <option value="">Khong gioi han</option>
                    <option value="3">Tu 3.0</option>
                    <option value="4">Tu 4.0</option>
                    <option value="4.5">Tu 4.5</option>
                  </select>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white/70 p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Sap xep ket qua</div>
                  <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-stone-700">Sap xep theo</label>
                    <select
                      name="sortBy"
                      value={filters.sortBy}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-stone-200/70"
                    >
                      <option value="rating">Rating</option>
                      <option value="price">Gia</option>
                      <option value="fieldName">Ten san</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-stone-700">Thu tu</label>
                    <select
                      name="sortDir"
                      value={filters.sortDir}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-stone-200/70"
                    >
                      <option value="desc">Giam dan</option>
                      <option value="asc">Tang dan</option>
                    </select>
                  </div>
                </div>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-stone-100 pt-5">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[linear-gradient(180deg,#1e293b_0%,#0f172a_100%)] px-5 py-3.5 font-semibold text-white shadow-[0_18px_30px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-700"
                >
                  Tim ket qua phu hop
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full rounded-2xl border border-stone-300 bg-white px-5 py-3.5 font-semibold text-stone-700 transition hover:border-slate-900 hover:text-slate-900"
                >
                  Xoa bo loc
                </button>
              </div>
            </form>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[28px] border border-stone-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbf6ee_100%)] px-5 py-5 shadow-[0_20px_60px_rgba(103,81,48,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Search Results</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 md:text-[30px]">Danh sach ket qua dang card</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-stone-600">
                <span>{pageInfo.totalElements} co so</span>
                <Link to="/" className="font-semibold text-slate-900 underline-offset-4 hover:underline">
                  Ve trang chu
                </Link>
              </div>
              </div>

              {activeFilterLabels.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-stone-100 pt-4">
                  {activeFilterLabels.map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {fields.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
                {fields.map((field, index) => (
                  <article key={field.id} className="overflow-hidden rounded-[26px] border border-stone-200 bg-white shadow-[0_18px_40px_rgba(103,81,48,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_54px_rgba(103,81,48,0.14)]">
                    <div className="relative h-56 bg-stone-200">
                      <img
                        src={fieldImages[index % fieldImages.length]}
                        alt={field.fieldName}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent" />
                      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                        <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                          {field.sportsType || 'The thao'}
                        </span>
                        <span className="rounded-full bg-slate-900/85 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                          ★ {Number(field.rating || 4.5).toFixed(1)}
                        </span>
                      </div>
                      <div className="absolute inset-x-5 bottom-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                          Co the dat nhanh
                        </div>
                      </div>
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold leading-tight text-slate-900">{field.fieldName}</h3>
                          <p className="mt-1 text-sm text-stone-500">{field.address}</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
                          {field.status}
                        </span>
                      </div>

                      <p className="mb-4 line-clamp-2 text-sm leading-6 text-stone-600">
                        {field.description || 'Thong tin mo ta dang duoc cap nhat cho co so nay.'}
                      </p>

                      <div className="mb-4 flex flex-wrap gap-2">
                        <span className="rounded-xl bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700">
                          {field.sportsType || 'Da mon'}
                        </span>
                        <span className="rounded-xl bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700">
                          Danh gia cao
                        </span>
                        <span className="rounded-xl bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700">
                          Dat nhanh
                        </span>
                      </div>

                      <div className="flex items-end justify-between gap-4 border-t border-stone-100 pt-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Gia tham khao</p>
                          <p className="mt-1 text-xl font-bold text-slate-900">{formatPrice(field.price)}</p>
                        </div>
                        <Link
                          to={`/pitch/${field.id}`}
                          className="rounded-2xl border border-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
                        >
                          Xem chi tiet
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] border-2 border-dashed border-stone-300 bg-white/90 px-6 py-24 text-center text-stone-500 shadow-sm">
                {loading ? 'Dang tai du lieu...' : 'Khong tim thay san nao khop voi dieu kien cua ban.'}
              </div>
            )}

            {pageInfo.totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-3 rounded-[28px] border border-stone-200 bg-white px-5 py-4 shadow-sm">
                <button
                  type="button"
                  disabled={pageInfo.number === 0 || loading}
                  onClick={() => fetchFields(pageInfo.number - 1)}
                  className="rounded-2xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Trang truoc
                </button>
                <div className="text-sm text-stone-600">
                  Trang {pageInfo.number + 1} / {pageInfo.totalPages}
                </div>
                <button
                  type="button"
                  disabled={pageInfo.number + 1 >= pageInfo.totalPages || loading}
                  onClick={() => fetchFields(pageInfo.number + 1)}
                  className="rounded-2xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Trang sau
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default Search
