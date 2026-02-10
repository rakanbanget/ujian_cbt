# Architecture & Best Practices

## 📐 Architecture Overview

### State Management Strategy

**Context API** digunakan untuk:
- Authentication state (user, token, login/logout)
- Exam state (questions, answers, timer)

**Kapan upgrade ke Redux/Zustand?**
- Jika ada >5 contexts yang saling depend
- Jika perlu time-travel debugging
- Jika ada complex state updates dengan banyak side effects
- Untuk project ini: **Context API sudah cukup**

### Data Flow

```
User Action → Component → Context → API Call → Update State → Re-render
```

**Auto-save Flow:**
```
User selects answer → Update local state → Debounce 3s → POST to API → Success/Error handling
```

## 🔌 API Integration Patterns

### 1. Axios vs Fetch

**Pilihan: Axios** ✅

Alasan:
- Built-in interceptors (request/response)
- Automatic JSON parsing
- Better error handling
- Timeout support
- Request cancellation
- Progress tracking

### 2. Error Handling Pattern

```javascript
// Centralized di apiClient.js
- Network errors → User-friendly message
- 401 → Auto-logout + redirect
- 403 → Permission denied message
- 404 → Not found message
- 500 → Server error message
```

### 3. Loading States

**Pattern yang digunakan:**
- Global loading: Saat fetch initial data
- Local loading: Saat save/submit (isSaving state)
- Skeleton screens: Untuk list/grid (future enhancement)

### 4. Token Management

**Storage Strategy:**
- **sessionStorage**: Auth token (auto-clear saat tab ditutup)
- **localStorage**: Exam state recovery (persist across refresh)

**Why sessionStorage for token?**
- Lebih aman (tidak persist setelah browser ditutup)
- Prevent token theft dari shared computers
- Auto-cleanup

### 5. Auto-save Strategy

**Hybrid Approach:**
```
1. User action → Update local state (instant UI feedback)
2. Debounce 3 seconds → Batch pending changes
3. POST to API → Background save
4. On navigation/submit → Flush pending saves
```

**Benefits:**
- Responsive UI (no waiting)
- Reduced API calls (batching)
- Data safety (auto-save)
- Network efficient

### 6. Retry Mechanism

**Current: Manual retry via UI**
- Show error message
- User can retry action

**Future Enhancement:**
```javascript
// Exponential backoff retry
const retry = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 2 ** i * 1000));
    }
  }
};
```

## 🎨 UX/UI Best Practices

### 1. Loading States

**Implemented:**
- Spinner untuk initial load
- "Menyimpan..." indicator saat auto-save
- Disabled buttons saat processing

**Recommended:**
- Skeleton screens untuk question list
- Progress bar untuk submission

### 2. Error States

**Pattern:**
```
Error → User-friendly message → Action button (Retry/Close)
```

**Examples:**
- Network error → "Koneksi bermasalah. Coba lagi?"
- API error → Specific message dari backend
- Validation error → Inline field errors

### 3. Empty States

**Implemented:**
- No questions → "Belum ada soal"
- No exam → "Ujian tidak ditemukan"

### 4. Optimistic Updates

**Current: Optimistic for answers**
- Update UI immediately
- Revert if API fails

**Pattern:**
```javascript
// Update UI
setAnswer(questionId, answer);

// Save to API
const result = await saveAnswer();

// Revert if failed
if (!result.success) {
  setAnswer(questionId, previousAnswer);
  showError(result.error);
}
```

### 5. Network Issues

**Implemented:**
- Network status indicator (online/offline)
- Reconnection notification
- Prevent actions saat offline

**Future:**
- Queue actions saat offline
- Auto-retry saat online kembali

## ✨ Feature Recommendations

### Priority 1 (Must Have)

✅ **Review Page** - Implemented
- Review semua jawaban sebelum submit
- Visual status (answered/unanswered/doubtful)
- Quick navigation ke soal

✅ **Confirmation Modals** - Implemented
- Confirm sebelum submit
- Confirm sebelum logout
- Prevent accidental actions

✅ **Keyboard Shortcuts** - Implemented
- Arrow keys: Navigation
- n/p: Next/Previous
- Ctrl+Enter: Submit

### Priority 2 (Should Have)

⚠️ **Progress Indicator**
```jsx
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className="bg-blue-600 h-2 rounded-full transition-all"
    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
  />
</div>
```

⚠️ **Accessibility**
- ARIA labels untuk screen readers
- Keyboard navigation (Tab, Enter)
- Focus management
- High contrast mode support

### Priority 3 (Nice to Have)

❌ **Offline Mode (PWA)**
- Service worker
- Cache questions
- Sync saat online

❌ **Real-time Monitoring**
- WebSocket untuk admin dashboard
- Live participant tracking
- Real-time answer submission

## ⚡ Performance Optimization

### 1. Component Optimization

**When to use React.memo:**
```jsx
// Components yang render sering tapi props jarang berubah
export const QuestionGrid = React.memo(({ questions, onSelect }) => {
  // ...
});
```

**When to use useMemo:**
```jsx
// Expensive calculations
const sortedQuestions = useMemo(() => {
  return questions.sort((a, b) => a.order - b.order);
}, [questions]);
```

**When to use useCallback:**
```jsx
// Functions passed to child components
const handleAnswer = useCallback((answer) => {
  setAnswer(currentQuestion.id, answer);
}, [currentQuestion.id]);
```

### 2. Lazy Loading

```jsx
// Route-based code splitting
const ExamPage = lazy(() => import('./components/ExamPage'));
const ResultPage = lazy(() => import('./components/ResultPage'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/exam/:id" element={<ExamPage />} />
    <Route path="/result/:id" element={<ResultPage />} />
  </Routes>
</Suspense>
```

### 3. Image Optimization

**If questions have images:**
```jsx
// Lazy load images
<img 
  src={question.image} 
  loading="lazy"
  alt={`Soal ${question.number}`}
/>

// Use WebP format
// Compress images before upload
// Use CDN for serving
```

### 4. Bundle Size

**Current optimizations:**
- Vite's automatic code splitting
- Tree shaking (ES modules)
- Production build minification

**Recommendations:**
```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer

# Check for large dependencies
# Consider alternatives if needed
```

## 🔒 Security Best Practices

### 1. XSS Prevention

**React default protection:**
- Auto-escaping dalam JSX
- dangerouslySetInnerHTML avoided

**If rendering HTML from API:**
```javascript
import DOMPurify from 'dompurify';

const cleanHTML = DOMPurify.sanitize(question.content);
```

### 2. Token Security

✅ **Implemented:**
- sessionStorage (not localStorage)
- HTTPS only (production)
- Token in Authorization header (not URL)

❌ **Don't:**
- Store token in localStorage (XSS risk)
- Send token in URL params
- Log token to console

### 3. CORS

**Backend must configure:**
```javascript
// Express example
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

### 4. Prevent Cheating (Frontend)

**Limited options:**
- Disable right-click (easily bypassed)
- Disable copy-paste (easily bypassed)
- Full-screen mode (can help)
- Tab visibility detection

**Better: Backend solutions:**
- Randomize question order
- Time limits
- IP tracking
- Browser fingerprinting
- Proctoring integration

## 🧪 Testing Strategy

### 1. Unit Tests (Jest + React Testing Library)

```javascript
// Example: Test answer selection
test('should update answer when option selected', () => {
  const { getByRole } = render(<QuestionDisplay />);
  const optionA = getByRole('radio', { name: /Option A/i });
  
  fireEvent.click(optionA);
  
  expect(optionA).toBeChecked();
});
```

### 2. Integration Tests

```javascript
// Test API integration
test('should save answer to API', async () => {
  const { getByRole } = render(<ExamPage />);
  const optionA = getByRole('radio', { name: /Option A/i });
  
  fireEvent.click(optionA);
  
  await waitFor(() => {
    expect(mockApi.submitAnswer).toHaveBeenCalled();
  });
});
```

### 3. E2E Tests (Cypress)

```javascript
// Test complete exam flow
describe('Exam Flow', () => {
  it('should complete exam successfully', () => {
    cy.visit('/login');
    cy.get('[name="nomorPeserta"]').type('12345');
    cy.get('[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/exam');
    cy.get('[data-testid="question-1"]').click();
    cy.get('[data-testid="option-A"]').click();
    cy.get('[data-testid="submit-exam"]').click();
    cy.get('[data-testid="confirm-submit"]').click();
    
    cy.url().should('include', '/result');
  });
});
```

### Testing Checklist

- [ ] Login flow
- [ ] Protected routes
- [ ] Answer selection
- [ ] Auto-save functionality
- [ ] Timer countdown
- [ ] Submit exam
- [ ] Error handling
- [ ] Network offline/online
- [ ] Token expiry
- [ ] Keyboard navigation

## 📋 Production Checklist

### Pre-launch

- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] Error handling tested
- [ ] Loading states implemented
- [ ] Mobile responsive
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Performance audit (Lighthouse)
- [ ] Security review
- [ ] Accessibility audit
- [ ] SEO meta tags

### Backend Coordination

- [ ] API documentation reviewed
- [ ] Error response format agreed
- [ ] Authentication flow tested
- [ ] CORS configured
- [ ] Rate limiting understood
- [ ] Response time SLA
- [ ] Monitoring setup
- [ ] Backup strategy

### Deployment

- [ ] Build optimization
- [ ] CDN setup
- [ ] SSL certificate
- [ ] Domain configured
- [ ] Analytics integrated
- [ ] Error tracking (Sentry)
- [ ] Monitoring (Uptime)

## 🎯 Quick Wins

1. **Add Progress Bar** (30 min)
2. **Implement Keyboard Shortcuts** (1 hour) ✅
3. **Add Confirmation Modals** (1 hour) ✅
4. **Network Status Indicator** (30 min) ✅
5. **Loading Skeletons** (2 hours)

## 🔮 Long-term Improvements

1. **PWA Support** (1 week)
   - Service worker
   - Offline mode
   - Install prompt

2. **Advanced Analytics** (1 week)
   - Time per question
   - Answer change tracking
   - Completion rate

3. **Accessibility** (1 week)
   - Screen reader support
   - Keyboard navigation
   - ARIA labels
   - High contrast mode

4. **Performance** (Ongoing)
   - Code splitting
   - Image optimization
   - Caching strategy
   - Bundle size reduction
