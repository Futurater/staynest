# Environment Variables Documentation

## Overview
This document lists all environment variables required for StayNest application deployment across different environments.

---

## Environment Variables Table

| Key | Value | Description | Environments | Branch | Notes | Rotation |
|-----|-------|-------------|--------------|--------|-------|----------|
| `ATLASDB_URL` | `mongodb://127.0.0.1:27017/peppyz` (dev) / `mongodb+srv://...` (prod) | MongoDB connection string | Development, Production, Staging | main, develop | Development uses local MongoDB. Production uses Atlas cluster. Update for each environment. | Every 90 days or when credentials compromise |
| `GEMINI_API_KEY` | `yAQ.Ab8RN6Ld-H7fCgAfYJlRBVjR4ZxpMhNST7i4HQa4CB8I9t3RjA` | Google Gemini 2.5 Flash Lite API key | Development, Production, Staging | main, develop | Used for AI chat widget. Keep secret. Verify in Vercel Project Settings. | Every 30 days or quarterly review |
| `CLOUD_NAME` | `dsmyxjjhd` | Cloudinary cloud identifier | Development, Production, Staging | main, develop | Cloudinary account for image uploads. Found in Cloudinary Dashboard. | No rotation needed unless account changes |
| `CLOUD_API_KEY` | `385837184255874` | Cloudinary API key | Development, Production, Staging | main, develop | Used with Cloudinary for secure uploads. Keep secret. | Every 90 days |
| `CLOUD_API_SECRET` | `rBn78qv-1Gr0l0VHNRr7tBj8miknp` | Cloudinary API secret | Development, Production, Staging | main, develop | Highly sensitive - never commit to repo. Store in .env and Vercel only. | Every 60 days (PRIORITY) |
| `SECRET` | `your_secret_key_here` | Express session encryption secret | Development, Production, Staging | main, develop | Used for session signing and CSRF protection. Must be strong and unique per environment. | Every 30 days (rotate in Vercel) |
| `NODE_ENV` | `development` (dev) / `production` (prod) | Application environment | Development, Production, Staging | main (production), develop (staging) | Controls debug logging, error handling, and optimization. Set to "production" on Vercel. | Update per deployment environment |
| `PORT` | `8080` | Server listening port | Development, Production, Staging | main, develop | Local development: 8080. Vercel: auto-assigned (ignore this). | No rotation - environment specific |

---

## Deployment Environment Configuration

### 🔧 Development (Local Machine)
```env
ATLASDB_URL=mongodb://127.0.0.1:27017/peppyz
GEMINI_API_KEY=yAQ.Ab8RN6Ld-H7fCgAfYJlRBVjR4ZxpMhNST7i4HQa4CB8I9t3RjA
CLOUD_NAME=dsmyxjjhd
CLOUD_API_KEY=385837184255874
CLOUD_API_SECRET=rBn78qv-1Gr0l0VHNRr7tBj8miknp
SECRET=your_secret_key_here
NODE_ENV=development
PORT=8080
```
**Branch:** `develop`  
**Contact:** Local developer  
**Rotation:** As needed for testing

---

### 📤 Vercel Production
**Branch:** `main`  
**URL:** Will be provided by Vercel after deployment  

Set in Vercel Project Settings → Environment Variables:
```
ATLASDB_URL = [Production MongoDB Atlas URL]
GEMINI_API_KEY = yAQ.Ab8RN6Ld-H7fCgAfYJlRBVjR4ZxpMhNST7i4HQa4CB8I9t3RjA
CLOUD_NAME = dsmyxjjhd
CLOUD_API_KEY = 385837184255874
CLOUD_API_SECRET = rBn78qv-1Gr0l0VHNRr7tBj8miknp
SECRET = [Generate strong random secret for production]
NODE_ENV = production
```

---

### 🧪 Staging
**Branch:** `develop`  
**Contact:** DevOps Team  

Use separate staging credentials to avoid production data pollution.

---

## Security Guidelines

### 🔐 Do's:
- ✅ Store sensitive keys in `.env` locally (never commit)
- ✅ Use Vercel's encrypted environment variable storage for production
- ✅ Rotate secrets every 30-90 days
- ✅ Use unique `SECRET` for each environment
- ✅ Enable branch-specific environment variables in Vercel
- ✅ Log rotation dates and changes
- ✅ Use MongoDB Atlas with IP whitelist for production

### ❌ Don'ts:
- ❌ Never commit `.env` to git repository
- ❌ Never share API keys via Slack/Email
- ❌ Never use same credentials across environments
- ❌ Never hardcode values in application code
- ❌ Never expose values in public repos or screenshots

---

## Rotation Schedule

| Variable | Frequency | Last Rotated | Next Rotation | Owner |
|----------|-----------|-------------|---------------|-------|
| `CLOUD_API_SECRET` | 60 days | 2026-04-24 | 2026-06-23 | Security Team |
| `SECRET` | 30 days | 2026-04-24 | 2026-05-24 | DevOps Team |
| `GEMINI_API_KEY` | 90 days | 2026-04-24 | 2026-07-23 | API Admin |
| `CLOUD_API_KEY` | 90 days | 2026-04-24 | 2026-07-23 | Cloudinary Admin |

---

## How to Update Environment Variables

### Local Development:
1. Edit `.env` file in project root
2. Restart application: `npm start`
3. Changes take effect immediately

### Vercel Production:
1. Go to https://vercel.com/dashboard
2. Select `staynest` project
3. Go to Settings → Environment Variables
4. Update or add variables
5. Redeploy from main branch (or auto-deploys on next git push)

### How to Add New Variable:
1. Add to `.env` (local development)
2. Add to `.env.example` (template for team)
3. Add to Vercel Project Settings
4. Update this documentation file
5. Commit all changes to git

---

## Troubleshooting

### Issue: "Cannot find API key"
**Solution:** Verify `GEMINI_API_KEY` is set in `.env` and restart server

### Issue: "Database connection failed"
**Solution:** Check `ATLASDB_URL` format and MongoDB service is running

### Issue: "Image uploads not working"
**Solution:** Verify all `CLOUD_*` variables are correct and Cloudinary account is active

### Issue: "Vercel deployment fails"
**Solution:** Ensure all variables are set in Vercel Project Settings matching `.env.example`

---

## Contact Information

- **Database Issues:** MongoDB Admin / Database Team
- **API Keys (Gemini):** Google Cloud Console Admin
- **Image Uploads:** Cloudinary Account Owner (santo)
- **Secrets/Security:** Security Team / DevOps
- **Vercel Deployment:** Vercel Project Owner

---

**Last Updated:** 2026-04-24  
**Version:** 1.0  
**Status:** Active
