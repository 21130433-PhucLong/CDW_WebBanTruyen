import React, { useState } from 'react'
import { authService } from '../../services/authService'
import { toast } from 'react-toastify'

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Lỗi từng field — hiện màu đỏ ngay dưới ô tương ứng (đồng bộ cách làm ở Checkout)
  const [errors, setErrors] = useState<{
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate phía Frontend trước — Backend vẫn validate lại để chắc chắn
    const newErrors: typeof errors = {}
    if (!currentPassword.trim()) newErrors.currentPassword = 'Vui lòng không bỏ trống'
    if (!newPassword.trim()) {
      newErrors.newPassword = 'Vui lòng không bỏ trống'
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    try {
      setIsSaving(true)
      await authService.changePassword(currentPassword, newPassword)
      toast.success('Đổi mật khẩu thành công!')
      // Reset form sau khi thành công
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setErrors({})
    } catch (err: any) {
      // Message từ Backend — ví dụ "Mật khẩu hiện tại không đúng"
      toast.error(err.response?.data?.message || 'Đổi mật khẩu thất bại')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Đổi mật khẩu</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu hiện tại *
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => {
              setCurrentPassword(e.target.value)
              if (errors.currentPassword) {
                setErrors(prev => ({ ...prev, currentPassword: undefined }))
              }
            }}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1
              ${errors.currentPassword
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
          />
          {errors.currentPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.currentPassword}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu mới *
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={e => {
              setNewPassword(e.target.value)
              if (errors.newPassword) {
                setErrors(prev => ({ ...prev, newPassword: undefined }))
              }
            }}
            placeholder="Tối thiểu 6 ký tự"
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1
              ${errors.newPassword
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
          />
          {errors.newPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Xác nhận mật khẩu mới *
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value)
              if (errors.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: undefined }))
              }
            }}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1
              ${errors.confirmPassword
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium
            hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'Đang xử lý...' : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  )
}

export default ChangePassword