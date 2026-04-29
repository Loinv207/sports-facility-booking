import React, { useMemo, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { ActionButton, DashboardCard, SummaryBadge } from './ownerManagementSections'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend)

const parseLabelToDate = (label) => {
  const [day, month] = String(label || '').split('/').map(Number)
  if (!day || !month) return null
  return new Date(2026, month - 1, day)
}

const formatWeekLabel = (date) => {
  const start = new Date(date)
  start.setDate(date.getDate() - ((date.getDay() + 6) % 7))
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return `Tuần ${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`
}

const formatMonthLabel = (date) => `Tháng ${date.getMonth() + 1}`

const groupChartData = (chartBars, mode) => {
  const grouped = new Map()

  chartBars.forEach((item) => {
    const date = parseLabelToDate(item.label)
    const key = date
      ? (mode === 'week' ? formatWeekLabel(date) : formatMonthLabel(date))
      : item.label

    const current = grouped.get(key) || { label: key, depositOnline: 0, extraCash: 0, totalRevenue: 0 }
    current.depositOnline += Number(item.depositOnline || 0)
    current.extraCash += Number(item.extraCash || 0)
    current.totalRevenue += Number(item.totalRevenue || 0)
    grouped.set(key, current)
  })

  return Array.from(grouped.values())
}

const OwnerRevenue = ({ revenue, chartBars, formatCurrency }) => {
  const [chartMode, setChartMode] = useState('week')

  const aggregatedBars = useMemo(() => groupChartData(chartBars, chartMode), [chartBars, chartMode])

  const chartData = useMemo(() => ({
    labels: aggregatedBars.map((item) => item.label),
    datasets: [
      {
        type: 'bar',
        label: 'Đặt cọc online',
        data: aggregatedBars.map((item) => item.depositOnline),
        backgroundColor: 'rgba(59, 130, 246, 0.75)',
        borderRadius: 14,
      },
      {
        type: 'bar',
        label: 'Tiền mặt tại sân',
        data: aggregatedBars.map((item) => item.extraCash),
        backgroundColor: 'rgba(16, 185, 129, 0.75)',
        borderRadius: 14,
      },
      {
        type: 'line',
        label: 'Tổng doanh thu',
        data: aggregatedBars.map((item) => item.totalRevenue),
        borderColor: '#0f172a',
        backgroundColor: '#0f172a',
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 5,
      },
    ],
  }), [aggregatedBars])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => formatCurrency(value),
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      <DashboardCard title="Tổng hợp doanh thu" description="Theo dõi tiền cọc online, tiền mặt tại sân và số đơn đã hoàn tất.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryBadge label="Đặt cọc online" value={formatCurrency(revenue?.totalDepositOnline || 0)} />
          <SummaryBadge label="Tiền mặt tại sân" value={formatCurrency(revenue?.totalExtraCash || 0)} />
          <SummaryBadge label="Tổng doanh thu" value={formatCurrency(revenue?.totalRevenue || 0)} />
          <SummaryBadge label="Hoàn tất / xác nhận" value={`${revenue?.completedBookings || 0} / ${revenue?.confirmedBookings || 0}`} />
        </div>
      </DashboardCard>

      <DashboardCard
        title="Biểu đồ doanh thu"
        description="Xem doanh thu theo tuần hoặc theo tháng cho chủ sân."
        action={(
          <div className="flex gap-2">
            <ActionButton type="button" tone={chartMode === 'week' ? 'blue' : 'ghost'} onClick={() => setChartMode('week')}>Theo tuần</ActionButton>
            <ActionButton type="button" tone={chartMode === 'month' ? 'blue' : 'ghost'} onClick={() => setChartMode('month')}>Theo tháng</ActionButton>
          </div>
        )}
      >
        {aggregatedBars.length ? (
          <div className="space-y-5">
            <div className="h-[360px] rounded-[28px] border border-slate-200 bg-white p-4">
              <Bar data={chartData} options={chartOptions} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {aggregatedBars.map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-2 text-xs text-slate-500">Cọc online: {formatCurrency(item.depositOnline)}</p>
                  <p className="text-xs text-slate-500">Tiền mặt: {formatCurrency(item.extraCash)}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">Tổng: {formatCurrency(item.totalRevenue)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : <div className="rounded-3xl border border-dashed border-blue-200 bg-white p-8 text-center text-slate-500">Chưa có dữ liệu biểu đồ. Chạy luồng đặt sân rồi tải lại là có.</div>}
      </DashboardCard>
    </div>
  )
}

export default OwnerRevenue
