# Troubleshooting Guide

## Invalid Track References (404 Errors)

If you're seeing errors like `GET http://localhost:8000/api/tracks/1156/ 404 (Not Found)`, this guide will help you resolve them.

### What Causes This Issue?

This happens when the frontend tries to access tracks that no longer exist in the database, usually due to:

1. **Stale browser cache** - Your browser stored old track information
2. **RTK Query cache** - API cache contains outdated track references  
3. **Redux state** - Application state contains invalid track IDs
4. **Session data** - Previous session data persists

### How to Fix It

#### Quick Fix: Clear Cache and Refresh

1. **Access Debug Tools**:
   - Go to `http://localhost:3000/debug` in your browser
   - Click "Debug Info" to see current state
   - Click "Clear Cache" to remove stale data
   - Click "Refresh Page" to reload the app

2. **Manual Browser Clear**:
   - Press `F12` to open Developer Tools
   - Go to Application tab → Storage
   - Clear Local Storage and Session Storage
   - Refresh the page

#### Advanced Debugging

1. **Console Commands** (available in development):
   ```javascript
   // Check for invalid track references
   window.debugInvalidTracks.logDebugInfo()
   
   // Find specific invalid references
   window.debugInvalidTracks.findInvalidTrackReferences()
   
   // Clear all cache
   window.debugInvalidTracks.clearAllCache()
   ```

2. **Network Tab**:
   - Open Developer Tools → Network tab
   - Look for failed requests to `/api/tracks/[id]/`
   - Note the invalid track IDs

#### For Developers

1. **Check Backend Database**:
   ```bash
   cd harmonia-server
   python3 fix_invalid_tracks_comprehensive.py
   ```

2. **Valid Track ID Range**:
   - Current range: 152 - 395
   - Any ID outside this range is invalid

3. **Common Invalid IDs**:
   - 1156, 1203 (known invalid IDs)
   - Any ID > 1000 (suspicious, likely from stale cache)

### Prevention

1. **Regular Cache Clearing**:
   - Clear browser cache periodically
   - Use incognito/private browsing for testing

2. **Proper Error Handling**:
   - The app now includes automatic error handling
   - Invalid track requests are logged and handled gracefully

3. **Database Cleanup**:
   - Run cleanup scripts regularly to remove orphaned references
   - Monitor for invalid track requests in logs

### Getting Help

If the issue persists:

1. Check the browser console for error messages
2. Note the specific track IDs causing issues
3. Try the debug tools at `/debug`
4. Clear all browser data and try again

### Technical Details

- **RTK Query Cache**: Keeps API responses for 5-30 minutes
- **Redux State**: Persists during browser session
- **Error Handling**: Automatic filtering of invalid track IDs
- **Toast Notifications**: User-friendly error messages 