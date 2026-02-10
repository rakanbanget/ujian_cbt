# 🚨 Auto-Submit System - Security Violation Management

## 📋 Overview

Sistem auto-submit akan otomatis mengakhiri ujian jika peserta melakukan terlalu banyak pelanggaran keamanan.

## 🎯 Violation Levels

### Level 1: Warning (Violation 1)
**Tampilan:**
- 🟡 Yellow banner di top-center
- Pesan: "Peringatan Keamanan"
- Counter: "Pelanggaran: 1/3"

**Aksi:**
- Show warning banner selama 5 detik
- Log violation ke console
- Increment violation counter

**User Experience:**
- User masih bisa melanjutkan ujian
- Warning hilang otomatis setelah 5 detik

---

### Level 2: Serious Warning (Violation 2)
**Tampilan:**
- 🟠 Orange banner di top-center
- Pesan: "Peringatan Keamanan"
- Counter: "Pelanggaran: 2/3"

**Aksi:**
- Show warning banner selama 5 detik
- Log violation ke console
- Increment violation counter

**User Experience:**
- User masih bisa melanjutkan ujian
- Warning lebih mencolok
- Counter menunjukkan mendekati batas

---

### Level 3: Critical Warning (Violation 3 - Last Chance)
**Tampilan:**
- 🔴 Full-screen modal dengan backdrop
- Icon: ⚠️ (besar)
- Title: "PERINGATAN TERAKHIR!"
- Message: "Ini adalah pelanggaran keamanan ke-3 dari 3"
- Warning: "Satu pelanggaran lagi dan ujian akan disubmit otomatis!"

**Aksi:**
- Show critical warning modal
- Block entire screen
- Require user acknowledgment
- Log critical violation

**User Experience:**
- User HARUS klik "Saya Mengerti"
- Modal hilang setelah 10 detik atau user klik button
- User masih bisa melanjutkan ujian
- **INI KESEMPATAN TERAKHIR!**

---

### Level 4: Auto-Submit (Violation 4+)
**Tampilan:**
- 🚨 Full-screen modal dengan backdrop hitam
- Icon: 🚨 (animated pulse)
- Title: "UJIAN DISUBMIT OTOMATIS"
- Message: "Terlalu banyak pelanggaran keamanan terdeteksi"
- Countdown: "Ujian akan disubmit dalam 5 detik..."
- Loading spinner

**Aksi:**
- Show auto-submit modal
- Block entire screen (no escape)
- Start 5-second countdown
- Auto-submit exam
- Redirect to login page
- Show alert: "Ujian telah disubmit otomatis karena pelanggaran keamanan"

**User Experience:**
- User TIDAK BISA cancel
- User TIDAK BISA continue exam
- Exam submitted automatically
- Results will be reviewed by admin

---

## 🔢 Violation Counter

**Configuration:**
```javascript
const MAX_VIOLATIONS = 3; // Auto-submit after 3 violations
```

**Dapat diubah sesuai kebutuhan:**
- `MAX_VIOLATIONS = 2` → Auto-submit after 2 violations (strict)
- `MAX_VIOLATIONS = 3` → Auto-submit after 3 violations (default)
- `MAX_VIOLATIONS = 5` → Auto-submit after 5 violations (lenient)

---

## 📊 Violation Types

### 1. Tab Switch
**Trigger:** User switches to another tab
**Detection:** `document.visibilitychange` event
**Message:** "Tab switched or minimized"

### 2. Window Blur
**Trigger:** User clicks outside browser window
**Detection:** `window.blur` event
**Message:** "Window lost focus"

### 3. Fullscreen Exit
**Trigger:** User exits fullscreen mode
**Detection:** `document.fullscreenchange` event
**Message:** "User exited fullscreen mode"

### 4. Keyboard Shortcuts
**Trigger:** User tries blocked shortcuts (F12, Ctrl+Shift+I, etc)
**Detection:** `keydown` event
**Message:** "DevTools shortcut disabled" / "New tab attempt blocked"

### 5. Right-Click
**Trigger:** User right-clicks
**Detection:** `contextmenu` event
**Message:** "Right-click disabled"

---

## 🎨 Visual Indicators

### Warning Banner (Top-Center)
```
┌─────────────────────────────────────────┐
│ ⚠️  Peringatan Keamanan                 │
│ Tab switched. Pelanggaran: 1/3          │
│ Jangan keluar dari fullscreen!          │
└─────────────────────────────────────────┘
```

### Critical Warning Modal
```
┌───────────────────────────────────────────┐
│                                           │
│              ⚠️                           │
│                                           │
│      PERINGATAN TERAKHIR!                 │
│                                           │
│  Ini adalah pelanggaran ke-3 dari 3.     │
│                                           │
│  Satu pelanggaran lagi dan ujian akan    │
│  disubmit otomatis!                       │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │ Jangan lakukan:                     │ │
│  │ ❌ Keluar dari fullscreen           │ │
│  │ ❌ Switch ke tab lain               │ │
│  │ ❌ Minimize window                  │ │
│  └─────────────────────────────────────┘ │
│                                           │
│      [ Saya Mengerti ]                    │
│                                           │
└───────────────────────────────────────────┘
```

### Auto-Submit Modal
```
┌───────────────────────────────────────────┐
│                                           │
│              🚨                           │
│                                           │
│    UJIAN DISUBMIT OTOMATIS                │
│                                           │
│  Terlalu banyak pelanggaran keamanan.    │
│                                           │
│  Ujian akan disubmit dalam 5 detik...    │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │ Total Pelanggaran: 4                │ │
│  │ Hasil akan ditinjau pengawas        │ │
│  └─────────────────────────────────────┘ │
│                                           │
│              ⏳                           │
│                                           │
└───────────────────────────────────────────┘
```

### Violation Counter (Bottom-Left)
```
┌─────────────────────┐
│ Violations: 2       │
└─────────────────────┘
```

---

## 🔧 Configuration

### Change Max Violations

In `src/components/ExamSecurityWrapper.jsx`:

```javascript
const MAX_VIOLATIONS = 3; // Change this number
```

### Change Auto-Submit Delay

```javascript
setTimeout(() => {
  onAutoSubmit?.();
}, 5000); // Change delay (milliseconds)
```

### Disable Auto-Submit (Testing)

```javascript
// Comment out auto-submit code
// setTimeout(() => {
//   onAutoSubmit?.();
// }, 5000);
```

---

## 📡 Backend Integration

### Send Violations to Backend

In `ExamSecurityWrapper.jsx`:

```javascript
const handleViolation = async (violation) => {
  // ... existing code ...

  // Send to backend
  try {
    await fetch('/api/exam/violation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        exam_id: examId,
        user_id: userId,
        violation_type: violation.type,
        violation_message: violation.message,
        violation_count: newCount,
        timestamp: violation.timestamp,
      }),
    });
  } catch (err) {
    console.error('Failed to log violation:', err);
  }
};
```

### Backend Response

Backend should track violations and can:

1. **Log violations** to database
2. **Flag exam** for review
3. **Notify admin** of suspicious activity
4. **Invalidate results** if too many violations
5. **Block user** from future exams

---

## 🧪 Testing

### Test Violation Levels

1. **Test Level 1 (Warning)**
   - Switch tab once
   - Should show yellow warning
   - Counter: 1/3

2. **Test Level 2 (Serious)**
   - Switch tab again
   - Should show orange warning
   - Counter: 2/3

3. **Test Level 3 (Critical)**
   - Switch tab third time
   - Should show full-screen modal
   - Must click "Saya Mengerti"
   - Counter: 3/3

4. **Test Level 4 (Auto-Submit)**
   - Switch tab fourth time
   - Should show auto-submit modal
   - Wait 5 seconds
   - Exam should auto-submit
   - Redirect to login

### Test Different Violation Types

- [ ] Tab switch (Ctrl+Tab)
- [ ] Window blur (click outside)
- [ ] Fullscreen exit (Esc key)
- [ ] Right-click
- [ ] F12 (DevTools)
- [ ] Ctrl+T (New Tab)

---

## 📊 Analytics

### Metrics to Track

1. **Violation Rate**
   - Average violations per exam
   - Violation types distribution
   - Time of violations

2. **Auto-Submit Rate**
   - Percentage of exams auto-submitted
   - Reasons for auto-submit
   - User patterns

3. **False Positives**
   - Accidental violations
   - Technical issues
   - User complaints

---

## ⚠️ Important Notes

### User Education

**Before Exam:**
- Explain security measures
- Show violation consequences
- Provide practice exam
- Test user's setup

**During Exam:**
- Clear warning messages
- Progressive severity
- Give second chances
- Fair auto-submit threshold

### Fair Implementation

1. **Don't be too strict**
   - Allow 3-5 violations before auto-submit
   - Give clear warnings
   - Allow recovery

2. **Handle edge cases**
   - Network issues
   - Browser crashes
   - Accidental clicks
   - Technical problems

3. **Review flagged exams**
   - Manual review by admin
   - Consider context
   - Fair judgment

---

## 🎯 Best Practices

### For Administrators

1. **Set appropriate threshold**
   - Not too strict (frustrating)
   - Not too lenient (ineffective)
   - Test with real users

2. **Monitor violations**
   - Review logs regularly
   - Identify patterns
   - Adjust rules if needed

3. **Communicate clearly**
   - Explain rules before exam
   - Show consequences
   - Be transparent

### For Users

1. **Before starting exam**
   - Close all other tabs
   - Disable notifications
   - Use fullscreen mode
   - Stable internet

2. **During exam**
   - Stay in fullscreen
   - Don't switch tabs
   - Don't minimize window
   - Focus on exam

---

## 🔒 Security Level

**Current Configuration:**
- Max Violations: 3
- Auto-Submit Delay: 5 seconds
- Fullscreen Required: Yes
- Tab Switch Detection: Yes
- Window Blur Detection: Yes

**Security Level: HIGH**

---

**Status: ✅ IMPLEMENTED & ACTIVE**

**Last Updated:** [Date]
