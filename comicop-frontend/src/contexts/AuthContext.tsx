// AuthContext.tsx — placeholder tạm
// File đầy đủ sẽ làm ở Ngày 5 (khi có Auth API backend)
// Hiện tại chỉ tạo để main.tsx không báo lỗi import
import React, { createContext, useContext, useState } from 'react'

interface AuthContextType {
    user: null
    isLoading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<void>
    register: (data: any) => Promise<void>
    logout: () => Promise<void>
    updateProfile: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading] = useState(false)

    // Các hàm placeholder — sẽ implement đầy đủ ở Ngày 5
    const login = async () => {}
    const register = async () => {}
    const logout = async () => {}
    const updateProfile = async () => {}

    return (
        <AuthContext.Provider value={{
            user: null,
            isLoading,
            error: null,
            login,
            register,
            logout,
            updateProfile,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}