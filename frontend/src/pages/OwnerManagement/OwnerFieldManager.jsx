import React from 'react'
import { ActionButton, DashboardCard, PreviewCard, TextArea, TextInput } from './ownerManagementSections'

const softCardClass = 'rounded-3xl border border-slate-200 bg-white p-5'

const OwnerFieldManager = ({
  fields,
  field,
  updateForm,
  setUpdateForm,
  imageLinks,
  setImageLinks,
  images,
  schedules,
  scheduleForm,
  setScheduleForm,
  previewField,
  selectField,
  updateField,
  hideField,
  saveImages,
  deleteImage,
  createSchedules,
  selectedFieldId,
}) => {
  const handleUpdateChange = ({ target }) => {
    const { name, value } = target
    setUpdateForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleScheduleChange = ({ target }) => {
    const { name, value } = target
    setScheduleForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <DashboardCard title="Danh sách sân hiện có" description="Chọn nhanh sân cần chỉnh sửa hoặc dùng cho thư viện ảnh và lịch hoạt động.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {fields.map((item) => (
            <button key={item.id} type="button" onClick={() => selectField(item)} className={`rounded-2xl border px-4 py-4 text-left transition ${field?.id === item.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-200'}`}>
              <p className="font-semibold text-slate-900">{item.fieldName}</p>
              <p className="mt-1 text-xs text-slate-500">{item.id}</p>
              <p className="mt-2 text-xs text-slate-600">{item.status}</p>
            </button>
          ))}
        </div>
      </DashboardCard>

      <div className="grid items-start gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <DashboardCard title="Cập nhật thông tin sân" description="Chỉnh sửa nhanh sân đang chọn và ẩn sân khi cần.">
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput label="Tên sân" name="fieldName" value={updateForm.fieldName} onChange={handleUpdateChange} placeholder="VD: Sân bóng đá mini A1" />
              <TextInput label="Loại sân" name="sportsType" value={updateForm.sportsType} onChange={handleUpdateChange} placeholder="Sân bóng đá 7 người" />
              <TextInput label="Địa chỉ" name="address" value={updateForm.address} onChange={handleUpdateChange} placeholder="Số 123, Quận 7" />
              <TextInput label="Giá thuê" name="price" value={updateForm.price} onChange={handleUpdateChange} placeholder="350000" />
              <TextInput label="Trạng thái" name="status" value={updateForm.status} onChange={handleUpdateChange} placeholder="ACTIVE / PENDING / HIDDEN" />
            </div>
            <div className="mt-5">
              <TextArea label="Mô tả sân" name="description" value={updateForm.description} onChange={handleUpdateChange} rows="4" placeholder="Mô tả tiện ích, mặt sân, bãi xe..." />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <ActionButton tone="violet" type="button" onClick={updateField} disabled={!selectedFieldId}>Cập nhật sân</ActionButton>
              <ActionButton tone="ghost" type="button" onClick={hideField} disabled={!selectedFieldId}>Ẩn sân</ActionButton>
            </div>
          </DashboardCard>

          <DashboardCard title="Thư viện ảnh sân" description="Lưu nhiều link ảnh để dùng cho trang chi tiết sân sau này.">
            <div className="space-y-4">
              {imageLinks.map((link, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    value={link}
                    onChange={(event) => {
                      const nextLinks = [...imageLinks]
                      nextLinks[index] = event.target.value
                      setImageLinks(nextLinks)
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                  <ActionButton type="button" tone="ghost" onClick={() => setImageLinks((prev) => prev.length === 1 ? prev : prev.filter((_, idx) => idx !== index))}>Xóa</ActionButton>
                </div>
              ))}
              <div className="flex flex-wrap gap-3">
                <ActionButton type="button" tone="ghost" onClick={() => setImageLinks((prev) => [...prev, ''])}>+ Thêm link ảnh</ActionButton>
                <ActionButton type="button" tone="blue" onClick={saveImages}>Lưu thư viện ảnh</ActionButton>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {images.map((image) => (
                  <div key={image.id} className={softCardClass}>
                    <p className="truncate text-sm text-slate-600">{image.imageUrl}</p>
                    <button type="button" onClick={() => deleteImage(image.id)} className="mt-3 text-sm font-semibold text-rose-500">Xóa ảnh</button>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Xem trước sân đang chọn" description="Giúp kiểm tra nhanh thông tin sân hiện tại trước khi cập nhật.">
            <PreviewCard field={previewField} badge="Sân đang chọn" badgeTone="blue" />
          </DashboardCard>

          <DashboardCard title="Quản lý lịch hoạt động" description="Tạo hàng loạt khung giờ theo ngày, giờ bắt đầu, giờ kết thúc và giá cho từng khung giờ.">
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput label="Ngày áp dụng" type="date" name="scheduleDate" value={scheduleForm.scheduleDate} onChange={handleScheduleChange} />
              <TextInput label="Giá cho mỗi khung giờ" name="price" value={scheduleForm.price} onChange={handleScheduleChange} placeholder="250000" />
              <TextInput label="Bắt đầu" type="time" name="startTime" value={scheduleForm.startTime} onChange={handleScheduleChange} />
              <TextInput label="Kết thúc" type="time" name="endTime" value={scheduleForm.endTime} onChange={handleScheduleChange} />
              <TextInput label="Thời lượng mỗi khung giờ (phút)" name="slotMinutes" value={scheduleForm.slotMinutes} onChange={handleScheduleChange} />
            </div>
            <ActionButton type="button" tone="emerald" className="mt-5" onClick={createSchedules}>Tạo lịch hàng loạt</ActionButton>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-5 bg-slate-50 px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                <span>Ngày</span>
                <span>Bắt đầu</span>
                <span>Kết thúc</span>
                <span>Giá</span>
                <span>Trạng thái</span>
              </div>
              {schedules.map((item) => (
                <div key={item.id} className="grid grid-cols-5 border-t border-slate-200 px-4 py-3 text-sm text-slate-700">
                  <span>{item.scheduleDate}</span>
                  <span>{item.startTime}</span>
                  <span>{item.endTime}</span>
                  <span>{Number(item.price).toLocaleString('vi-VN')}đ</span>
                  <span>{item.status}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}

export default OwnerFieldManager
