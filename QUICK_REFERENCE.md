# Login System - Quick Reference

## What Changed

### Before:
- Login page had 3 separate buttons: Participant, Volunteer, Staff
- User selected role before logging in
- No authentication logic (just frontend routing)

### After:
- Login page has 2 buttons: "Participant / Volunteer" and "Staff"
- User logs in with email/password
- Backend checks database to determine if user is PARTICIPANT or VOLUNTEER
- System automatically routes user to correct page based on their database role

---

## Key Features

✅ **Single Login Button for Participants & Volunteers**
- Combined into "Participant / Volunteer" button
- Database determines actual role after authentication

✅ **Dynamic Role Detection**
- Backend checks `User.role` from database
- PARTICIPANT or VOLUNTEER → redirects to `/calendar`
- STAFF → redirects to `/staff`

✅ **Better UX**
- Loading spinner during login
- Error messages for failed logins
- Disabled inputs while processing
- Auth token stored for future requests

---

## Files Modified/Created

| File | Action | Purpose |
|------|--------|---------|
| `app/page.tsx` | Modified | Updated login UI and added auth logic |
| `app/api/auth/login/route.ts` | Created | New authentication endpoint |
| `AUTH_IMPLEMENTATION.md` | Created | Detailed implementation guide |
| `QUICK_REFERENCE.md` | Created | This file |

---

## How It Works

```
User Clicks "Participant/Volunteer" or "Staff"
        ↓
User enters email/password (+ access code if staff)
        ↓
Form submitted to /api/auth/login
        ↓
Backend checks database for user
        ↓
IF Staff: Validates access code
        ↓
IF Everything OK: Returns user role from database
        ↓
Frontend checks userRole:
  - "PARTICIPANT" or "VOLUNTEER" → Go to /calendar
  - "STAFF" → Go to /staff
        ↓
Token stored in localStorage for future API calls
```

---

## Important Notes

### What Still Needs Implementation

⚠️ **Password Hashing** - Currently just string comparison
- Install: `npm install bcrypt`
- Use in registration: hash password before storing
- Use in login: compare with hashed password

⚠️ **JWT Tokens** - Currently using simple base64 encoding
- Install: `npm install jsonwebtoken`
- Better for security and expiration

⚠️ **Staff Access Code** - Currently checks environment variable
- Store codes in database instead
- Add expiration/revocation system

### What's Working

✅ Database role-based routing
✅ Email/password authentication flow
✅ Error handling and user feedback
✅ Loading states
✅ Token generation and storage

---

## Testing Checklist

Before going to production:

- [ ] Test login with participant account → redirects to `/calendar`
- [ ] Test login with volunteer account → redirects to `/calendar`
- [ ] Test login with staff account → redirects to `/staff`
- [ ] Test invalid email → shows error
- [ ] Test invalid password → shows error
- [ ] Test staff without access code → shows error
- [ ] Test staff with wrong access code → shows error
- [ ] Verify token is stored in localStorage
- [ ] Verify other pages can access the token
- [ ] Test logout functionality (when implemented)

---

## Environment Variables

Add to `.env.local`:

```env
# Staff Access Code (temporary - move to database)
STAFF_ACCESS_CODE=your-access-code

# JWT Secret (for token generation)
JWT_SECRET=your-very-secret-key

# Database URL
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

---

## Next Steps

1. **Implement Password Hashing**
   - Add bcrypt for secure password storage

2. **Implement JWT Tokens**
   - Replace simple tokens with JWT

3. **Add Logout**
   - Create `/api/auth/logout` endpoint
   - Clear localStorage token

4. **Add Session Middleware**
   - Verify token on protected routes
   - Redirect to login if token expired

5. **Add User Registration**
   - Create registration page
   - Implement email verification

---

## API Reference

### Login Endpoint

**POST** `/api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "participant-volunteer",
  "accessCode": null
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "token": "dXNlcmlkOmxvbmdudW1iZXI=",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "User Name"
  },
  "userRole": "PARTICIPANT"
}
```

**Response (Error - 401/403):**
```json
{
  "error": "Invalid email or password"
}
```

---

## File Locations

```
platform-one/
├── app/
│   ├── page.tsx                    # Updated login page
│   ├── api/
│   │   └── auth/
│   │       └── login/
│   │           └── route.ts        # NEW - Auth endpoint
│   ├── calendar/
│   │   └── page.tsx                # Participant/Volunteer view
│   └── staff/
│       └── page.tsx                # Staff view
├── AUTH_IMPLEMENTATION.md          # NEW - Full guide
├── QUICK_REFERENCE.md              # NEW - This file
└── prisma/
    └── schema.prisma               # Database schema (no changes)
```

---

## Troubleshooting

**Q: User logs in but gets redirected to wrong page**
- Check database `User.role` value for that email
- Ensure role is exactly: `PARTICIPANT`, `VOLUNTEER`, or `STAFF`

**Q: Login fails with "Invalid email or password"**
- Verify user exists in database with that email
- Check if password validation is working (currently no hashing!)

**Q: Staff login shows "Invalid access code"**
- Check `STAFF_ACCESS_CODE` environment variable is set
- Verify access code in request matches exactly

**Q: Token not persisting**
- Check browser localStorage is enabled
- Verify `/api/auth/login` returns token in response
- Check browser console for errors

---

## Support

For detailed information, see `AUTH_IMPLEMENTATION.md`
