import { useCallback, useMemo, useState } from 'react'
import { createOwnerApi } from './ownerApi'
import { uploadFieldImagesToCloudinary, validateFieldImageFiles } from './cloudinaryUpload'

const emptyField = {
  fieldName: '',
  sportsType: '',
  address: '',
  price: '',
  description: '',
  status: 'PENDING',
}

const emptySchedule = {
  scheduleDate: '',
  startTime: '06:00',
  endTime: '22:00',
  price: '',
  slotMinutes: 60,
}

const emptyCenter = {
  id: '',
  name: '',
  address: '',
  city: '',
  phone: '',
  description: '',
  approvalStatus: 'PENDING',
}

const mapFieldToForm = (field) => ({
  fieldName: field?.fieldName || '',
  sportsType: field?.sportsType || '',
  address: field?.address || '',
  price: field?.price || '',
  description: field?.description || '',
  status: field?.status || 'PENDING',
})

export const useOwnerFields = (token, onStatusChange) => {
  const api = useMemo(() => createOwnerApi(token), [token])
  const [fieldForm, setFieldForm] = useState(emptyField)
  const [updateForm, setUpdateForm] = useState(emptyField)
  const [scheduleForm, setScheduleForm] = useState(emptySchedule)
  const [centerForm, setCenterForm] = useState(emptyCenter)
  const [imageLinks, setImageLinks] = useState([''])
  const [fieldImageFiles, setFieldImageFiles] = useState([])
  const [fields, setFields] = useState([])
  const [field, setField] = useState(null)
  const [images, setImages] = useState([])
  const [schedules, setSchedules] = useState([])
  const [isSavingField, setIsSavingField] = useState(false)
  const [isUploadingFieldImages, setIsUploadingFieldImages] = useState(false)

  const selectedFieldId = field?.id || fields[0]?.id || ''

  const selectField = useCallback((currentField) => {
    setField(currentField)
    setUpdateForm(mapFieldToForm(currentField))
  }, [])

  const loadFields = useCallback(async () => {
    const data = await api.getFields()
    setFields(data)
    if (data.length) {
      const selected = field ? data.find((item) => item.id === field.id) || data[0] : data[0]
      setField(selected)
      setUpdateForm(mapFieldToForm(selected))
    } else {
      setField(null)
      setUpdateForm(emptyField)
    }
    return data
  }, [api, field])

  const loadImages = useCallback(async (fieldId) => {
    if (!fieldId) {
      setImages([])
      return []
    }
    const data = await api.getFieldImages(fieldId)
    setImages(data)
    return data
  }, [api])

  const loadSchedules = useCallback(async (fieldId) => {
    if (!fieldId) {
      setSchedules([])
      return []
    }
    const data = await api.getFieldSchedules(fieldId)
    setSchedules(data)
    return data
  }, [api])

  const addFieldImageFiles = useCallback((files) => {
    const nextFiles = validateFieldImageFiles(files)
    setFieldImageFiles((prev) => [...prev, ...nextFiles].slice(0, 8))
  }, [])

  const removeFieldImageFile = useCallback((index) => {
    setFieldImageFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index))
  }, [])

  const createField = async () => {
    setIsSavingField(true)
    try {
      let uploadedImageUrls = []

      if (fieldImageFiles.length) {
        setIsUploadingFieldImages(true)
        uploadedImageUrls = await uploadFieldImagesToCloudinary(fieldImageFiles)
      }

      const data = await api.createField({
        ...fieldForm,
        price: Number(fieldForm.price || 0),
      })

      if (uploadedImageUrls.length) {
        const savedImages = await api.saveFieldImages(data.id, uploadedImageUrls)
        setImages(savedImages)
        setImageLinks([''])
      }
      setField(data)
      setFields((prev) => [data, ...prev])
      setUpdateForm(mapFieldToForm(data))
      setFieldForm(emptyField)
      setFieldImageFiles([])
      onStatusChange('Tạo sân thành công. M có thể thêm ảnh, lịch và cấu hình tiếp ở các tab bên dưới.')
      return data
    } finally {
      setIsUploadingFieldImages(false)
      setIsSavingField(false)
    }
  }

  const updateField = async () => {
    if (!selectedFieldId) {
      throw new Error('Chưa có sân để cập nhật.')
    }

    const data = await api.updateField(selectedFieldId, {
      ...updateForm,
      price: Number(updateForm.price),
    })

    setField(data)
    setFields((prev) => prev.map((item) => (item.id === data.id ? data : item)))
    onStatusChange('Đã cập nhật thông tin sân.')
    return data
  }

  const hideField = async () => {
    if (!selectedFieldId) {
      throw new Error('Chưa có sân để ẩn.')
    }

    await api.hideField(selectedFieldId)
    await loadFields()
    onStatusChange('Đã ẩn sân khỏi danh sách hoạt động.')
  }

  const saveImages = async () => {
    if (!selectedFieldId) {
      throw new Error('Tạo hoặc chọn sân trước rồi mới thêm ảnh được.')
    }

    const imageUrls = imageLinks.map((url) => url.trim()).filter(Boolean)
    if (!imageUrls.length) {
      throw new Error('Nhập ít nhất 1 link ảnh.')
    }

    const data = await api.saveFieldImages(selectedFieldId, imageUrls)
    setImages(data)
    setImageLinks([''])
    onStatusChange('Đã lưu thư viện ảnh.')
    return data
  }

  const deleteImage = async (imageId) => {
    await api.deleteFieldImage(imageId)
    setImages((prev) => prev.filter((image) => image.id !== imageId))
    onStatusChange('Đã xóa ảnh khỏi thư viện.')
  }

  const createSchedules = async () => {
    if (!selectedFieldId) {
      throw new Error('Tạo hoặc chọn sân trước rồi mới thêm lịch được.')
    }

    const data = await api.createSchedules(selectedFieldId, {
      ...scheduleForm,
      price: Number(scheduleForm.price),
      slotMinutes: Number(scheduleForm.slotMinutes),
    })
    setSchedules(data)
    onStatusChange('Đã tạo lịch cho sân.')
    return data
  }

  const saveCenter = async () => {
    if (!centerForm.id.trim()) {
      throw new Error('Nhập mã trung tâm trước khi lưu.')
    }

    const data = await api.saveCenter(centerForm.id, centerForm)
    setCenterForm((prev) => ({ ...prev, ...data }))
    onStatusChange('Đã cập nhật thông tin trung tâm.')
    return data
  }

  return {
    fieldForm,
    setFieldForm,
    updateForm,
    setUpdateForm,
    scheduleForm,
    setScheduleForm,
    centerForm,
    setCenterForm,
    imageLinks,
    setImageLinks,
    fieldImageFiles,
    addFieldImageFiles,
    removeFieldImageFile,
    fields,
    field,
    images,
    schedules,
    isSavingField,
    isUploadingFieldImages,
    selectedFieldId,
    selectField,
    loadFields,
    loadImages,
    loadSchedules,
    createField,
    updateField,
    hideField,
    saveImages,
    deleteImage,
    createSchedules,
    saveCenter,
  }
}
