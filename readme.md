# 🔐 How to Generate Google Drive Refresh Token (Using OAuth 2.0 Playground)

This guide explains how to generate a **Google Drive refresh token** using the official OAuth Playground.

---

## 🔹 Step 1: Open OAuth Playground

Go to:

👉 [https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)

---

## 🔹 Step 2: Configure OAuth Settings

1. Click the **⚙️ Settings (gear icon)** in the top right corner.
2. Enable:

   * ✅ *Use your own OAuth credentials*
3. Enter your:

   * **OAuth Client ID**
   * **OAuth Client Secret**

You can create these from:

👉 [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)

Make sure:

* Google Drive API is enabled
  👉 [https://console.cloud.google.com/apis/library/drive.googleapis.com](https://console.cloud.google.com/apis/library/drive.googleapis.com)

---

## 🔹 Step 3: Select Google Drive API

On the left side panel:

1. Scroll down to:

   ```
   Drive API v3
   ```
2. Select:

   ```
   https://www.googleapis.com/auth/drive
   ```
3. Click:

   ```
   Authorize APIs
   ```

---

## 🔹 Step 4: Authorize Access

* Choose your Google account
* Click **Allow**
* You will receive an **Authorization Code**

---

## 🔹 Step 5: Exchange Authorization Code

Click:

```
Exchange authorization code for tokens
```

You will now receive:

* Access Token
* Refresh Token

---

## 🔹 Step 6: Copy Refresh Token

Copy the **refresh_token** value.

This token will be used in your backend like this:

```js
oauth2Client.setCredentials({
  refresh_token: "YOUR_REFRESH_TOKEN"
});
```

---

# 📌 Important Notes

* Refresh token does not expire (unless revoked).
* Access token expires in ~1 hour.
* Always keep your refresh token secure.
* Never commit it to GitHub.

---

# 🔗 Official References

* OAuth Playground
  [https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)

* Google Drive API Docs
  [https://developers.google.com/drive/api/v3/about-sdk](https://developers.google.com/drive/api/v3/about-sdk)

* Google Cloud Console
  [https://console.cloud.google.com/](https://console.cloud.google.com/)

