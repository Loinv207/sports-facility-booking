import React from 'react'

export const DashboardCard = ({ title, description, children, action, className = '' }) => (
  <section className={`rounded-[28px] border border-blue-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] shadow-[0_20px_60px_rgba(59,130,246,0.08)] ${className}`}>
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-blue-50 px-6 py-5">
      <div>
        <h2 className="text-[22px] font-bold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {action}
    </div>
    <div className="px-6 py-6">{children}</div>
  </section>
)

export const SummaryBadge = ({ label, value }) => (
  <div className="rounded-3xl border border-blue-100 bg-white px-4 py-4 shadow-sm">
    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
    <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
  </div>
)

const inputClass = 'h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
const textAreaClass = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'

export const TextInput = ({ label, ...props }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
    <input {...props} className={inputClass} />
  </div>
)

export const TextArea = ({ label, ...props }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
    <textarea {...props} className={textAreaClass} />
  </div>
)

export const ActionButton = ({ children, tone = 'default', className = '', ...props }) => {
  const tones = {
    default: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
    blue: 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_18px_30px_rgba(37,99,235,0.18)]',
    emerald: 'bg-emerald-500 text-white hover:bg-emerald-400',
    violet: 'bg-violet-500 text-white hover:bg-violet-400',
    rose: 'bg-rose-500 text-white hover:bg-rose-400',
    ghost: 'border border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-700',
  }

  return (
    <button
      {...props}
      className={`rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  )
}

const statusTone = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  HIDDEN: 'bg-slate-100 text-slate-700 border-slate-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export const PreviewCard = ({ field, badge = 'Sẵn sàng gửi duyệt', badgeTone = 'emerald' }) => {
  const badgeClass = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-blue-100 bg-white shadow-sm">
      <div className="relative flex h-[210px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.22),transparent_45%),linear-gradient(180deg,#f8fbff_0%,#dbeafe_100%)]">
        {field.coverImageUrl ? (
          <img src={field.coverImageUrl} alt={field.fieldName} className="h-full w-full object-cover" />
        ) : null}
        <div className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${badgeClass[badgeTone]}`}>
          {badge}
        </div>
      </div>
      <div className="space-y-3 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-700">{String(field.sportsType).toUpperCase()}</span>
          <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${statusTone[field.status] || statusTone.PENDING}`}>{field.status}</span>
        </div>
        <h3 className="text-[30px] font-bold leading-tight text-slate-900">{field.fieldName}</h3>
        <p className="text-[20px] font-semibold text-blue-700">{field.priceLabel}</p>
        <p className="text-sm leading-6 text-slate-500">{field.address}</p>
        <p className="text-sm leading-6 text-slate-600">{field.description}</p>
      </div>
    </div>
  )
}
