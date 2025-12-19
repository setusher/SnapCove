# Google OAuth Setup Instructions

## Error: "The given origin is not allowed for the given client ID"

This error occurs because your Google OAuth Client ID needs to have `http://localhost:3000` added to its authorized origins.

## Steps to Fix:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Navigate to APIs & Services > Credentials**
   - Select your project
   - Go to "APIs & Services" > "Credentials"

3. **Find Your OAuth 2.0 Client ID**
   - Look for the client ID: `447171812608-0c66t6gioscl9kl3m5gqqkkj8r4ni29n.apps.googleusercontent.com`
   - Click on it to edit

4. **Add Authorized JavaScript Origins**
   - Under "Authorized JavaScript origins", click "ADD URI"
   - Add: `http://localhost:3000`
   - Add: `http://127.0.0.1:3000` (optional, for consistency)

5. **Add Authorized Redirect URIs** (if needed)
   - Under "Authorized redirect URIs", add:
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`

6. **Save Changes**
   - Click "SAVE" at the bottom

7. **Wait a few minutes**
   - Changes may take a few minutes to propagate

## After Making Changes:

1. Restart your frontend development server
2. Clear your browser cache or use an incognito window
3. Try Google Sign-In again

## Current Client ID:
```
447171812608-0c66t6gioscl9kl3m5gqqkkj8r4ni29n.apps.googleusercontent.com
```

