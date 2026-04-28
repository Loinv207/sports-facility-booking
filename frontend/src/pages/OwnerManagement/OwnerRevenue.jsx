import React from 'react'
import { DashboardCard, SummaryBadge } from './ownerManagementSections'

const OwnerRevenue = ({ revenue, chartBars, maxRevenue, formatCurrency }) => (
  <div className="space-y-6">
    <DashboardCard title="Tổng hợp doanh thu" description="Theo dõi tiền cọc online, tiền mặt tại sân và số đơn đã hoàn tất.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryBadge label="Đặt cọc online" value={formatCurrency(revenue?.totalDepositOnline || 0)} />
        <SummaryBadge label="Tiền mặt tại sân" value={formatCurrency(revenue?.totalExtraCash || 0)} />
        <SummaryBadge label="Tổng doanh thu" value={formatCurrency(revenue?.totalRevenue || 0)} />
        <SummaryBadge label="Hoàn tất / xác nhận" value={`${revenue?.completedBookings || 0} / ${revenue?.confirmedBookings || 0}`} />
      </div>
    </DashboardCard>

    <DashboardCard title="Biểu đồ doanh thu" description="So sánh doanh thu theo từng mốc dữ liệu trả về từ backend.">
      <div className="grid min-h-[260px] grid-cols-1 gap-4 md:grid-cols-4">
        {chartBars.length ? chartBars.map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="flex h-40 items-end gap-3">
              <div className="w-1/2 rounded-t-2xl bg-blue-500/80" style={{ height: `${Math.max((Number(item.depositOnline || 0) / maxRevenue) * 100, 8)}%` }} />
              <div className="w-1/2 rounded-t-2xl bg-emerald-400/80" style={{ height: `${Math.max((Number(item.extraCash || 0) / maxRevenue) * 100, 8)}%` }} />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-900">{item.label}</p>
            <p className="mt-2 text-xs text-slate-500">Cọc: {formatCurrency(item.depositOnline)}</p>
            <p className="text-xs text-slate-500">Tiền mặt: {formatCurrency(item.extraCash)}</p>
            <p className="text-xs text-slate-700">Tổng: {formatCurrency(item.totalRevenue)}</p>
          </div>
        )) : <div className="md:col-span-4 rounded-3xl border border-dashed border-blue-200 bg-white p-8 text-center text-slate-500">Chưa có dữ liệu biểu đồ. Chạy luồng đặt sân rồi tải lại là có.</div>}
      </div>
    </DashboardCard>
  </div>
)

export default OwnerRevenue
