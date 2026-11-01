---
title: "Buena Tierra Privacy Policy"
updatedAt: "2026-11-01"
---

## Buena Tierra Privacy Policy

**Last Updated:** November 1, 2026

**Buena Tierra** is an Android app built by **FusionCore Apps** ("we", "our", "us"). It records sermons and creates AI summaries. This policy explains what data we use and why. **We do not ask for or store your name, email address or password.**

---

## 1. What Works Offline

Recording, your notes and the Bible work offline. We only need the internet when you request a summary, buy Premium, see ads or send a report.

---

## 2. What Stays on Your Phone

This data is stored on your phone. Our servers do not keep a copy:

- Your audio recordings
- Summaries, notes, the weekly plan and reflections
- Your preferences (for example, the church name you type in Settings)

**We do not send your church name or the preacher's name to our servers.**

If Android backup is on, the system may back up the app's database and settings (not the audio files) to your Google account. Android manages that, not us.

---

## 3. Identifiers We Use

There are no accounts. The app uses these identifiers:

- **Firebase anonymous ID**: a random identifier not linked to your identity.
- **Hashed Android ID**: an irreversible version of your device ID. Used only to prevent abuse of the **2 free summaries**: reinstalling the app does not restore them.
- **Push token (FCM)**: to tell you when your summary is ready. The text of that notification includes the summary's title (the AI generates it from the sermon, and you can edit it later) and is delivered through Firebase Cloud Messaging, by Google.
- **RevenueCat app user ID**: to recognize your Premium purchase.
- **Android advertising ID**: used by Google AdMob, free users only (section 6).

To protect the service from unauthorized use, the app also uses **Firebase App Check** (Play Integrity).

---

## 4. AI Summaries: What Is Sent and How Long It Is Kept

Only when you request a summary:

1. Audio is uploaded from your phone in segments, encrypted in transit (TLS).
2. We join it and send it to our transcription provider (**AssemblyAI**; if unavailable, a backup provider, **Google Speech-to-Text**). It turns the audio into text.
3. The text is sent to our AI summary provider (**Anthropic**; if unavailable, a backup provider, **OpenAI**) to create the summary. The same provider checks the result before it is delivered to you.

How long it stays on the server:

- **Audio**: deleted right after transcription. An automatic rule removes it after 24 hours at the latest, in case something fails.
- **Transcript and summary**: deleted when your phone confirms the download, or after **7 days** at the latest.
- **Transcription provider's copy**: we ask the provider to delete its copy once we have the text, and retry if that fails.
- Server technical logs contain only identifiers and numbers (for example, minutes of audio). They **never** include transcript text or church or preacher names.

We choose AI providers whose API terms exclude training on customer data. Each provider handles data under its own terms and privacy policy (section 7).

---

## 5. In-App AI Reports

If you report an AI result, we store the reason, your optional comment and the reported AI text, together with your anonymous ID. They are deleted automatically after **90 days**. They are used only to review and improve result quality.

---

## 6. Purchases and Ads

### Purchases (Premium)

Purchases go through **Google Play** and **RevenueCat**. RevenueCat receives your user ID, purchase history and subscription status to grant Premium access. **Payment details are handled by Google; the app never sees them.**

### Ads (Free Tier Only)

Free users see **Google AdMob** banners only on **Biblioteca, Biblia and Nota manual**. AdMob may collect the advertising ID, approximate location (from your IP address), your interactions with ads and diagnostics.

- Personalized ads depend on your consent. If you are in the European Economic Area, the UK or Switzerland, you will see a Google consent form (UMP).
- When required by law, **Settings** shows **Opciones de privacidad de anuncios** so you can change your choice.
- You can reset or delete the advertising ID in Android settings (under Google > Ads, or Privacy > Ads, depending on your device).
- **We never send your church or preacher name, or sermon content, to ads.**

More information: [How Google uses information from sites or apps that use our services](https://policies.google.com/technologies/partner-sites).

---

## 7. Third-Party Services

We share only what each service needs to do its job. We do not sell your data.

- **Firebase / Google** (anonymous authentication, App Check, notifications): [Firebase Privacy](https://firebase.google.com/support/privacy)
- **Google Cloud** (our server and temporary storage): [Google Privacy Policy](https://policies.google.com/privacy)
- **AssemblyAI** (transcription): [Privacy Policy](https://www.assemblyai.com/legal/privacy-policy)
- **Google Speech-to-Text** (backup transcription): [Google Privacy Policy](https://policies.google.com/privacy)
- **Anthropic** (AI summaries): [Privacy Policy](https://www.anthropic.com/legal/privacy)
- **OpenAI** (backup AI summaries): [Privacy Policy](https://openai.com/policies/privacy-policy/)
- **RevenueCat and Google Play** (purchases): [RevenueCat](https://www.revenuecat.com/privacy)
- **Google AdMob** (ads): [Google advertising policies](https://policies.google.com/technologies/ads)

---

## 8. How to Delete Your Data

- **In the app**: **Settings > Borrar mis datos**. Data on your phone is deleted immediately. Server data (device record, summary jobs, reports and counters) is deleted within **24 hours**: an automatic process checks for requests every hour.
- **If you already uninstalled the app**: Settings shows a **device code**. Write it down before uninstalling. With that code you can request deletion of your server data through our web deletion form, or write to **support@fusioncoreapps.com** with the code.

What we keep even after you delete your data:

- A minimal anti-abuse record: the hashed Android ID and how many free summaries were used (maximum 2). Without it, deleting data would restore the free summaries.
- Purchase records held by Google and RevenueCat for legal and accounting obligations.

---

## 9. Security

- Encryption in transit (TLS) for communication with our server.
- App verification (App Check) and the anonymous session are checked on every request.
- Server storage is not public, and database rules block direct access from the apps.

No method is 100% secure. If a breach affects you, we will notify you as required by law.

---

## 10. Sensitive Data and Children

- Sermons can reveal religious beliefs. That is why your sermon content lives on your phone (except the audio you choose to send for a summary) and is not used for ads.
- Buena Tierra is not directed to children under **13** and we do not knowingly collect their data. If you believe a child gave us data, write to us and we will delete it.
- If you are in the EEA or the UK, or a California resident, you may have rights to access, correct and delete your data. Write to us to exercise them. We do not sell personal information.

---

## 11. Changes and Contact

If we update this policy, we will post the new version here with a new **Last Updated** date. **Effective date: November 1, 2026.**

**FusionCore Apps**
Email: **support@fusioncoreapps.com**
