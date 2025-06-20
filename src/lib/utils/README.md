# Debug Logger System

## Tổng quan

Hệ thống debug logger được thiết kế để giảm thiểu logs không cần thiết và chỉ hiển thị thông tin khi có thay đổi thực sự.

## Cách sử dụng

### 1. Bật/tắt logging

Chỉnh sửa file `debugLogger.ts`:

```typescript
export const DEBUG_CONFIG = {
    AUTH: true,        // Bật auth logs
    API: false,        // Tắt API logs  
    WEBSOCKET: true,   // Bật websocket logs
    RENDER: false,     // Tắt render logs
    
    ENABLED: process.env.NODE_ENV === 'development', // Chỉ bật trong dev
}
```

### 2. Sử dụng trong component

```typescript
import { createLogger } from '@/lib/utils/debugLogger'

const logger = createLogger('AUTH')

// Log thông thường (chỉ hiện khi DEBUG_CONFIG.AUTH = true)
logger.log('User logged in successfully')

// Log khi có thay đổi (chỉ hiện khi giá trị thực sự thay đổi)
logger.logOnChange('userToken', token, 'Token updated:')

// Log warning
logger.warn('Token will expire soon')

// Log error (luôn hiện)
logger.error('Authentication failed:', error)

// Group logging
logger.group('Login Process', () => {
    logger.log('Step 1: Validate credentials')
    logger.log('Step 2: Get token')
    logger.log('Step 3: Set user data')
})
```

### 3. Ưu điểm

- **Giảm spam logs**: Chỉ log khi có thay đổi thực sự
- **Tổ chức tốt**: Logs được phân loại theo module  
- **Dễ điều khiển**: Bật/tắt theo từng loại
- **Performance**: Không ảnh hưởng production

### 4. Module có sẵn

- `AUTH`: Authentication, login, logout, token refresh
- `API`: HTTP requests, responses, errors
- `WEBSOCKET`: WebSocket connections, messages
- `RENDER`: Component renders, state changes

## Trước khi optimize

```
Console Output:
Current token in state: eyJhbGc...
Current cookies: access_token=...; refresh_token=...
Authorization header set: Bearer eyJhbGc...
Base query with reauth called with args: {...}
Base query result: {...}
Current token in state: eyJhbGc...  // Duplicate!
Current cookies: access_token=...; refresh_token=... // Duplicate!
```

## Sau khi optimize  

```
Console Output:
[AUTH] Current token in state: eyJhbGc...
[AUTH] Authorization header set: Bearer eyJhbGc...
[AUTH] Base query with reauth called with args: {...}
// Không có duplicate logs nữa!
```

## Lưu ý

- Để bật debug cho production, set `DEBUG_CONFIG.ENABLED = true`
- Error logs luôn hiển thị bất kể config
- Sử dụng `logOnChange` cho các giá trị thay đổi thường xuyên
- Sử dụng `log` cho events một lần 