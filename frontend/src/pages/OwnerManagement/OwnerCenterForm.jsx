import React from 'react'
import { ActionButton, DashboardCard, TextArea, TextInput } from './ownerManagementSections'

const OwnerCenterForm = ({ centerForm, setCenterForm, saveCenter }) => {
  const handleCenterChange = ({ target }) => {
    const { name, value } = target
    setCenterForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <DashboardCard title="Thông tin trung tâm thể thao" description="Cập nhật bảng SportsCenter để đồng bộ thông tin cơ sở.">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput label="Mã trung tâm" name="id" value={centerForm.id} onChange={handleCenterChange} placeholder="center-q7" />
          <TextInput label="Tên trung tâm" name="name" value={centerForm.name} onChange={handleCenterChange} placeholder="Trung tâm thể thao Quận 7" />
          <TextInput label="Địa chỉ" name="address" value={centerForm.address} onChange={handleCenterChange} placeholder="123 đường số 1" />
          <TextInput label="Thành phố" name="city" value={centerForm.city} onChange={handleCenterChange} placeholder="TP.HCM" />
          <TextInput label="Số điện thoại" name="phone" value={centerForm.phone} onChange={handleCenterChange} placeholder="0900000000" />
          <TextInput label="Trạng thái duyệt" name="approvalStatus" value={centerForm.approvalStatus} onChange={handleCenterChange} placeholder="PENDING" />
        </div>
        <div className="mt-5">
          <TextArea label="Mô tả trung tâm" name="description" value={centerForm.description} onChange={handleCenterChange} rows="4" placeholder="Mô tả ngắn về trung tâm thể thao" />
        </div>
        <ActionButton type="button" tone="violet" className="mt-5" onClick={saveCenter}>Lưu thông tin trung tâm</ActionButton>
      </DashboardCard>

      <DashboardCard title="Ghi chú vận hành" description="Khu vực phụ để trình bày đẹp hơn và hỗ trợ lúc demo.">
        <div className="space-y-4 text-sm leading-6 text-slate-600">
          <p>• Chủ sân chỉ nhìn thấy trang này khi đăng nhập bằng role OWNER.</p>
          <p>• Khách hàng sẽ không thấy menu Quản lý chủ sân và không vào được route này.</p>
          <p>• M có thể dùng tab Quản lý sân để tạo dữ liệu trước, sau đó quay lại đây để hoàn thiện hồ sơ cơ sở.</p>
        </div>
      </DashboardCard>
    </div>
  )
}

export default OwnerCenterForm
