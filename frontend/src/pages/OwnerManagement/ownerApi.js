const API_BASE = 'http://localhost:8080'

const parseResponse = async (response) => {
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || 'Không thể xử lý yêu cầu.')
  }
  return data
}

export const createOwnerApi = (token) => {
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  const request = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...authHeaders,
        ...(options.headers || {}),
      },
    })

    if (response.status === 204) {
      return null
    }

    return parseResponse(response)
  }

  return {
    getFields: () => request('/api/fields'),
    createField: (payload) => request('/api/fields', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    updateField: (fieldId, payload) => request(`/api/fields/${fieldId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    hideField: (fieldId) => request(`/api/fields/${fieldId}`, {
      method: 'DELETE',
    }),
    getFieldImages: (fieldId) => request(`/api/owner/fields/${fieldId}/images`),
    saveFieldImages: (fieldId, imageUrls) => request(`/api/owner/fields/${fieldId}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrls }),
    }),
    deleteFieldImage: (imageId) => request(`/api/owner/fields/images/${imageId}`, {
      method: 'DELETE',
    }),
    getFieldSchedules: (fieldId) => request(`/api/owner/fields/${fieldId}/schedules`),
    createSchedules: (fieldId, payload) => request(`/api/owner/fields/${fieldId}/schedules/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    saveCenter: (centerId, payload) => request(`/api/owner/centers/${centerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    getBookings: () => request('/api/owner/bookings'),
    updateBookingStatus: (bookingId, payload) => request(`/api/owner/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    checkInBooking: (payload) => request('/api/owner/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    getRevenue: () => request('/api/owner/reports/revenue'),
  }
}
