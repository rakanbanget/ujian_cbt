# Deployment Checklist

## Pre-Deployment Verification

### Backend Checklist
- [ ] Laravel backend is running
- [ ] Database is migrated and seeded
- [ ] Test user accounts created
- [ ] Ujian records exist in database
- [ ] Soal records exist for each ujian
- [ ] CORS configured for frontend URL
- [ ] Sanctum authentication working
- [ ] All API endpoints tested with Postman

### Frontend Checklist
- [ ] `.env` file configured with correct backend URL
- [ ] All dependencies installed (`npm install`)
- [ ] No build errors (`npm run build`)
- [ ] No TypeScript/ESLint errors
- [ ] All API integrations tested
- [ ] Security features working
- [ ] Timer and auto-submit working

## Backend Configuration

### 1. CORS Configuration
File: `config/cors.php`
```php
'allowed_origins' => [
    'http://localhost:5173',      // Development
    'https://yourdomain.com',     // Production
],
'supports_credentials' => true,
```

### 2. Environment Variables
File: `.env`
```env
APP_URL=http://127.0.0.1:8000
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

### 3. Database
```bash
php artisan migrate
php artisan db:seed
```

### 4. Start Server
```bash
php artisan serve
# Runs at http://127.0.0.1:8000
```

## Frontend Configuration

### 1. Environment Variables
File: `.env`
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_ENV=development
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
# Runs at http://localhost:5173
```

### 4. Build for Production
```bash
npm run build
# Output in dist/ folder
```

## Testing Checklist

### Authentication Testing
- [ ] Login with valid credentials works
- [ ] Login with invalid credentials shows error
- [ ] Token is stored in localStorage
- [ ] Token is sent in Authorization header
- [ ] Logout clears localStorage
- [ ] 401 errors redirect to login

### Exam Selection Testing
- [ ] Exam list loads from API
- [ ] Exam cards display correctly
- [ ] Loading state shows while fetching
- [ ] Error state shows on failure
- [ ] Clicking exam card navigates to exam

### Exam Questions Testing
- [ ] Questions load from API
- [ ] Questions display correctly
- [ ] Images display if present
- [ ] Options are selectable
- [ ] Navigation works (next/previous)
- [ ] Question grid shows status
- [ ] Timer counts down
- [ ] Answers save to localStorage

### Submit Testing
- [ ] Submit button works
- [ ] Confirmation modal appears
- [ ] Answers are sent to API
- [ ] Results display correctly
- [ ] Already submitted error handled
- [ ] LocalStorage cleared after submit
- [ ] Redirects to exam selection

### Security Testing
- [ ] Fullscreen mode activates
- [ ] Tab switch detected (Violation 1)
- [ ] Window blur detected (Violation 2)
- [ ] Fullscreen exit detected (Violation 3)
- [ ] DevTools disabled (F12, Ctrl+Shift+I)
- [ ] Right-click disabled
- [ ] Copy/paste disabled
- [ ] Print disabled
- [ ] Auto-submit on 4th violation
- [ ] Auto-submit on timer expiry

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (optional)

## Common Issues & Solutions

### Issue: CORS Error
**Symptoms**: Network error, CORS policy error in console
**Solution**:
1. Check backend CORS configuration
2. Ensure frontend URL is in `allowed_origins`
3. Restart backend server after config change

### Issue: 401 Unauthorized
**Symptoms**: Redirects to login immediately
**Solution**:
1. Check token is stored: `localStorage.getItem('token')`
2. Check token format: Should be `1|ABC...`
3. Verify Sanctum is configured correctly
4. Check database has valid token

### Issue: Questions Not Loading
**Symptoms**: Loading spinner forever, or error message
**Solution**:
1. Check ujian_id is valid
2. Verify soal records exist in database
3. Check backend logs for errors
4. Test endpoint with Postman

### Issue: Submit Returns 400
**Symptoms**: "Already submitted" error
**Solution**:
1. This is expected if user already took exam
2. Check database for existing submission
3. Frontend shows previous score
4. User cannot retake exam

### Issue: Security Features Not Working
**Symptoms**: Can open DevTools, switch tabs, etc.
**Solution**:
1. Check browser allows fullscreen API
2. Some browsers block certain features
3. Test in different browser
4. Check console for errors

## Production Deployment

### Backend (Laravel)

#### Option 1: Shared Hosting
1. Upload files via FTP
2. Configure `.env` file
3. Run migrations via cPanel/SSH
4. Set document root to `public/`

#### Option 2: VPS/Cloud
```bash
# Clone repository
git clone <repo-url>
cd backend

# Install dependencies
composer install --optimize-autoloader --no-dev

# Configure environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate --force

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chmod -R 775 storage bootstrap/cache
```

### Frontend (React)

#### Option 1: Static Hosting (Netlify, Vercel)
```bash
# Build
npm run build

# Deploy dist/ folder
# Configure environment variables in hosting dashboard
```

#### Option 2: VPS/Cloud
```bash
# Clone repository
git clone <repo-url>
cd frontend

# Install dependencies
npm install

# Build
npm run build

# Serve with nginx or Apache
# Point document root to dist/
```

### Nginx Configuration (Frontend)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Apache Configuration (Frontend)
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /path/to/frontend/dist

    <Directory /path/to/frontend/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Enable React Router
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## Environment-Specific Configuration

### Development
```env
# Frontend .env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_ENV=development
```

### Staging
```env
# Frontend .env
VITE_API_BASE_URL=https://staging-api.yourdomain.com/api
VITE_ENV=staging
```

### Production
```env
# Frontend .env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_ENV=production
```

## Security Considerations

### Backend
- [ ] HTTPS enabled in production
- [ ] Database credentials secured
- [ ] API rate limiting configured
- [ ] CSRF protection enabled
- [ ] SQL injection prevention (use Eloquent)
- [ ] XSS prevention (sanitize inputs)
- [ ] Token expiration configured

### Frontend
- [ ] HTTPS enabled in production
- [ ] Environment variables not exposed
- [ ] No sensitive data in localStorage
- [ ] API calls use HTTPS
- [ ] Content Security Policy configured
- [ ] XSS prevention (React escapes by default)

## Performance Optimization

### Backend
- [ ] Database indexes on frequently queried columns
- [ ] Query optimization (N+1 problem)
- [ ] Response caching where appropriate
- [ ] Gzip compression enabled
- [ ] CDN for static assets

### Frontend
- [ ] Code splitting implemented
- [ ] Images optimized
- [ ] Lazy loading for routes
- [ ] Bundle size optimized
- [ ] CDN for static assets
- [ ] Browser caching configured

## Monitoring & Logging

### Backend
- [ ] Error logging configured
- [ ] Application monitoring (e.g., Sentry)
- [ ] Database query logging
- [ ] API request logging
- [ ] Performance monitoring

### Frontend
- [ ] Error tracking (e.g., Sentry)
- [ ] Analytics (e.g., Google Analytics)
- [ ] Performance monitoring
- [ ] User behavior tracking
- [ ] Console error monitoring

## Backup & Recovery

### Backend
- [ ] Database backup schedule
- [ ] File backup schedule
- [ ] Backup restoration tested
- [ ] Disaster recovery plan

### Frontend
- [ ] Source code in version control
- [ ] Build artifacts backed up
- [ ] Deployment rollback plan

## Post-Deployment

### Immediate
- [ ] Test all critical flows
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify security features
- [ ] Test on multiple devices

### Ongoing
- [ ] Monitor user feedback
- [ ] Track error rates
- [ ] Review performance metrics
- [ ] Update dependencies regularly
- [ ] Security patches applied

## Support & Maintenance

### Documentation
- [ ] API documentation updated
- [ ] User guide created
- [ ] Admin guide created
- [ ] Troubleshooting guide available

### Team Training
- [ ] Developers trained on codebase
- [ ] Admins trained on management
- [ ] Support team trained on common issues

### Contact Information
- **Frontend Issues**: [Your contact]
- **Backend Issues**: [Backend team contact]
- **Infrastructure**: [DevOps contact]
- **Emergency**: [Emergency contact]

## Success Criteria

✅ All tests passing
✅ No critical errors in logs
✅ Performance meets requirements
✅ Security features working
✅ User acceptance testing passed
✅ Documentation complete
✅ Team trained
✅ Monitoring in place
✅ Backup strategy implemented

## Sign-Off

- [ ] Development Team Lead
- [ ] QA Team Lead
- [ ] Security Team
- [ ] Product Owner
- [ ] DevOps Team

---

**Deployment Date**: _____________
**Deployed By**: _____________
**Version**: 1.0.0
**Status**: Ready for Deployment
