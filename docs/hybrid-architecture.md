# Hybrid Architecture & searchParams trong Next.js App Router

## 🏗️ **Hybrid Architecture Overview**

Dự án sử dụng **Hybrid Architecture** kết hợp **Server-Side Rendering (SSR)** và **Client-Side State Management (RTK Query)** để tối ưu performance và user experience.

### **Cấu trúc Route Groups:**
```
src/app/[locale]/
├── (app)/          # Protected app routes
│   ├── layout.tsx  # App layout với sidebar, player, navigation
│   ├── albums/
│   ├── artists/
│   ├── playlists/
│   └── ...
└── (auth)/         # Public auth routes  
    ├── layout.tsx  # Auth layout với Aurora background
    ├── login/
    ├── register/
    └── forgot-password/
```

### **Benefits:**
- ✅ **Layout Isolation**: Auth và App có layout riêng biệt
- ✅ **Performance**: Code splitting tự động, không load thừa components
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **SEO**: Server rendering cho public pages

---

## 🔍 **searchParams trong Next.js App Router**

### **Khái niệm:**
`searchParams` là URL query parameters được Next.js tự động parse và inject vào page components.

### **Syntax:**
```typescript
interface PageProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: PageProps) {
    // searchParams tự động được parse từ URL
}
```

### **URL Examples:**
```
/login                           → searchParams = {}
/login?redirect=/dashboard       → searchParams = { redirect: "/dashboard" }
/login?error=invalid_credentials → searchParams = { error: "invalid_credentials" }
/login?redirect=/profile&error=timeout → searchParams = { 
    redirect: "/profile", 
    error: "timeout" 
}
```

---

## 🎯 **Use Cases thực tế**

### **1. Authentication Redirect Flow**

**Problem:** User truy cập protected page → redirect login → mất context trang gốc

**Solution:**
```typescript
// 1. Middleware/Auth Guard
if (!isAuthenticated && isProtectedRoute) {
    redirect(`/login?redirect=${currentPath}`)
}

// 2. Login Page
export default async function LoginPage({ searchParams }) {
    const redirectUrl = searchParams.redirect  // "/playlists/123"
    return <LoginForm redirectUrl={redirectUrl} />
}

// 3. LoginForm
const onSubmit = async (data) => {
    const success = await handleLogin(data)
    if (success) {
        // Redirect về đúng trang user muốn xem ban đầu
        const destination = redirectUrl || "/dashboard"
        router.push(destination)
    }
}
```

**Flow:**
```
User visit: /playlists/123 (chưa login)
     ↓
Redirect: /login?redirect=/playlists/123
     ↓
User login success
     ↓
Redirect: /playlists/123 (về đúng chỗ!)
```

### **2. Error Handling**
```typescript
// OAuth error
/login?error=oauth_failed → Show specific error message

// Password reset success  
/login?message=password_updated → Show success toast

// Invalid credentials
/login?error=invalid_credentials → Pre-fill error state
```

### **3. Analytics & Tracking**
```typescript
// UTM tracking
/login?utm_source=facebook&utm_campaign=ads
→ Track marketing conversion

// Referral tracking
/login?ref=friend123
→ Track referral source
```

---

## 🔧 **Implementation trong dự án**

### **Server Side (Page Level):**
```typescript
// src/app/[locale]/(auth)/login/page.tsx
export default async function LoginPage({ searchParams }: LoginPageProps) {
    // 🔄 SSR parse URL params
    const redirectUrl = searchParams.redirect as string
    const error = searchParams.error as string
    
    // 🔄 Có thể fetch thêm data từ server nếu cần
    // const initialData = await fetch('api-endpoint')
    
    return (
        <LoginForm 
            redirectUrl={redirectUrl}
            serverError={error}
            // initialData={initialData}
        />
    )
}
```

### **Client Side (Component Level):**
```typescript
// src/modules/auth/login/components/forms/LoginForm.tsx
interface LoginFormProps {
    redirectUrl?: string
    serverError?: string
}

export const LoginForm = ({ redirectUrl, serverError }: LoginFormProps) => {
    // 🔄 RTK Query xử lý mutations và caching
    const { handleLogin } = useLogin()
    
    const onSubmit = async (data) => {
        const success = await handleLogin(data.username_or_email, data.password)
        if (success) {
            // Sử dụng redirectUrl từ SSR
            const destination = redirectUrl || `/${locale}${r.HOME}`
            router.replace(destination)
        }
    }
}
```

---

## ✅ **Advantages của Hybrid Approach**

### **SEO & Performance:**
- ✅ URL params được parse ở server → SEO friendly
- ✅ Initial state có sẵn khi page load → No flash content
- ✅ Server xử lý redirect logic nhanh

### **Developer Experience:**
- ✅ Type-safe với TypeScript interfaces
- ✅ Server và Client có responsibility riêng biệt
- ✅ Easy to test và debug

### **User Experience:**
- ✅ Smooth redirects sau authentication
- ✅ Context được preserve qua login flow
- ✅ Proper error handling và messaging

---

## 🚀 **Best Practices**

### **1. Type Safety:**
```typescript
interface LoginPageProps {
    searchParams: { 
        redirect?: string
        error?: string
        utm_source?: string
    }
}
```

### **2. Fallback Values:**
```typescript
const redirectUrl = searchParams.redirect || "/dashboard"
const errorMessage = searchParams.error || null
```

### **3. URL Encoding:**
```typescript
// Khi tạo redirect URL
const redirectParam = encodeURIComponent(currentPath)
router.push(`/login?redirect=${redirectParam}`)

// Khi sử dụng
const destination = decodeURIComponent(redirectUrl)
```

### **4. Security:**
```typescript
// Validate redirect URL để tránh open redirect
const isValidRedirect = (url: string) => {
    return url.startsWith('/') && !url.startsWith('//')
}

const destination = (redirectUrl && isValidRedirect(redirectUrl)) 
    ? redirectUrl 
    : "/dashboard"
```

---

## 📝 **Kết luận**

**searchParams** là công cụ mạnh mẽ trong Next.js App Router giúp:
- Tạo smooth user experience trong authentication flows
- Handle complex routing logic
- Support analytics và tracking
- Maintain context qua page transitions

Kết hợp với **Hybrid Architecture**, chúng ta có được:
- Server-side performance
- Client-side interactivity  
- Type-safe development experience
- Scalable và maintainable codebase 