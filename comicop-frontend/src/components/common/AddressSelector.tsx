import React, { useState, useEffect } from 'react'

interface Province {
  id: string
  name: string
}

interface Commune {
  id: string
  name: string
}

interface AddressSelectorProps {
  onSelect: (data: {
    provinceCode: string
    provinceName: string
    wardCode: string
    wardName: string
  }) => void
  defaultProvince?: string
  defaultWard?: string
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  onSelect,
  defaultProvince = '',
  defaultWard = '',
}) => {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [communes, setCommunes] = useState<Commune[]>([])
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null)
  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingCommunes, setLoadingCommunes] = useState(false)

  // Lấy danh sách tỉnh/thành — dữ liệu sau sáp nhập 2025
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch('https://addresskit.cas.so/latest/provinces')
        const data = await res.json()
        setProvinces(data)
      } catch {
        console.error('Không thể tải danh sách tỉnh thành')
      } finally {
        setLoadingProvinces(false)
      }
    }
    fetchProvinces()
  }, [])

  // Khi chọn tỉnh → lấy danh sách phường/xã thuộc tỉnh đó
  const handleProvinceChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const provinceId = e.target.value
    const province = provinces.find(p => p.id === provinceId) || null
    setSelectedProvince(province)
    setSelectedCommune(null)
    setCommunes([])

    if (!provinceId) return

    try {
      setLoadingCommunes(true)
      const res = await fetch(
        `https://addresskit.cas.so/latest/provinces/${provinceId}/communes`
      )
      const data = await res.json()
      setCommunes(data)
    } catch {
      console.error('Không thể tải danh sách phường/xã')
    } finally {
      setLoadingCommunes(false)
    }
  }

  // Khi chọn phường/xã → gọi callback để Checkout/AddressBook nhận giá trị
  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const communeId = e.target.value
    const commune = communes.find(c => c.id === communeId) || null
    setSelectedCommune(commune)

    if (commune && selectedProvince) {
      onSelect({
        provinceCode: selectedProvince.id,
        provinceName: selectedProvince.name,
        wardCode: commune.id,
        wardName: commune.name,
      })
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Dropdown Tỉnh/Thành phố */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tỉnh / Thành phố *
        </label>
        <select
          onChange={handleProvinceChange}
          disabled={loadingProvinces}
          defaultValue={defaultProvince}
          className="w-full rounded-md border border-gray-300 px-3 py-2
            focus:border-indigo-500 focus:outline-none focus:ring-1
            focus:ring-indigo-500 bg-white"
        >
          <option value="">
            {loadingProvinces ? 'Đang tải...' : 'Chọn tỉnh/thành'}
          </option>
          {provinces.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Dropdown Phường/Xã — chỉ active sau khi chọn tỉnh */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phường / Xã *
        </label>
        <select
          onChange={handleCommuneChange}
          disabled={!selectedProvince || loadingCommunes}
          defaultValue={defaultWard}
          className="w-full rounded-md border border-gray-300 px-3 py-2
            focus:border-indigo-500 focus:outline-none focus:ring-1
            focus:ring-indigo-500 bg-white disabled:bg-gray-100
            disabled:cursor-not-allowed"
        >
          <option value="">
            {loadingCommunes ? 'Đang tải...' : 'Chọn phường/xã'}
          </option>
          {communes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default AddressSelector