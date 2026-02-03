import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import apiClient from '../services/api'

interface User {
    id: number
    email: string
    username: string
    full_name: string
}

interface AuthState {
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null

    login: (email: string, password: string) => Promise<void>
    register: (email: string, username: string, password: string, fullName: string) => Promise<void>
    logout: () => void
    setUser: (user: User) => void
    clearError: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email, password) => {
                set({ isLoading: true, error: null })
                try {
                    const formData = new FormData()
                    formData.append('username', email)
                    formData.append('password', password)

                    const response = await apiClient.post('/api/auth/login', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })

                    const { access_token, refresh_token } = response

                    // Store tokens
                    localStorage.setItem('access_token', access_token)
                    localStorage.setItem('refresh_token', refresh_token)

                    // Get user info
                    const user = await apiClient.get('/api/users/me')

                    set({
                        user,
                        accessToken: access_token,
                        refreshToken: refresh_token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    })
                } catch (error: any) {
                    set({
                        error: error.response?.data?.detail || 'Login failed',
                        isLoading: false,
                    })
                    throw error
                }
            },

            register: async (email, username, password, fullName) => {
                set({ isLoading: true, error: null })
                try {
                    await apiClient.post('/api/auth/register', {
                        email,
                        username,
                        password,
                        full_name: fullName,
                    })

                    // Auto-login after registration
                    await useAuthStore.getState().login(email, password)
                } catch (error: any) {
                    set({
                        error: error.response?.data?.detail || 'Registration failed',
                        isLoading: false,
                    })
                    throw error
                }
            },

            logout: () => {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    error: null,
                })
            },

            setUser: (user) => set({ user }),

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)

export default useAuthStore
