const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'djmdzzkch'
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'sports_field_upload'
const CLOUDINARY_FOLDER = import.meta.env.VITE_CLOUDINARY_FIELD_FOLDER || ''

const MAX_IMAGE_SIZE_MB = 8
const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024

const assertCloudinaryConfig = () => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Chua cau hinh Cloudinary cloud name hoac upload preset.')
  }
}

export const validateFieldImageFiles = (files) => {
  const images = Array.from(files || [])

  for (const file of images) {
    if (!file.type.startsWith('image/')) {
      throw new Error('Chi duoc chon file hinh anh.')
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error(`Moi anh toi da ${MAX_IMAGE_SIZE_MB}MB.`)
    }
  }

  return images
}

export const uploadFieldImagesToCloudinary = async (files) => {
  const images = validateFieldImageFiles(files)

  if (!images.length) {
    return []
  }

  assertCloudinaryConfig()

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

  const uploadedImages = await Promise.all(
    images.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      if (CLOUDINARY_FOLDER) {
        formData.append('folder', CLOUDINARY_FOLDER)
      }

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.secure_url) {
        throw new Error(data?.error?.message || 'Khong the upload anh len Cloudinary.')
      }

      return data.secure_url
    }),
  )

  return uploadedImages
}
