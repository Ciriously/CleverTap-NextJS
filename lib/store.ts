import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// --- TYPES ---

// 1. Cart Item Structure
type CartItem = {
  id: string
  title: string
  price: number
  coverUrl: string
  quantity: number
}

// 2. User Profile Structure
type User = {
  name: string
  email: string
  phone: string
  identity: string // Unique Epoch-based ID
  isAuthenticated: boolean
}

// 3. Toast (Notification) Structure
type ToastState = {
  message: string | null
  isVisible: boolean
}

// 4. The Main Store Interface
type AuthStore = {
  // State
  user: User | null
  cart: CartItem[]
  toast: ToastState

  // Auth Actions
  login: (name: string, email: string, countryCode: string, phone: string) => Promise<void>
  logout: () => void

  // Cart Actions
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void

  // Toast Actions
  showToast: (msg: string) => void
  hideToast: () => void
}

// --- STORE IMPLEMENTATION ---

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // --- INITIAL STATE ---
      user: null,
      cart: [],
      toast: { message: null, isVisible: false },

      // --- AUTHENTICATION ---
      login: async (name, email, countryCode, phone) => {
        // 1. Generate robust Identity & Clean Phone
        const uniqueId = `USER_${Date.now()}` 
        const cleanPhone = phone.replace(/\D/g, '') // Remove spaces/dashes
        const fullPhone = `${countryCode}${cleanPhone}`

        console.log(`👤 [AUTH] Logging in: ${uniqueId}`)

        // 2. Update Local State
        set({ 
            user: { 
                name, 
                email, 
                phone: fullPhone, 
                identity: uniqueId, 
                isAuthenticated: true 
            } 
        })

        // 3. Send to CleverTap (Dynamic Import for Safety)
        if (typeof window !== 'undefined') {
          try {
            const ctModule = await import('clevertap-web-sdk')
            const clevertap = ctModule.default || ctModule

            const profileData = {
              "Site": {
                "Name": name,
                "Email": email,
                "Identity": uniqueId,
                "Phone": fullPhone,
                "Country Code": countryCode,
                "Customer Type": "Platinum", 
                "Registration Date": new Date()
              }
            }

            console.log('🚀 [CLEVERTAP] Pushing Login Profile:', profileData)
            clevertap.onUserLogin.push(profileData)
            
          } catch (error) {
            console.error('❌ [CLEVERTAP] Failed to load SDK:', error)
          }
        }
      },

      logout: () => {
        console.log('👋 [AUTH] Logging out')
        set({ user: null, cart: [] }) // Clear sensitive data
      },

      // --- CART LOGIC ---
      addToCart: (item) => {
        const currentCart = get().cart
        const existingItem = currentCart.find((i) => i.id === item.id)

        if (existingItem) {
           // Item exists? Increment quantity
           set({
             cart: currentCart.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
           })
        } else {
           // New item? Add to list
           set({ cart: [...currentCart, item] })
        }
        
        // ✨ TRIGGER TOAST NOTIFICATION ✨
        get().showToast(`Added to Archive: ${item.title}`)
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((i) => i.id !== id) })
      },

      clearCart: () => {
        set({ cart: [] })
      },

      // --- TOAST NOTIFICATION LOGIC ---
      showToast: (message) => {
        // 1. Show message
        set({ toast: { message, isVisible: true } })
        
        // 2. Auto-hide after 3 seconds
        setTimeout(() => {
            set({ toast: { message: null, isVisible: false } })
        }, 3000)
      },

      hideToast: () => {
        set({ toast: { message: null, isVisible: false } })
      }
    }),
    {
      name: 'bookstore-storage', // Name in LocalStorage
      storage: createJSONStorage(() => localStorage), // Persist data
    }
  )
)