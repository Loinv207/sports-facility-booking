import React from 'react'
import { DashboardCard, PreviewCard, SummaryBadge } from './ownerManagementSections'

const softCardClass = 'rounded-3xl border border-slate-200 bg-white p-5'

const OwnerOverview = ({ bookings, revenue, images, schedules, previewField, chartBars, maxRevenue, formatCurrency }) => (
  <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
    <div className="space-y-6">
      <DashboardCard title="Tổng quan hoạt động" description="Nhìn nhanh tình trạng đơn đặt, doanh thu và dữ liệu sân đang quản lý.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryBadge label="Đơn đặt sân" value={`${bookings.length} đơn`} />
          <SummaryBadge label="Doanh thu" value={formatCurrency(revenue?.totalRevenue || 0)} />
          <SummaryBadge label="Ảnh sân" value={`${images.length} ảnh`} />
          <SummaryBadge label="Khung giờ" value={`${schedules.length} slot`} />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className={softCardClass}>
            <p className="text-sm font-semibold text-slate-900">Tiến độ xử lý đơn</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between"><span>Đang chờ</span><span>{bookings.filter((item) => item.status === 'PENDING').length}</span></div>
              <div className="flex items-center justify-between"><span>Đã xác nhận</span><span>{bookings.filter((item) => item.status === 'CONFIRMED').length}</span></div>
              <div className="flex items-center justify-between"><span>Hoàn tất</span><span>{bookings.filter((item) => item.status === 'COMPLETED').length}</span></div>
            </div>
          </div>
          <div className={softCardClass}>
            <p className="text-sm font-semibold text-slate-900">Gợi ý thao tác</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>1. Tạo hoặc chọn sân ở tab Quản lý sân.</li>
              <li>2. Thêm thư viện ảnh và lịch hoạt động.</li>
              <li>3. Xác nhận đơn đặt rồi check-in khách tại sân.</li>
            </ul>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="Xem trước sân" description="Thẻ xem trước giúp kiểm tra nhanh thông tin đang chọn trước khi lưu.">
        <PreviewCard field={previewField} />
      </DashboardCard>
    </div>

    <div className="space-y-6">
      <DashboardCard title="Biểu đồ doanh thu nhanh" description="Bản rút gọn để xem xu hướng thu tiền mà không cần chuyển tab.">
        <div className="space-y-4">
          {chartBars.slice(0, 4).map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                <span>{item.label}</span>
                <span>{formatCurrency(item.totalRevenue)}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${Math.max((Number(item.totalRevenue || 0) / maxRevenue) * 100, 8)}%` }} />
              </div>
            </div>
          ))}
          {!chartBars.length && <p className="text-sm text-slate-500">Chưa có dữ liệu doanh thu để hiển thị.</p>}
        </div>
      </DashboardCard>
    </div>
  </div>
)

export default OwnerOverview
