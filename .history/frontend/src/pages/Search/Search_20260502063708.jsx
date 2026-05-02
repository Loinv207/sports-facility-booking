import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import PublicShell from '../../components/PublicShell'
import './Search.css'

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
    return 'Liên hệ'
  }

  return `${new Intl.NumberFormat('vi-VN').format(Number(price))} VND/giờ`
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

  if (filters.keyword) labels.push(`Từ khóa: ${filters.keyword}`)
  if (filters.sportsType) labels.push(`Loại: ${filters.sportsType}`)
  if (filters.address) labels.push(`Khu vực: ${filters.address}`)
  if (filters.minPrice) labels.push(`Giá từ: ${filters.minPrice}`)
  if (filters.maxPrice) labels.push(`Giá đến: ${filters.maxPrice}`)
  if (filters.minRating) labels.push(`Đánh giá: ${filters.minRating}+`)

  return labels
}

const inputClassName = 'search-input-control w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'

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

      const res = await axios.get('/api/fields/search', { params })
      setFields(res.data.content || [])
      setPageInfo({
        number: res.data.number ?? 0,
        totalPages: res.data.totalPages ?? 0,
        totalElements: res.data.totalElements ?? 0,
        size: res.data.size ?? 9,
      })
    } catch (err) {
      console.error('Lỗi khi fetch dữ liệu sân:', err)
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
    <PublicShell>
      <div className="search-page mx-auto max-w-7xl px-1 pb-8 text-slate-900">
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-6 xl:self-start">
            <form onSubmit={handleSearch} className="search-filter-panel rounded-[30px] border border-blue-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_20px_60px_rgba(59,130,246,0.08)]">
              <div className="flex items-start justify-between gap-4 border-b border-blue-50 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Bộ lọc</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">Bộ lọc tìm kiếm</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Tinh chỉnh nhanh khu vực, giá và đánh giá để lọc kết quả sát hơn.</p>
                </div>
                <div className="rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  {filterCount} đang dùng
                </div>
              </div>

              <div className="mt-5 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Từ khóa</label>
                  <input name="keyword" value={filters.keyword} onChange={handleChange} placeholder="Tên sân, mô tả, địa chỉ..." className={inputClassName} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Loại sân</label>
                  <select name="sportsType" value={filters.sportsType} onChange={handleChange} className={inputClassName}>
                    <option value="">Tất cả</option>
                    <option value="Football">Bóng đá</option>
                    <option value="Badminton">Cầu lông</option>
                    <option value="Tennis">Tennis</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Khu vực</label>
                  <input name="address" value={filters.address} onChange={handleChange} placeholder="Thủ Đức, Quận 7..." className={inputClassName} />
                </div>

                <div className="search-soft-panel rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Khoảng giá</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Giá từ</label>
                      <input name="minPrice" type="number" value={filters.minPrice} onChange={handleChange} placeholder="50000" className={inputClassName} />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Giá đến</label>
                      <input name="maxPrice" type="number" value={filters.maxPrice} onChange={handleChange} placeholder="300000" className={inputClassName} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Đánh giá tối thiểu</label>
                  <select name="minRating" value={filters.minRating} onChange={handleChange} className={inputClassName}>
                    <option value="">Không giới hạn</option>
                    <option value="3">Từ 3.0</option>
                    <option value="4">Từ 4.0</option>
                    <option value="4.5">Từ 4.5</option>
                  </select>
                </div>

                <div className="search-soft-panel rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Sắp xếp kết quả</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Sắp xếp theo</label>
                      <select name="sortBy" value={filters.sortBy} onChange={handleChange} className={inputClassName}>
                        <option value="rating">Đánh giá</option>
                        <option value="price">Giá</option>
                        <option value="fieldName">Tên sân</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Thứ tự</label>
                      <select name="sortDir" value={filters.sortDir} onChange={handleChange} className={inputClassName}>
                        <option value="desc">Giảm dần</option>
                        <option value="asc">Tăng dần</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-blue-50 pt-5">
                <button type="submit" className="search-primary-button w-full rounded-2xl bg-[linear-gradient(180deg,#3b82f6_0%,#2563eb_100%)] px-5 py-3.5 font-semibold text-white shadow-[0_18px_30px_rgba(37,99,235,0.18)] transition hover:-translate-y-0.5">
                  Tìm kết quả phù hợp
                </button>
                <button type="button" onClick={handleResetFilters} className="search-ghost-button w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-700">
                  Xóa bộ lọc
                </button>
              </div>
            </form>
          </aside>

          <section className="space-y-6">
            <div className="search-results-shell rounded-[28px] border border-blue-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-5 py-5 shadow-[0_20px_60px_rgba(59,130,246,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Kết quả tìm kiếm</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900 md:text-[30px]">Danh sách sân thể thao</h2>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>{pageInfo.totalElements} cơ sở</span>
                  <Link to="/" className="font-semibold text-blue-700 underline-offset-4 hover:underline">
                    Về trang chủ
                  </Link>
                </div>
              </div>

              {activeFilterLabels.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-blue-50 pt-4">
                  {activeFilterLabels.map((label) => (
                    <span key={label} className="search-chip rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {fields.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
                {fields.map((field, index) => (
                  <article key={field.id} className="search-field-card overflow-hidden rounded-[26px] border border-blue-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] shadow-[0_18px_40px_rgba(59,130,246,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_54px_rgba(59,130,246,0.14)]">
                    <div className="relative h-56 bg-slate-200">
                      <img src={fieldImages[index % fieldImages.length]} alt={field.fieldName} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent" />
                      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                        <span className="search-card-badge rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">{field.sportsType || 'Thể thao'}</span>
                        <span className="search-rating-badge rounded-full bg-blue-600/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">★ {Number(field.rating || 4.5).toFixed(1)}</span>
                      </div>
                      <div className="absolute inset-x-5 bottom-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                          Có thể đặt nhanh
                        </div>
                      </div>
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold leading-tight text-slate-900">{field.fieldName}</h3>
                          <p className="mt-1 text-sm text-slate-500">{field.address}</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">{field.status}</span>
                      </div>

                      <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-600">{field.description || 'Thông tin mô tả đang được cập nhật cho cơ sở này.'}</p>

                      <div className="mb-4 flex flex-wrap gap-2">
                        <span className="search-card-tag rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">{field.sportsType || 'Đa môn'}</span>
                        <span className="search-card-tag rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">Đánh giá cao</span>
                        <span className="search-card-tag rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">Đặt nhanh</span>
                      </div>

                      <div className="flex items-end justify-between gap-4 border-t border-blue-50 pt-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Giá tham khảo</p>
                          <p className="mt-1 text-xl font-bold text-blue-700">{formatPrice(field.price)}</p>
                        </div>
                        <Link to={`/pitch/${field.id}`} className="search-detail-link rounded-2xl border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white">
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="search-empty-state rounded-[28px] border-2 border-dashed border-blue-200 bg-white/90 px-6 py-24 text-center text-slate-500 shadow-sm">
                {loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy sân nào khớp với điều kiện của bạn.'}
              </div>
            )}

            {pageInfo.totalPages > 1 && (
              <div className="search-pagination flex flex-wrap items-center justify-center gap-3 rounded-[28px] border border-blue-100 bg-white px-5 py-4 shadow-sm">
                <button type="button" disabled={pageInfo.number === 0 || loading} onClick={() => fetchFields(pageInfo.number - 1)} className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">
                  Trang trước
                </button>
                <div className="text-sm text-slate-600">Trang {pageInfo.number + 1} / {pageInfo.totalPages}</div>
                <button type="button" disabled={pageInfo.number + 1 >= pageInfo.totalPages || loading} onClick={() => fetchFields(pageInfo.number + 1)} className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">
                  Trang sau
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </PublicShell>
  )
}

export default Search
