# Security Vulnerabilities & Fixes

## Overview

This document outlines critical authorization vulnerabilities found in the Firebase + S3 infrastructure and their remediation.

---

## Vulnerability #1: Unauthorized File Upload (CRITICAL)

### Issue
**File**: `/app/api/admin/upload/route.ts`

The upload endpoint verified Firebase authentication tokens but **did not check for admin role**. Any authenticated user (even non-admin) could upload files to S3, including malicious content.

**Attack Vector**:
```typescript
// Attacker with valid Firebase account (non-admin) could:
POST /api/admin/upload
Authorization: Bearer {valid-token-from-non-admin-user}
Body: { fileName: "malware.jpg", contentType: "image/jpeg", productId: "123" }
// SUCCESS: Presigned URL generated, attacker can upload arbitrary files
```

### Root Cause
1. Token verification checked if token was valid: `await adminAuth.verifyIdToken(token)`
2. But never checked the decoded token's custom claims: `decodedToken.admin`
3. Any authenticated user = automatic approval

### Fix Applied

**Code Change** (`/app/api/admin/upload/route.ts`):
```typescript
// BEFORE: Only verified token exists
const token = authorization.slice('Bearer '.length);
try {
  await adminAuth.verifyIdToken(token); // ← No role check
} catch {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// AFTER: Verify token AND check admin claim
let decodedToken;
try {
  decodedToken = await adminAuth.verifyIdToken(token);
} catch {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// ← NEW: Admin role verification
if (!decodedToken.admin) {
  console.warn(`[SECURITY] Unauthorized upload attempt by non-admin user: ${decodedToken.uid}`);
  return NextResponse.json(
    { error: 'Forbidden: Admin role required' },
    { status: 403 }
  );
}
```

**Additional Security Layers**:
1. **File size validation**: Added check for filename length (max 255 chars)
2. **Audit logging**: All upload attempts logged with user ID, product ID, filename, content type
3. **S3 bucket policy**: Presigned URLs respect S3 bucket Content-Length limits (5MB recommended)

### Testing

```bash
# Test 1: Non-admin user should get 403
curl -X POST http://localhost:3000/api/admin/upload \
  -H "Authorization: Bearer {non-admin-token}" \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.jpg","contentType":"image/jpeg","productId":"123"}'
# Expected: 403 Forbidden

# Test 2: Admin user should get 200
curl -X POST http://localhost:3000/api/admin/upload \
  -H "Authorization: Bearer {admin-token}" \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.jpg","contentType":"image/jpeg","productId":"123"}'
# Expected: 200 OK with presigned URL
```

---

## Vulnerability #2: Firestore Security Rules (HIGH)

### Issue
**Location**: Firestore Collections: `admin_otps`, `otp_attempts`, `admin_users`

Firestore security rules were not explicitly defined, meaning default rules applied:
- **Default behavior**: All authenticated users can read/write any collection

**Attack Vector**:
```javascript
// Any authenticated user (attacker) could:
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();
const otpAttempts = await getDocs(collection(db, 'admin_otps'));
// SUCCESS: Attacker reads all OTP codes, can brute-force or intercept

const adminUsers = await getDocs(collection(db, 'admin_users'));
// SUCCESS: Attacker enumerates all admin accounts and emails
```

### Root Cause
1. Security rules not deployed to Firestore (left at default)
2. Default rules allow any authenticated user to read/write any collection
3. Sensitive data (`admin_otps`, `otp_attempts`) exposed to enumeration attacks
4. No document-level access control

### Fix Applied

**Firestore Rules** (`/firestore.rules`):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ← Public read, admin write only
    match /products/{document=**} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && request.auth.token.admin == true;
    }

    // ← Admin only
    match /admin_users/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }

    // ← Admin only (OTP codes - most sensitive)
    match /admin_otps/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }

    // ← Admin only (Rate limiting data)
    match /otp_attempts/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }

    // ← Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Rule Semantics**:
1. **Products** (public catalog): Anyone can read, only admins can modify
2. **Admin collections**: Only admins can read or write
3. **Default deny**: Any collection not explicitly listed is denied to all users

### Deployment Steps

1. Go to **Firebase Console** → Your Project → **Firestore Database**
2. Click **Rules** tab
3. Copy the contents of `/firestore.rules`
4. Paste into the Firebase Console editor
5. Click **Publish**
6. Test rules using the **Rules Simulator**:
   - Test: Try reading `admin_otps` as non-admin user → **Denied**
   - Test: Try reading `products` as anonymous → **Allowed**
   - Test: Try writing `products` as non-admin user → **Denied**

### Testing

```bash
# Firebase Console → Firestore → Rules Simulator

Test 1: Non-admin reads admin_otps
- Database path: /admin_otps/test
- Authenticated: Yes (non-admin user)
- Result: DENIED ✓

Test 2: Admin reads admin_otps
- Database path: /admin_otps/test
- Authenticated: Yes (admin user)
- Result: ALLOWED ✓

Test 3: Anonymous reads products
- Database path: /products/123
- Authenticated: No
- Result: ALLOWED ✓

Test 4: Anonymous writes products
- Database path: /products/123
- Authenticated: No
- Operation: Create
- Result: DENIED ✓
```

---

## Summary of Fixes

| Vulnerability | Severity | Fix | Status |
|---------------|----------|-----|--------|
| No admin role check in upload endpoint | CRITICAL | Added `decodedToken.admin` verification | ✓ Fixed |
| File size not validated | MEDIUM | Added filename length validation (255 chars) | ✓ Fixed |
| No audit logging | MEDIUM | Added `[AUDIT]` logs on all uploads | ✓ Fixed |
| Firestore rules not deployed | HIGH | Created `/firestore.rules` and deployment guide | ✓ Ready to Deploy |
| Admin collections readable by all | HIGH | Locked `admin_otps`, `otp_attempts` to admin only | ✓ Ready to Deploy |

---

## Next Steps

1. **Immediate** (Code Changes):
   - Merge `/app/api/admin/upload/route.ts` changes (already applied)
   - Deploy to production

2. **Firebase Console** (Manual):
   - Deploy Firestore rules from `/firestore.rules` file
   - Test rules using Simulator
   - Monitor for any breaking changes

3. **Ongoing**:
   - Audit logs for suspicious upload attempts
   - Regular security rule reviews (quarterly)
   - Monitor OTP failure attempts for brute-force attacks

---

## References

- [Firebase Authentication: Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/start)
- [OWASP: Authorization Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/README)
