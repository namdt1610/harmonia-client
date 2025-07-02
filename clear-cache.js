// Clear Browser Cache và RTK Query Cache
// Chạy script này trong DevTools Console của browser

console.log('Starting cache cleanup...')

// 1. Clear localStorage
if (localStorage) {
    const beforeCount = localStorage.length
    localStorage.clear()
    console.log(`localStorage cleared (${beforeCount} items removed)`)
}

// 2. Clear sessionStorage
if (sessionStorage) {
    const beforeCount = sessionStorage.length
    sessionStorage.clear()
    console.log(`sessionStorage cleared (${beforeCount} items removed)`)
}

// 3. Clear IndexedDB (cho RTK Query persist)
if ('indexedDB' in window) {
    indexedDB
        .databases()
        .then((databases) => {
            databases.forEach((db) => {
                indexedDB.deleteDatabase(db.name)
                console.log(`IndexedDB database deleted: ${db.name}`)
            })
        })
        .catch((e) => console.warn('IndexedDB cleanup failed:', e))
}

// 4. Clear Service Worker cache
if ('serviceWorker' in navigator && 'caches' in window) {
    caches
        .keys()
        .then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log(`Deleting cache: ${cacheName}`)
                    return caches.delete(cacheName)
                })
            )
        })
        .then(() => {
            console.log('Service Worker caches cleared')
        })
        .catch((e) => console.warn('Service Worker cache cleanup failed:', e))
}

// 5. Clear cookies (cho auth)
document.cookie.split(';').forEach((cookie) => {
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
    document.cookie =
        name +
        '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' +
        window.location.hostname
    document.cookie =
        name +
        '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' +
        window.location.hostname
})
console.log('Cookies cleared')

// 6. Clear Redux store nếu có Redux DevTools
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    try {
        // Reset Redux store if accessible
        if (window.store && window.store.dispatch) {
            // Clear RTK Query cache
            window.store.dispatch({ type: 'api/resetApiState' })
            console.log('Redux store reset')
        }
    } catch (e) {
        console.warn('Redux store reset failed:', e)
    }
}

// 7. Force reload page
console.log('Reloading page in 2 seconds...')
setTimeout(() => {
    window.location.reload(true) // Hard reload
}, 2000)

console.log(`

Cache cleanup completed!

What was cleared:
- localStorage
- sessionStorage  
- IndexedDB
- Service Worker caches
- Cookies
- Redux/RTK Query cache

The page will reload automatically to ensure all changes take effect.

If you still see track ID 1203 or other invalid tracks:
1. Open Network tab and check if API calls return correct data
2. Try incognito/private browsing mode
3. Check browser's Application tab for any remaining stored data
`)
