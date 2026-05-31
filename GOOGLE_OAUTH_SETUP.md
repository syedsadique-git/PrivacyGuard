# Google OAuth Setup Guide

## ⚠️ Current Issue

You're seeing this error when trying to sign in with Google:

```
Access blocked: Authorization Error
Error 400: origin_mismatch
```

This happens because the JavaScript origins aren't registered in Google Cloud Console.

---

## 🔧 How to Fix

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/apis/credentials

### Step 2: Find Your OAuth Client
Look for the OAuth 2.0 Client ID:
- **Client ID**: `158360802968-9roe4sdivg5nj8b138bplc5fppmhjb4s`

Click on it to edit.

### Step 3: Add Authorized JavaScript Origins

Add these URLs to the **Authorized JavaScript origins** section:

```
http://localhost:5174
http://localhost:5173
http://localhost:3001
```

### Step 4: Add Authorized Redirect URIs

Add these URLs to the **Authorized redirect URIs** section:

```
http://localhost:5174/auth/google/callback
http://localhost:5173/auth/google/callback
http://localhost:3001/api/auth/google/callback
```

### Step 5: Save Changes

Click **Save** at the bottom of the page.

### Step 6: Wait & Test

- Wait 1-2 minutes for changes to propagate
- Refresh your browser at http://localhost:5174
- Try "Sign in with Google" again

---

## ✅ Alternative: Use Email/Password Login

While you fix Google OAuth, you can use the regular email/password login:

**Demo Account**:
- Email: `demo@privacyguard.com`
- Password: `demo1234`

This works immediately without any additional setup!

---

## 📝 For Production Deployment

When you deploy to GitHub Pages, you'll need to add:

**Authorized JavaScript origins**:
```
https://syedsadique-git.github.io
```

**Authorized redirect URIs**:
```
https://syedsadique-git.github.io/PrivacyGuard/auth/google/callback
```

---

## 🔍 Troubleshooting

### Still getting errors after adding origins?

1. **Clear browser cache** and cookies
2. **Wait 5 minutes** - Google changes can take time to propagate
3. **Check the exact URL** - Make sure you're using http://localhost:5174 (not 5173)
4. **Try incognito mode** - This avoids cached OAuth tokens

### Can't find the OAuth Client?

1. Make sure you're logged into the correct Google account
2. Check you're in the right Google Cloud project
3. The client ID should start with `158360802968-`

---

## 📚 More Information

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Common OAuth Errors](https://developers.google.com/identity/protocols/oauth2/web-server#error-codes)

---

**Last Updated**: May 30, 2026
