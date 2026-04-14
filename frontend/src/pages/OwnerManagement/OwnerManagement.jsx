import React, { useMemo, useState } from 'react'

const initialForm = {
  fieldName: '',
  sportsType: '',
  address: '',
  price: '',
  description: '',
}

const navItems = ['Trang chủ', 'Sân thể thao', 'Cơ sở', 'Đặt sân của tôi', 'Liên hệ']

const formatPrice = (value) => {
  if (!value) return '0 VND/giờ'
  const digits = String(value).replace(/\D/g, '')
  if (!digits) return `${value} VND/giờ`
  return `${Number(digits).toLocaleString('vi-VN')} VND/giờ`
}

const StatPill = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
    <div className="mt-1 text-sm font-semibold text-white">{value}</div>
  </div>
)

export const OwnerManagement = () => {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [createdField, setCreatedField] = useState(null)

  const canSubmit = useMemo(() => {
    return form.fieldName.trim() && form.sportsType.trim() && form.address.trim()
  }, [form])

  const preview = createdField || {
    fieldName: form.fieldName || 'Sân bóng đá mini A1',
    sportsType: form.sportsType || 'Sân bóng đá',
    address: form.address || '123 Nguyễn Văn A, Quận 7, TP.HCM',
    price: form.price || '300000',
    description: form.description || 'Sân cỏ nhân tạo chất lượng cao, có đèn chiếu sáng, khu gửi xe và khu nghỉ cho cầu thủ.',
    status: 'PENDING',
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:8080/api/fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Tạo sân thất bại')
      }

      setCreatedField(data)
      setMessage('Tạo sân thành công')
      setForm(initialForm)
    } catch (error) {
      setMessage(error.message || 'Có lỗi xảy ra khi tạo sân.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#0f1723] text-slate-100">
      <header className="border-b border-white/5 bg-[#111827]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-4 xl:px-10">
          <div className="flex items-center gap-12">
            <div>
              <div className="text-[11px] uppercase tracking-[0.35em] text-sky-400">Sports booking</div>
              <div className="mt-1 text-lg font-bold text-white">SPORTS NOW</div>
            </div>

            <nav className="hidden items-center gap-8 text-[13px] text-slate-300 lg:flex">
              {navItems.map((item, index) => (
                <a
                  key={item}
                  href="#"
                  className={`transition hover:text-white ${index === 2 ? 'text-white' : ''}`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-right">
              <div className="text-slate-400">Chủ sân</div>
              <div className="mt-1 font-semibold text-white">Nguyễn Văn A</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/20 to-cyan-400/10 text-sm font-bold text-white shadow-[0_10px_30px_rgba(14,165,233,0.15)]">
              NA
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-6 py-8 pb-14 xl:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[13px] text-slate-500">
              Trang chủ / Quản lý sân / <span className="text-slate-200">Thêm sân mới</span>
            </div>
            <h1 className="mt-4 text-[38px] font-bold leading-tight text-white">Thêm sân mới</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-300">
              Hoàn thiện đầy đủ thông tin sân để gửi yêu cầu xét duyệt. Giao diện này mô phỏng gần sát màn hình quản lý của chủ sân.
            </p>
          </div>

          <div className="grid min-w-[280px] gap-3 sm:grid-cols-3">
            <StatPill label="Trạng thái mặc định" value="PENDING" />
            <StatPill label="Thời gian duyệt" value="Trong 24h" />
            <StatPill label="Hiển thị công khai" value="Sau khi duyệt" />
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#172131] shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
            <div className="py-6 border-b border-white/10 px-7">
              <h2 className="text-[26px] font-bold text-white">Thông tin chi tiết sân</h2>
              <p className="mt-2 text-[14px] text-slate-400">Điền chính xác để đội ngũ quản trị xét duyệt nhanh hơn.</p>
            </div>

            <form className="space-y-6 px-7 py-7" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[13px] font-medium text-slate-300">Tên sân</label>
                  <input
                    name="fieldName"
                    value={form.fieldName}
                    onChange={handleChange}
                    placeholder="VD: Sân bóng đá mini A1"
                    className="h-13 w-full rounded-2xl border border-white/10 bg-[#0d1522] px-4 text-[14px] text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-medium text-slate-300">Loại sân</label>
                  <input
                    name="sportsType"
                    value={form.sportsType}
                    onChange={handleChange}
                    placeholder="Sân bóng đá (5 người)"
                    className="h-13 w-full rounded-2xl border border-white/10 bg-[#0d1522] px-4 text-[14px] text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-medium text-slate-300">Địa chỉ</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Số 123, Đường ABC, Quận X, TP.HCM"
                  className="h-13 w-full rounded-2xl border border-white/10 bg-[#0d1522] px-4 text-[14px] text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-[1.05fr_0.95fr]">
                <div>
                  <label className="mb-2 block text-[13px] font-medium text-slate-300">Giá thuê (VND/giờ)</label>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="300000"
                    className="h-13 w-full rounded-2xl border border-white/10 bg-[#0d1522] px-4 text-[14px] text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
                  />
                </div>

                <div className="px-4 py-3 border rounded-2xl border-sky-500/20 bg-sky-500/5">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-sky-300">Xem nhanh giá</div>
                  <div className="mt-2 text-2xl font-bold text-white">{formatPrice(form.price || preview.price)}</div>
                  <div className="mt-1 text-[13px] text-slate-400">Giá hiển thị cho khách khi sân được duyệt.</div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-medium text-slate-300">Mô tả sân</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="7"
                  placeholder="Mô tả về cơ sở vật chất, đèn chiếu sáng, bãi đỗ xe, phòng thay đồ, dịch vụ đi kèm..."
                  className="w-full rounded-2xl border border-white/10 bg-[#0d1522] px-4 py-3 text-[14px] leading-6 text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="min-w-[138px] rounded-2xl bg-white px-6 py-3 text-[15px] font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-500"
                >
                  {submitting ? 'Đang lưu...' : 'Lưu sân'}
                </button>
                <button
                  type="button"
                  className="min-w-[130px] rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-[15px] font-semibold text-slate-100 transition hover:bg-white/[0.08]"
                >
                  Xem trước
                </button>
                <button
                  type="button"
                  className="min-w-[90px] rounded-2xl px-4 py-3 text-[15px] font-semibold text-slate-400 transition hover:text-white"
                >
                  Hủy
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#172131] shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
              <div className="px-6 py-5 border-b border-white/10">
                <h2 className="text-[24px] font-bold text-white">Xem trước nhanh</h2>
                <p className="mt-1 text-[13px] text-slate-400">Mô phỏng thẻ sân khi đã tạo thành công.</p>
              </div>

              <div className="p-6">
                <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#0f1724]">
                  <div className="relative flex h-[230px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_45%),linear-gradient(180deg,#1b2840_0%,#111827_100%)]">
                    <div className="absolute inset-0 opacity-40">
                      <div className="absolute top-0 w-px h-full -translate-x-1/2 left-1/2 bg-white/10" />
                      <div className="absolute left-[18%] top-[22%] h-[56%] w-[64%] rounded-[32px] border border-white/10" />
                      <div className="absolute left-[25%] top-[30%] h-[40%] w-[50%] rounded-[28px] border border-white/10" />
                    </div>
                    <div className="relative z-10 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                      Sẵn sàng gửi duyệt
                    </div>
                  </div>

                  <div className="px-5 py-5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-300">
                        {String(preview.sportsType).toUpperCase()}
                      </div>
                      <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold text-amber-300">
                        {preview.status}
                      </div>
                    </div>

                    <h3 className="text-[30px] font-bold leading-tight text-white">{preview.fieldName}</h3>
                    <div className="text-[20px] font-semibold text-white">{formatPrice(preview.price)}</div>
                    <p className="text-[13px] leading-6 text-slate-400">{preview.address}</p>
                    <p className="line-clamp-3 text-[14px] leading-6 text-slate-300">{preview.description}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[#172131] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
              <h3 className="text-[22px] font-bold text-white">Lưu ý quan trọng</h3>
              <ul className="mt-4 space-y-4 text-[14px] leading-6 text-slate-300">
                <li className="flex gap-3"><span className="w-2 h-2 mt-2 rounded-full bg-sky-400" />Sân mới tạo sẽ ở trạng thái chờ duyệt và chưa hiển thị công khai ngay.</li>
                <li className="flex gap-3"><span className="w-2 h-2 mt-2 rounded-full bg-sky-400" />Quản trị viên sẽ rà soát thông tin trong khoảng 24 giờ.</li>
                <li className="flex gap-3"><span className="w-2 h-2 mt-2 rounded-full bg-sky-400" />Sau khi được duyệt, khách hàng mới có thể thấy sân và tiến hành đặt lịch.</li>
              </ul>
            </section>
          </aside>
        </div>

        {message && (
          <section className="mt-8 rounded-[28px] border border-emerald-400/20 bg-emerald-500/10 px-6 py-10 text-center shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 text-2xl border rounded-full border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
              ✓
            </div>
            <h2 className="text-[34px] font-bold text-white">Tạo sân thành công</h2>
            <p className="mt-3 text-[15px] text-slate-200">Sân của m đã được lưu vào hệ thống và chờ phê duyệt.</p>
            <div className="mt-4 text-[16px] text-slate-100">
              Trạng thái hiện tại: <span className="font-bold text-white">Chờ duyệt (PENDING)</span>
            </div>
            <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-6 text-slate-300">
              Quản trị viên sẽ xem xét và phê duyệt trước khi sân được hiển thị công khai trên hệ thống đặt sân.
            </p>
          </section>
        )}
      </main>
    </div>
  )
}

export default OwnerManagement
