import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { authService, mapAccountDtoToUser } from '../../services/authService'
import { toast } from 'react-toastify'

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth()

  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '')
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // Đổi ảnh đại diện — chọn file → gọi API → cập nhật AuthContext
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate phía Frontend trước khi gửi — tránh upload file quá nặng vô ích
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ảnh không được vượt quá 2MB')
      return
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh')
      return
    }

    try {
      setUploadingAvatar(true)
      const res = await authService.uploadAvatar(file)
      // Cập nhật lại AuthContext để Header và Sidebar đổi avatar ngay
      await updateProfile(mapAccountDtoToUser(res.data))
      toast.success('Đã cập nhật ảnh đại diện!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể cập nhật ảnh')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSaving(true)
      await updateProfile({ firstName, lastName, phoneNumber })
      toast.success('Đã cập nhật thông tin!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Hồ sơ cá nhân</h1>

      {/* Upload avatar */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
        <img
          src={user?.avatar || 'https://via.placeholder.com/80?text=Avatar'}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
        />
        <div>
          <label className="cursor-pointer inline-block px-4 py-2 bg-indigo-50
            text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100
            transition-colors">
            {uploadingAvatar ? 'Đang tải lên...' : 'Đổi ảnh đại diện'}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG tối đa 2MB</p>
        </div>
      </div>

      {/* Form thông tin */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full rounded-md border border-gray-200 bg-gray-50
              px-3 py-2 text-gray-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ
            </label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2
                focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên
            </label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2
                focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            maxLength={10}
            placeholder="0912345678"
            className="w-full rounded-md border border-gray-300 px-3 py-2
              focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium
            hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>
    </div>
  )
}

export default Profile