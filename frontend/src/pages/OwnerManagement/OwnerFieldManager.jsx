import React, { useEffect, useMemo } from 'react'
import { ImagePlus, Trash2, UploadCloud } from 'lucide-react'
import { ActionButton, DashboardCard, PreviewCard, TextArea, TextInput } from './ownerManagementSections'

const softCardClass = 'rounded-3xl border border-slate-200 bg-white p-5'

const formatFileSize = (size) => {
  if (!size) return '0 KB'
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

const OwnerFieldManager = ({
  fields,
  field,
  updateForm,
  setUpdateForm,
  imageLinks,
  setImageLinks,
  libraryImageFiles = [],
  addLibraryImageFiles,
  removeLibraryImageFile,
  images,
  schedules,
  scheduleForm,
  setScheduleForm,
  previewField,
  selectField,
  updateField,
  hideField,
  isSavingImages = false,
  saveImages,
  deleteImage,
  createSchedules,
  selectedFieldId,
  canCreateSchedules,
}) => {
  const handleUpdateChange = ({ target }) => {
    const { name, value } = target
    setUpdateForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleScheduleChange = ({ target }) => {
    const { name, value } = target
    setScheduleForm((prev) => ({ ...prev, [name]: value }))
  }

  const imagePreviews = useMemo(() => libraryImageFiles.map((file, index) => ({
    id: `${file.name}-${file.lastModified}-${index}`,
    name: file.name,
    size: formatFileSize(file.size),
    url: URL.createObjectURL(file),
  })), [libraryImageFiles])

  useEffect(() => {
    return () => {
      imagePreviews.forEach((image) => URL.revokeObjectURL(image.url))
    }
  }, [imagePreviews])

  const handleLibraryImageChange = ({ target }) => {
    if (target.files?.length) {
      addLibraryImageFiles(target.files)
    }
    target.value = ''
  }

  const saveImageLabel = isSavingImages ? 'Đang upload ảnh...' : 'Lưu thư viện ảnh'

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
              <div className="rounded-[24px] border border-dashed border-blue-200 bg-blue-50/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                      <ImagePlus size={21} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Ảnh sân</p>
                      <p className="text-xs text-slate-500">Tối đa 8 ảnh, mỗi ảnh tối đa 8MB.</p>
                    </div>
                  </div>
                  <label className={`inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(37,99,235,0.18)] transition hover:bg-blue-500 ${!selectedFieldId || isSavingImages ? 'pointer-events-none opacity-60' : ''}`}>
                    <UploadCloud size={17} />
                    Chọn ảnh
                    <input type="file" multiple accept="image/*" className="sr-only" onChange={handleLibraryImageChange} disabled={!selectedFieldId || isSavingImages} />
                  </label>
                </div>

                {imagePreviews.length > 0 ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {imagePreviews.map((image, index) => (
                      <div key={image.id} className="group overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                        <div className="relative h-32">
                          <img src={image.url} alt={image.name} className="h-full w-full object-cover" />
                          <button type="button" onClick={() => removeLibraryImageFile(index)} className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-rose-500 shadow-sm transition hover:bg-rose-50" aria-label="Xóa ảnh">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="px-3 py-3">
                          <p className="truncate text-sm font-semibold text-slate-800">{image.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{image.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3">
                <ActionButton type="button" tone="ghost" onClick={() => setImageLinks((prev) => [...prev, ''])}>+ Thêm link ảnh</ActionButton>
                <ActionButton type="button" tone="blue" onClick={saveImages} disabled={isSavingImages}>{saveImageLabel}</ActionButton>
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
            {!canCreateSchedules ? (
              <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-800">
                Sân cần được admin duyệt và chuyển sang trạng thái ACTIVE trước khi chủ sân có thể tạo lịch hoạt động.
              </div>
            ) : null}
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput label="Ngày áp dụng" type="date" name="scheduleDate" value={scheduleForm.scheduleDate} onChange={handleScheduleChange} disabled={!canCreateSchedules} />
              <TextInput label="Giá cho mỗi khung giờ" name="price" value={scheduleForm.price} onChange={handleScheduleChange} placeholder="250000" disabled={!canCreateSchedules} />
              <TextInput label="Bắt đầu" type="time" name="startTime" value={scheduleForm.startTime} onChange={handleScheduleChange} disabled={!canCreateSchedules} />
              <TextInput label="Kết thúc" type="time" name="endTime" value={scheduleForm.endTime} onChange={handleScheduleChange} disabled={!canCreateSchedules} />
              <TextInput label="Thời lượng mỗi khung giờ (phút)" name="slotMinutes" value={scheduleForm.slotMinutes} onChange={handleScheduleChange} disabled={!canCreateSchedules} />
            </div>
            <ActionButton type="button" tone="emerald" className="mt-5" onClick={createSchedules} disabled={!canCreateSchedules}>Tạo lịch hàng loạt</ActionButton>
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
