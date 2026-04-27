import React from 'react'
import { ActionButton, DashboardCard, PreviewCard, TextArea, TextInput } from './ownerManagementSections'

const OwnerCreateField = ({ fieldForm, setFieldForm, previewField, canCreateField, isSavingField, createField, formatPrice }) => {
  const handleFieldChange = ({ target }) => {
    const { name, value } = target
    setFieldForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <DashboardCard title="Tạo sân mới" description="Tạo riêng một sân mới với đầy đủ tên sân, loại sân, địa chỉ, giá thuê và mô tả.">
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
              <p className="mt-1 text-sm text-slate-500">Sẽ hiển thị sau khi sân được duyệt.</p>
            </div>
          </div>
          <TextArea label="Mô tả sân" name="description" value={fieldForm.description} onChange={handleFieldChange} rows="5" placeholder="Mô tả cơ sở vật chất, chỗ gửi xe, đèn chiếu sáng..." />
          <ActionButton tone="blue" type="submit" disabled={!canCreateField || isSavingField}>{isSavingField ? 'Đang lưu...' : 'Lưu sân mới'}</ActionButton>
        </form>
      </DashboardCard>

      <DashboardCard title="Xem trước trước khi tạo" description="Kiểm tra nhanh thông tin sân mới trước khi gửi lên hệ thống.">
        <PreviewCard field={previewField} badge="Sân mới chờ duyệt" badgeTone="amber" />
      </DashboardCard>
    </div>
  )
}

export default OwnerCreateField
