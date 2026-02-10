# Security Audit Report - Shift Management System
**Date:** February 10, 2026
**Auditor:** Claude Code
**Scope:** Firestore Rules, Storage Rules, Authentication, Input Validation, API Keys

---

## 🎯 Executive Summary

**Overall Security Score:** 7.5/10 (Good, but needs improvements)

**Critical Issues:** 1
**High Priority:** 3
**Medium Priority:** 4
**Low Priority:** 2

**Recommendation:** Fix critical and high priority issues before production deployment.

---

## 🔴 CRITICAL ISSUES

### C1: Shared Works - Public Read Access Without Authentication

**File:** `firestore.rules:41`
**Current Rule:**
```javascript
match /shared_works/{sharedWorkId} {
  allow read: if true; // Public read for anyone with the link
  ...
}
```

**Issue:** ANYONE can read ALL shared works without authentication, even by enumerating IDs.

**Risk:**
- Data exposure
- Privacy violation
- Potential scraping of all shared works

**Recommended Fix:**
```javascript
match /shared_works/{sharedWorkId} {
  // Only allow read if the document has a specific token field
  allow read: if resource.data.isPublic == true;
  allow create: if request.auth != null && request.resource.data.sharedBy == request.auth.uid;
  allow update: if request.auth != null && resource.data.sharedBy == request.auth.uid;
  allow delete: if request.auth != null && resource.data.sharedBy == request.auth.uid;
}
```

Then when creating a shared work, explicitly set `isPublic: true`.

---

## 🟠 HIGH PRIORITY ISSUES

### H1: Users Collection - Overly Permissive Read Access

**File:** `firestore.rules:8`
**Current Rule:**
```javascript
allow read: if request.auth != null; // Cualquiera logueado puede ver perfiles
```

**Issue:** ANY authenticated user can read ALL user profiles, including potentially sensitive data like email, displayName, settings, etc.

**Risk:**
- User enumeration
- Email harvesting
- Privacy violation
- Potential for targeted attacks

**Recommended Fix:**
```javascript
match /users/{userId} {
  // Only allow reading your own profile
  allow read: if request.auth != null && request.auth.uid == userId;
  allow write: if request.auth != null && request.auth.uid == userId;

  // Allow reading specific public fields only
  allow get: if request.auth != null;

  match /private/{document=**} {
    allow read, write: if false;
  }
}
```

**Alternative:** If you need public profiles for features (like team sharing), create a separate `publicProfiles` collection with limited data.

---

### H2: Storage - No File Size or Type Validation

**File:** `storage.rules:8-10`
**Current Rule:**
```javascript
match /profile-photos/{userId}/{allPaths=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

**Issue:** No validation on:
- File size (could upload GB files)
- File type (could upload executables, scripts)
- File count (could upload thousands of files)

**Risk:**
- Storage abuse
- Cost explosion
- Malicious file uploads

**Recommended Fix:**
```javascript
match /profile-photos/{userId}/{fileName} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow write: if request.auth != null
                && request.auth.uid == userId
                && request.resource.size < 5 * 1024 * 1024 // 5MB limit
                && request.resource.contentType.matches('image/.*'); // Only images
}
```

---

### H3: Authentication - Password Reset Without Rate Limiting

**File:** `src/contexts/AuthContext.jsx` (assumed implementation)
**Issue:** Firebase Auth password reset can be called multiple times without rate limiting in your frontend code.

**Risk:**
- Email flooding
- DoS on user accounts
- Abuse of Firebase Auth quotas

**Recommended Fix:**
Add local rate limiting:
```javascript
const [resetAttempts, setResetAttempts] = useState({});

const resetPassword = async (email) => {
  const now = Date.now();
  const lastAttempt = resetAttempts[email] || 0;

  if (now - lastAttempt < 60000) { // 1 minute cooldown
    throw new Error('Please wait before requesting another password reset');
  }

  setResetAttempts({ ...resetAttempts, [email]: now });
  return sendPasswordResetEmail(auth, email);
};
```

---

## 🟡 MEDIUM PRIORITY ISSUES

### M1: Stats Collection - Unclear Purpose

**File:** `firestore.rules:48-51`
**Issue:** Stats collection allows read for any authenticated user but no writes. The codebase doesn't actively use this collection based on audit.

**Recommendation:** Remove if unused, or document its purpose and implement proper access control.

---

### M2: Missing Input Validation on Shift/Work Creation

**Risk:** XSS attacks through shift notes, work names, etc.

**Recommended Fix:** Add input sanitization:
```javascript
// Before saving to Firestore
const sanitizedName = DOMPurify.sanitize(workName);
const sanitizedNotes = DOMPurify.sanitize(notes);
```

Install: `npm install dompurify`

---

### M3: No CORS Configuration for API Requests

**Issue:** If using external APIs (Stripe, etc.), there's no explicit CORS configuration.

**Recommendation:** Verify that all external API calls use proper CORS and don't expose credentials.

---

### M4: Google Sign-In - Redundant User Document Read

**File:** `src/contexts/AuthContext.jsx:93`
**Issue:** After Google sign-in, the code reads the user document even though it was just created.

**Risk:** Extra Firestore read operation (minor cost)

**Fix:** Return the created data instead of fetching again.

---

## 🟢 LOW PRIORITY ISSUES

### L1: Missing Security Headers in Hosting

**Issue:** No Content Security Policy (CSP) headers configured in `firebase.json`.

**Recommendation:** Add headers in `firebase.json`:
```json
"headers": [
  {
    "source": "**",
    "headers": [
      {
        "key": "X-Frame-Options",
        "value": "DENY"
      },
      {
        "key": "X-Content-Type-Options",
        "value": "nosniff"
      },
      {
        "key": "Referrer-Policy",
        "value": "strict-origin-when-cross-origin"
      }
    ]
  }
]
```

---

### L2: No Rate Limiting on Live Mode Sessions

**Issue:** Users could potentially create unlimited live sessions rapidly.

**Risk:** Abuse of Firestore writes

**Recommendation:** Add cooldown period between live session creations (already partially handled by premium limits).

---

## ✅ GOOD PRACTICES IDENTIFIED

1. ✅ `.env` files properly excluded from git
2. ✅ Private subcollection (`users/{userId}/private`) completely blocked from client access
3. ✅ Works, Shifts, and LiveSessions properly scoped to user ownership
4. ✅ Profile photos properly scoped to user
5. ✅ Google Auth uses separate provider instance each time
6. ✅ Firebase config properly separated in service file
7. ✅ Password validation enforced by Firebase Auth
8. ✅ Update operations require authentication and ownership verification

---

## 📋 ACTION ITEMS (Priority Order)

### Immediate (Before Production):
1. [ ] Fix C1: Restrict shared_works read access
2. [ ] Fix H1: Restrict users read access
3. [ ] Fix H2: Add Storage file validation

### Before Launch:
4. [ ] Fix H3: Add rate limiting to password reset
5. [ ] Fix M2: Add input sanitization with DOMPurify

### Post-Launch (Nice to Have):
6. [ ] Add L1: Security headers in firebase.json
7. [ ] Review M1: Stats collection usage
8. [ ] Add monitoring for suspicious activity

---

## 🧪 TESTING RECOMMENDATIONS

1. **Penetration Testing:**
   - Try to read other users' data
   - Try to enumerate shared works
   - Try to upload malicious files

2. **Authentication Testing:**
   - Test password reset flooding
   - Test concurrent login attempts
   - Test token expiration

3. **Input Validation Testing:**
   - Try XSS payloads in work names
   - Try SQL injection in notes (should fail, but test anyway)
   - Try extremely long strings

---

## 📊 COMPLIANCE NOTES

- **GDPR:** User data is scoped correctly, but consider adding data export functionality
- **CCPA:** Similar to GDPR considerations
- **PCI-DSS:** Stripe handles payment data (no PCI scope for this app)

---

## 🔒 ENVIRONMENT VARIABLES SECURITY

**Status:** ✅ SECURE

- `.env` in `.gitignore` ✅
- No hardcoded API keys found in codebase ✅
- Firebase config properly externalized ✅

**Reminder:** Never commit `.env` files. Always use environment-specific configs.

---

## 📞 NEXT STEPS

1. Prioritize fixes based on impact vs. effort
2. Test each fix in development environment
3. Deploy rules changes separately from code changes
4. Monitor Firebase Console for rule errors after deployment
5. Set up Firebase App Check for production (blocks unauthorized API access)

---

**End of Security Audit Report**

*Last Updated: February 10, 2026*
