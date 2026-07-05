import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import AddressSelector from '../../components/common/AddressSelector'
import { addressService } from '../../services/addressService'
import type { AddressDto } from '../../services/addressService'

const AddressBook: React.FC = () => {
  const [addresses, setAddresses] = useState<AddressDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // State form thêm địa chỉ mới
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [selectedAddr, setSelectedAddr] = useState<{
    provinceCode: string
    provinceName: string
    wardCode: string
    wardName: string
  } | null>(null)
  const [isDefault, setIsDefault] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const fetchAddresses = async () => {
    try {
      const res = await addressService.getAddresses()
      setAddresses(res.data)
    } catch {
      toast.error('Không thể tải danh sách địa chỉ')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchAddresses() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAddr?.wardCode) {
      toast.error('Vui lòng chọn phường/xã')
      return
    }

    try {
      setIsSaving(true)
      await addressService.createAddress({
        fullName, phone, street,
        ...selectedAddr,
        isDefault,
      })
      toast.success('Đã thêm địa chỉ mới!')
      setShowForm(false)
      // Reset form
      setFullName(''); setPhone(''); setStreet('')
      setSelectedAddr(null); setIsDefault(false)
      fetchAddresses()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Thêm địa chỉ thất bại')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      await addressService.setDefault(id)
      toast.success('Đã đặt địa chỉ mặc định!')
      fetchAddresses()
    } catch {
      toast.error('Không thể cập nhật địa chỉ mặc định')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá địa chỉ này?')) return
    try {
      await addressService.deleteAddress(id)
      toast.success('Đã xoá địa chỉ!')
      fetchAddresses()
    } catch {
      toast.error('Không thể xoá địa chỉ')
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Địa chỉ</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm
            font-medium hover:bg-indigo-700 transition-colors"
        >
          {showForm ? 'Huỷ' : '+ Thêm địa chỉ'}
        </button>
      </div>

      {/* Form thêm địa chỉ */}
      {showForm && (
        <form onSubmit={handleSubmit}
          className="bg-gray-50 rounded-lg p-4 mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên *
              </label>
              <input type="text" required value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2
                  focus:border-indigo-500 focus:outline-none focus:ring-1
                  focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại *
              </label>
              <input type="tel" required value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={10} placeholder="0912345678"
                className="w-full rounded-md border border-gray-300 px-3 py-2
                  focus:border-indigo-500 focus:outline-none focus:ring-1
                  focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* AddressSelector — 2 cấp sau sáp nhập */}
          <AddressSelector onSelect={setSelectedAddr} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số nhà, tên đường *
            </label>
            <input type="text" required value={street}
              onChange={e => setStreet(e.target.value)}
              placeholder="123 Đường Nguyễn Văn A"
              className="w-full rounded-md border border-gray-300 px-3 py-2
                focus:border-indigo-500 focus:outline-none focus:ring-1
                focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <input
                id="default-address"
                type="checkbox"
                checked={isDefault}
                onChange={e => setIsDefault(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />

              <label
                htmlFor="default-address"
                className="ml-2 text-sm text-gray-700 cursor-pointer leading-none"
              >
                Đặt làm địa chỉ mặc định
              </label>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md
                font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Đang lưu...' : 'Lưu địa chỉ'}
            </button>
          </div>
        </form>
      )}

      {/* Danh sách địa chỉ đã lưu */}
      {isLoading ? (
        <p className="text-gray-500 text-center py-8">Đang tải...</p>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Chưa có địa chỉ nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map(addr => (
            <div key={addr.addressId}
              className={`p-4 rounded-lg border-2 transition-colors
                ${addr.isDefault
                  ? 'border-indigo-300 bg-indigo-50'
                  : 'border-gray-200 bg-white'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">
                      {addr.fullName}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600">{addr.phone}</span>
                    {addr.isDefault && (
                      <span className="text-xs bg-indigo-600 text-white
                        px-2 py-0.5 rounded-full font-medium">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{addr.fullAddress}</p>
                </div>

                {/* Nút hành động */}
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.addressId)}
                      className="text-xs text-indigo-600 hover:text-indigo-800
                        font-medium border border-indigo-300 px-2 py-1 rounded"
                    >
                      Đặt mặc định
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(addr.addressId)}
                    className="text-xs text-red-600 hover:text-red-800
                      font-medium border border-red-200 px-2 py-1 rounded"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddressBook