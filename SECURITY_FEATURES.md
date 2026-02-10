# 🔒 Security Features - Anti-Cheating

## ✅ Implemented Security Features

### 1. Disable Browser Extensions

#### Google Translate Prevention
- ✅ Meta tag: `<meta name="google" content="notranslate">`
- ✅ HTML attribute: `translate="no"`
- ✅ CSS class: `notranslate`
- ✅ Applied to entire document

**Note:** Browser extensions berjalan di level browser, tidak bisa 100% diblokir dari JavaScript. Tapi ini akan disable auto-translate dan mempersulit penggunaan extension.

### 2. Prevent Opening New Tabs

#### Blocked Actions
- ✅ Ctrl+T (New Tab)
- ✅ Ctrl+N (New Window)
- ✅ Ctrl+W (Close Tab)
- ✅ Right-click → Open in new tab
- ✅ Middle-click on links

#### Detection
- ✅ Tab visibility change detection
- ✅ Window blur detection
- ✅ Fullscreen exit detection

### 3. Disable Developer Tools

#### Blocked Shortcuts
- ✅ F12 (DevTools)
- ✅ Ctrl+Shift+I (Inspect)
- ✅ Ctrl+Shift+J (Console)
- ✅ Ctrl+U (View Source)
- ✅ Right-click (Context Menu)

### 4. Disable Copy/Paste/Print

#### Blocked Actions
- ✅ Ctrl+S (Save Page)
- ✅ Ctrl+P (Print)
- ✅ Text selection disabled
- ⚠️ Ctrl+C (Copy) - Optional, currently enabled

### 5. Fullscreen Mode

- ✅ Auto-request fullscreen on exam start
- ✅ Detect fullscreen exit
- ✅ Warning when user exits fullscreen

### 6. Activity Monitoring

#### Tracked Events
- ✅ Tab switch
- ✅ Window blur
- ✅ Fullscreen exit
- ✅ Keyboard shortcut attempts
- ✅ Right-click attempts

#### Violation Logging
- ✅ Count violations
- ✅ Show warning banner
- ✅ Log to console (can send to backend)

## 🎯 How It Works

### ExamSecurityWrapper Component

Wraps the exam page and applies all security measures:

```jsx
<ExamSecurityWrapper>
  <ExamPage />
</ExamSecurityWrapper>
```

### useExamSecurity Hook

Custom hook that handles all security event listeners:

```javascript
const { violations } = useExamSecurity({
  onViolation: handleViolation,
  enabled: true,
});
```

## 🚨 User Experience

### Visual Indicators

1. **Secure Mode Badge** (bottom-right)
   - Green badge showing "Secure Mode"
   - Indicates security is active

2. **Warning Banner** (top-center)
   - Red banner when violation detected
   - Shows violation message
   - Auto-hides after 5 seconds

3. **Violation Counter** (bottom-left)
   - Shows number of violations
   - Only visible if violations > 0

### Warnings Shown

- "Tab switched or minimized"
- "Window lost focus"
- "User exited fullscreen mode"
- "Right-click disabled"
- "DevTools shortcut disabled"
- "New tab attempt blocked"

## ⚠️ Limitations

### What CAN'T Be Blocked (Browser Limitations)

1. **Browser Extensions**
   - Extensions run at browser level
   - JavaScript can't fully disable them
   - Can only make it harder to use

2. **Multiple Monitors**
   - Can't detect if user has multiple monitors
   - Can't prevent looking at other screen

3. **Physical Cheating**
   - Can't prevent using phone
   - Can't prevent asking someone else
   - Can't prevent using books/notes

4. **Virtual Machines**
   - Can't detect if running in VM
   - Can't prevent screen sharing

5. **Browser Developer Mode**
   - Advanced users can bypass some restrictions
   - Can disable JavaScript (breaks entire app)

### What CAN Be Blocked

✅ Casual cheating attempts
✅ Accidental tab switches
✅ Copy-paste from web
✅ Using browser translate
✅ Opening new tabs
✅ Using DevTools (for most users)

## 🔧 Configuration

### Enable/Disable Security

In `ExamSecurityWrapper.jsx`:

```javascript
const { violations } = useExamSecurity({
  onViolation: handleViolation,
  enabled: true, // Set to false to disable
});
```

### Customize Blocked Actions

In `useExamSecurity.js`, comment/uncomment sections:

```javascript
// Disable Ctrl+C (Copy)
if (e.ctrlKey && e.key === 'c') {
  e.preventDefault();
  return false;
}
```

### Send Violations to Backend

In `ExamSecurityWrapper.jsx`:

```javascript
const handleViolation = async (violation) => {
  // Log locally
  console.warn('Security Violation:', violation);
  
  // Send to backend
  await fetch('/api/exam/violation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      exam_id: examId,
      user_id: userId,
      violation: violation,
    }),
  });
};
```

## 📊 Backend Integration

### Violation Data Structure

```json
{
  "type": "TAB_SWITCH",
  "message": "User switched to another tab",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "exam_id": 1,
  "user_id": 123
}
```

### Violation Types

- `TAB_SWITCH` - User switched tab
- `WINDOW_BLUR` - User clicked outside
- `FULLSCREEN_EXIT` - User exited fullscreen
- `KEYBOARD_SHORTCUT` - Blocked shortcut attempt
- `RIGHT_CLICK` - Right-click attempt
- `NEW_TAB` - New tab attempt

### Backend Actions

Based on violations, backend can:

1. **Warning** - Show warning to user
2. **Flag** - Flag exam for review
3. **Auto-Submit** - Auto-submit after X violations
4. **Invalidate** - Invalidate exam results
5. **Block** - Block user from continuing

## 🎓 Best Practices

### For Administrators

1. **Educate Users**
   - Explain security measures before exam
   - Warn about consequences
   - Provide practice exam

2. **Monitor Violations**
   - Review violation logs
   - Identify patterns
   - Take appropriate action

3. **Combine with Other Measures**
   - Proctoring (human or AI)
   - Randomize questions
   - Time limits
   - IP tracking

### For Users

1. **Before Exam**
   - Close all other tabs
   - Disable browser extensions
   - Use fullscreen mode
   - Stable internet connection

2. **During Exam**
   - Don't switch tabs
   - Don't minimize window
   - Stay in fullscreen
   - Don't use shortcuts

## 🔐 Additional Security Recommendations

### Frontend (Already Implemented)

- ✅ Disable right-click
- ✅ Disable keyboard shortcuts
- ✅ Disable text selection
- ✅ Fullscreen mode
- ✅ Tab visibility detection
- ✅ Violation logging

### Backend (To Implement)

- ⚠️ Randomize question order
- ⚠️ Randomize option order
- ⚠️ Time tracking per question
- ⚠️ IP address logging
- ⚠️ Browser fingerprinting
- ⚠️ Session validation
- ⚠️ Answer pattern analysis

### Infrastructure

- ⚠️ Proctoring integration
- ⚠️ Webcam monitoring
- ⚠️ Screen recording
- ⚠️ AI-based cheating detection

## 📝 Testing Security

### Test Checklist

- [ ] Try to open new tab (Ctrl+T)
- [ ] Try to switch tab
- [ ] Try to minimize window
- [ ] Try to exit fullscreen
- [ ] Try to right-click
- [ ] Try to open DevTools (F12)
- [ ] Try to copy text (Ctrl+C)
- [ ] Try to print (Ctrl+P)
- [ ] Try to use Google Translate
- [ ] Check violation counter
- [ ] Check warning banner

### Expected Behavior

All attempts should be:
- ✅ Blocked
- ✅ Logged
- ✅ Show warning (if configured)
- ✅ Increment violation counter

## 🚀 Production Deployment

### Checklist

- [ ] Test all security features
- [ ] Configure violation handling
- [ ] Setup backend logging
- [ ] Test on different browsers
- [ ] Test on different devices
- [ ] Educate users
- [ ] Monitor violations
- [ ] Have support ready

---

**Security Level: Medium-High**

**Note:** No frontend security is 100% foolproof. Always combine with backend validation and monitoring.
