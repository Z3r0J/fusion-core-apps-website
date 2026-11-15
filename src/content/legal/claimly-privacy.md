---
title: "Claimly Privacy Policy"
updatedAt: "2026-11-14"
---

## Claimly Privacy Policy

**Last Updated:** November 14, 2026

Thank you for using **Claimly**, developed by **FusionCore Apps** ("we", "our", "us").
This Privacy Policy explains how we handle your information when you use Claimly — an Android app (package `com.fusioncoreapps.claimly`) to track warranties and receipts. **Claimly has no user accounts: we never ask for your name, email address or password.** Your products, warranties and receipts are stored on your device, not on our servers.

---

## 1. What Stays on Your Device

The following data is created and stored **only on your device** (in the app's local database and app storage). We do not receive a copy:

- Your products, warranties, categories, notes, prices and purchase dates
- Receipt photos and the attachments you add (photos and documents)
- Your app settings (theme, currency, reminder preferences)

**Backups:** Claimly lets you export a backup as a local **.zip file**. You create it, and you decide where to save or share it. We never receive your backup files. If you save one to a cloud service or send it to someone, that service's or person's terms apply.

---

## 2. Receipt Scanning (OCR): What Is Sent and How Long It Is Kept

Receipt scanning is **optional** — you can always enter products manually. Only when you scan a receipt:

1. A resized copy of the photo (a JPEG of about 800 pixels) and the names of your categories are sent over an encrypted connection (**HTTPS**) to our own API endpoint, hosted on **Expo (EAS Hosting)**.
2. Our endpoint forwards them to **OpenAI** (API, model `gpt-4.1-mini`) to extract the store, date, product and price, and suggest a category.
3. The extracted fields are returned to your device, where you review and edit them before saving.

How long it is kept:

- **Our server does not store the image.** It only passes the request to OpenAI and returns the result to your device.
- **OpenAI** acts as our service provider (processor). Under OpenAI's API data policy, it **does not use API data to train its models** and may retain inputs for up to **30 days** for abuse monitoring, after which they are deleted.
- The receipt photo you keep in the app stays on your device (see Section 1).

Anything printed on the receipt is part of the photo that is sent, so it may include other details shown on it (for example, a store loyalty number). Only the store, date, product and price are extracted.

---

## 3. Purchases (Claimly Premium)

Purchases are processed by **Google Play** and **RevenueCat**. RevenueCat receives an anonymous app user ID, your purchase history and your subscription status so that Premium can be unlocked on your device. **Payments are handled by Google Play — we never see or store your card details.**

---

## 4. Advertising Data (Free Tier Only)

The free version of Claimly shows ads served by **Google AdMob**. Premium users do not see ads. AdMob may collect:

- Device and advertising identifiers (e.g., the Android Advertising ID)
- Approximate location derived from your IP address
- App interactions (including interactions with ads) and diagnostics

This data is shared with **Google** for advertising, analytics and fraud prevention.

- Where required by law (for example, in the European Economic Area, the UK or Switzerland), you will see a Google consent form (UMP) before personalized ads are shown.
- You can reset or delete your advertising ID, or opt out of personalized ads, in your Android settings (under Google > Ads, or Privacy > Ads, depending on your device).
- We never send your products, warranties or receipts to ad networks.

More information: [How Google uses information from sites or apps that use our services](https://policies.google.com/technologies/partner-sites).

---

## 5. Analytics and Crash Reports

- **Firebase Analytics (Google)** collects app interaction events (for example, which screens and features are used), device information (such as device model, OS version and an app-instance identifier) and purchase events (such as `in_app_purchase`). We use it to understand how the app is used and improve it.
- **Sentry** collects crash logs and diagnostics (error details, device and OS information, app version and performance data) so we can find and fix bugs.

This data is not linked to your name or email — Claimly does not collect them.

---

## 6. Notifications

Warranty expiry reminders are **local notifications**, scheduled on your device. Claimly does not use push notifications: **no push token is created or sent to any server**, and your warranty data is not sent anywhere to schedule reminders.

---

## 7. App Permissions

- **Camera** — only to take photos of receipts and products.
- **Notifications** — to show warranty expiry reminders. Claimly also uses Android's alarm and "run at startup" permissions only to deliver those reminders on time and reschedule them after your device restarts.
- **Photos and files** — Claimly uses the Android photo and file pickers, so it only accesses the specific photos or documents you choose to attach.

Claimly does **not** request access to your microphone, location or contacts.

---

## 8. How We Use Your Information

We use the data described above only to:

- **Extract receipt details** when you choose to scan a receipt
- **Unlock and verify Premium** purchases
- **Show ads** to free-tier users (subject to your consent where required)
- **Understand app usage and fix crashes** through analytics and crash reports

We do **not** sell or rent your data to any third party.

---

## 9. Third-Party Services We Share Data With

We share only the data each service needs to do its job:

- **Expo (EAS Hosting)** — hosts our receipt-scanning API endpoint. [Expo Privacy Policy](https://expo.dev/privacy)
- **OpenAI** — extracts receipt details from scanned photos (API). [OpenAI Privacy Policy](https://openai.com/policies/privacy-policy/) · [OpenAI API data usage](https://platform.openai.com/docs/guides/your-data)
- **Google AdMob** — ads for free-tier users:
  - [Google Privacy Policy](https://policies.google.com/privacy)
  - [Google Ads Technologies](https://policies.google.com/technologies/ads)
  - [Google AdMob Program Policies](https://support.google.com/admob/answer/6128543)
- **Firebase Analytics (Google)** — app analytics. [Firebase Privacy & Security](https://firebase.google.com/support/privacy)
- **RevenueCat & Google Play Billing** — purchases and subscription status:
  - [RevenueCat Privacy Policy](https://www.revenuecat.com/privacy)
  - [Google Privacy Policy](https://policies.google.com/privacy)
- **Sentry** — crash reports and diagnostics. [Sentry Privacy Policy](https://sentry.io/privacy/)

We may also disclose information if required by law (e.g., subpoena, court order).

---

## 10. Data Retention & Deletion

- **Data on your device**: delete any product in the app to remove it together with its warranties, receipt photos and attachments. To delete everything at once, clear the app's data (Android Settings > Apps > Claimly > Storage > Clear data) or uninstall Claimly. Backup .zip files you exported are not deleted automatically — delete them wherever you saved them.
- **Receipt scans**: our server keeps no copy of the image. Inputs sent to OpenAI are deleted automatically within **30 days**.
- **Analytics, crash and subscription data** held by our service providers (Firebase, Sentry, RevenueCat): email **support@fusioncoreapps.com** to request deletion. Because Claimly has no accounts, please include the approximate dates you used the app and, if you bought Premium, your Google Play order ID so we can locate your records. We will process your request within **30 days**. Purchase records that Google and RevenueCat must keep for legal and accounting obligations may be retained.
- **Advertising ID**: you can reset or delete it at any time in your Android settings (see Section 4).

---

## 11. Data Security

- All communication between the app and our server and service providers is **encrypted in transit** (HTTPS/TLS).
- Your products, warranties and receipts stay on your device, protected by your device's security settings.

No method of transmission or storage is 100% secure. We apply reasonable safeguards and will notify affected users of any breach as required by applicable law.

---

## 12. Your Rights & Choices

- **Camera & Notifications**: revoke these permissions at any time in your device's system settings.
- **Receipt scanning**: you can skip scanning and enter products manually.
- **Ad personalization**: opt out or reset your advertising ID in your Android settings, and in your Google account's Ads Settings.
- **Data deletion**: see Section 10.

If you are located in the **European Economic Area (EEA) or the United Kingdom**, you may also have the right to access, correct, object to, or restrict processing of your personal data under the GDPR or UK GDPR. If you are in **Brazil**, you have similar rights under the LGPD (Law No. 13,709/2018). If you are a **California resident**, you may have additional rights under the CCPA/CPRA, including the right to know, delete, and opt out of the sale of personal information (we do not sell personal information). Contact us to exercise any of these rights.

---

## 13. Children's Privacy

Claimly is **not directed to children under 13**, and we do not knowingly collect personal data from them. If you believe a child under 13 has provided data through our app, please contact us and we will delete it promptly.

---

## 14. International Data Transfers

Our service providers (Expo, OpenAI, Google, RevenueCat and Sentry) may store and process data on servers located outside your country of residence. We rely on their compliance frameworks (including Standard Contractual Clauses where applicable) to ensure appropriate safeguards are in place.

---

## 15. Changes to This Policy

We may update this Privacy Policy from time to time. When we do, we will post the revised policy here with a new **Last Updated** date. Your continued use of Claimly after changes are posted constitutes acceptance of the revised policy. **Effective date: November 14, 2026.**

---

## 16. Contact Us

If you have questions, concerns, or a data deletion request, please contact us:

**FusionCore Apps**
Email: **support@fusioncoreapps.com**
