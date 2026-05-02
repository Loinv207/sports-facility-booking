import React, { useEffect, useMemo } from 'react'
import { ImagePlus, Trash2, UploadCloud } from 'lucide-react'
import { ActionButton, DashboardCard, PreviewCard, TextArea, TextInput } from './ownerManagementSections'

const formatFileSize = (size) => {
  if (!size) return '0 KB'
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

const OwnerCreateField = ({
  fieldForm,
  setFieldForm,
  previewField,
  canCreateField,
  isSavingField,
  isUploadingFieldImages = false,
  fieldImageFiles = [],
  addFieldImageFiles,
  removeFieldImageFile,
  createField,
  formatPrice,
}) => {
  const handleFieldChange = ({ target }) => {
    const { name, value } = target
    setFieldForm((prev) => ({ ...prev, [name]: value }))
  }

  const imagePreviews = useMemo(() => fieldImageFiles.map((file, index) => ({
    id: `${file.name}-${file.lastModified}-${index}`,
    name: file.name,
    size: formatFileSize(file.size),
    url: URL.createObjectURL(file),
  })), [fieldImageFiles])

  useEffect(() => {
    return () => {
      imagePreviews.forEach((image) => URL.revokeObjectURL(image.url))
    }
  }, [imagePreviews])

  const handleImageChange = ({ target }) => {
    if (target.files?.length) {
      addFieldImageFiles(target.files)
    }
    target.value = ''
  }

  const submitLabel = isUploadingFieldImages ? 'Đang upload ảnh...' : isSavingField ? 'Đang lưu...' : 'Lưu sân mới'

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <DashboardCard title="Tạo sân mới" description="Tạo riêng một sân mới với đầy đủ tên sân, loại sân, địa chỉ, giá thuê, mô tả và hình ảnh.">
        <form className="space-y-5" onSubmit={async (event) => {
          event.preventDefault()
          await createField()
        }}>
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput label="Tên sân" name="fieldName" value={fieldForm.fieldName} onChange={handleFieldChange} placeholder="VD: Sân bóng đá mini A1" />
            <TextInput label="Loại sân" name="sportsType" value={fieldForm.sportsType} onChange={handleFieldChange} placeholder="Sân bóng đá 5 người" />
          </div>
          <TextInput label="Địa chỉ" name="address" value={fieldForm.address} onChange={handleFieldChange} placeholder="Số 123, Quận 7, TP.HCM" />
          <div className="grid gap-5 md:grid-cols-[1fr_0.9fr]">
            <TextInput label="Giá thuê (VND/giờ)" name="price" value={fieldForm.price} onChange={handleFieldChange} placeholder="300000" />
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-blue-700">Giá hiển thị</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatPrice(fieldForm.price || previewField.price)}</p>
              <p className="mt-1 text-sm text-slate-500">Hiển thị sau khi sân được duyệt.</p>
            </div>
          </div>
          <TextArea label="Mô tả sân" name="description" value={fieldForm.description} onChange={handleFieldChange} rows="5" placeholder="Mô tả cơ sở vật chất, chỗ gửi xe, đèn chiếu sáng..." />

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
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(37,99,235,0.18)] transition hover:bg-blue-500">
                <UploadCloud size={17} />
                Chọn ảnh
                <input type="file" multiple accept="image/*" className="sr-only" onChange={handleImageChange} />
              </label>
            </div>

            {imagePreviews.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {imagePreviews.map((image, index) => (
                  <div key={image.id} className="group overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                    <div className="relative h-36">
                      <img src={image.url} alt={image.name} className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeFieldImageFile(index)} className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-rose-500 shadow-sm transition hover:bg-rose-50" aria-label="Xóa ảnh">
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

          <ActionButton tone="blue" type="submit" disabled={!canCreateField || isSavingField || isUploadingFieldImages}>{submitLabel}</ActionButton>
        </form>
      </DashboardCard>

      <DashboardCard title="Xem trước trước khi tạo" description="Kiểm tra nhanh thông tin sân mới trước khi gửi lên hệ thống.">
        <PreviewCard field={{ ...previewField, coverImageUrl: imagePreviews[0]?.url }} badge="Sân mới chờ duyệt" badgeTone="amber" />
      </DashboardCard>
    </div>
  )
}

export default OwnerCreateField
