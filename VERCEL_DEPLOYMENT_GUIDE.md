# Bro AI — Vercel Deployment Guide (Hinglish)

Ab poora app (frontend + backend dono) **Vercel** par ek hi jagah deploy hoga — Cloudflare Worker ki zaroorat nahi, aur alag URL/CORS setup ki bhi zaroorat nahi (same domain se sab chalega, isliye tez bhi hoga).

## Project structure
```
/
├── index.html
├── manifest.json
├── sw.js
├── icon-192.png
├── icon-512.png
└── api/
    ├── stt.js      ← speech-to-text (Groq Whisper)
    └── chat.js     ← chat reply (Groq Llama)
```

## STEP 1 — Groq API key (agar pehle se nahi hai)
https://console.groq.com > free sign up > API Keys > Create > copy kar lo

## STEP 2 — GitHub repo update karo
Apne existing repo me ye sab files daal do (jo maine di hain) — purani `worker.js` file delete kar sakte ho, ab zaroorat nahi.

Folder structure **exactly waisi honi chahiye** jaisi upar dikhayi hai — `api/` folder root me hona zaroori hai, Vercel isko automatically serverless/edge functions ki tarah detect kar lega.

## STEP 3 — Vercel par deploy karo

1. https://vercel.com par GitHub se sign up karo (free)
2. Dashboard > **"Add New" > "Project"**
3. Apna GitHub repo select karo > **Import**
4. Framework preset: **"Other"** rehne do (koi build command nahi chahiye, static + functions hai)
5. **Deploy** dabao — 30-60 second me live ho jayega

## STEP 4 — GROQ_API_KEY environment variable set karo

1. Vercel Dashboard > apna project > **Settings > Environment Variables**
2. Add: Name = `GROQ_API_KEY`, Value = (Step 1 wali key) > **Save**
3. **Zaroori:** Naya env variable add karne ke baad ek **Redeploy** karna padta hai:
   - Deployments tab > latest deployment ke 3-dot menu > **Redeploy**

## STEP 5 — Test karo

1. Vercel jo live URL dega (e.g. `https://bro-ai.vercel.app`) usko phone pe kholo
2. Settings me **"External Backend URL" field khaali hi rehne do** — Vercel khud `/api/stt` aur `/api/chat` use karega, koi URL bharne ki zaroorat nahi
3. 🎙️ button dabao aur baat karo
4. 🐞 Debug panel se real-time confirm kar sakte ho ki kya ho raha hai

## Phone pe install karna
Chrome > apna Vercel URL kholo > ⋮ menu > "Add to Home screen"

## Agar future me kabhi domain change karo
Kuch change nahi karna padega — kyunki API calls relative path (`/api/...`) use karte hain, wo automatically naye domain pe bhi kaam karenge.

## Free tier limits (Vercel)
Hobby (free) plan: 100 GB bandwidth/month, generous serverless function invocations — personal use ke liye kaafi zyada hai, koi card nahi lagega.
