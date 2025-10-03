# 🚂 Railway Deployment Instructions

## Option 1: Railway Dashboard (Recommended)

### Step 1: Access Railway Dashboard
1. Go to: https://railway.app/dashboard
2. You should see your project: **"amiable-forgiveness"**

### Step 2: Deploy Backend Service
1. Click **"New"** → **"GitHub Repo"**
2. Select your **memora/peeps repository**
3. **Important**: Set the **"Root Directory"** to `/backend`
4. Click **"Deploy"**

### Step 3: Configure Environment Variables
1. In your new service, go to **"Variables"** tab
2. Add these environment variables:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_1hUCmTENZ9zr@ep-proud-resonance-a19sl1ld-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   FIREBASE_PROJECT_ID=memora-8b99d
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyCjLslFK7+KNF\nHQ6mbIz7vQU4igp+L89F5+siCy2gI+62n/IwgPiygQAtRGroIeWy+Rh6p2O5QT23\nSC/FfmkuT1Bh4kk5tCjWF3CvM76CflFSgmixCIrCy+ztziKlWFS9zy+kGPT8Zpkk\nEaiJ2RFJAIhPrpp6nD/CGWDG9maCQsRp0Ri0edxqX3cYBlVj7BQRmwKo7sg39Gja\nJiceqeOvttbKF9fjQbQ791SWB6D3D+G/lEuo5KP56cRwFBTv8kee1jej86WmmHQX\nrrG9z8FJS3WXILdf45uXhMSO2kn2l6/MRsIZecSpIMB1NgvSmJOz4jlwwf+kOLqT\ntbh1FKljAgMBAAECggEAS0ul6sj1znpibnXR/s9Utphjr1wuANzuX4WsOxsYIixg\nJgsx7ZJ122RUM1DGl8LSNqVDVYgaVDxDwhI85dzG1eeEOsltJ4LKbHTAWtBa5yxN\n70OozAotSSHeY1o069GWESog31kQrvgjFw6CxT2wojuf6ncQ7P7MtiVueOa3RqoK\ncG7lRXd8i0cleA+V3RAMSz7DqUY3583g5hihAX9WhV5wuhBuHkBefli+KaBeBjdy\nMRndey3steYxMZk8qJKY6glpAR1jismlKRYJPcidkC1ZNNXULnCLgEXufATtryIp\nXmR0UDWhREOa/FBkIJBvfrhMF9Oj5CLRQ6FdFAjegQKBgQDaT4BrdDG4pBubExl9\ndNsN2RCuNfbmMWC/szRihMXG+DHu+E5cnIZR2QfbXGahtkRLQbWh/2vBSzmXqSYw\nV0K4RzAm/lF35EP8nrnPaYXBqHDAgzgKuMj4W84ykx2mRjS9hDrXuHtgLnP2oVtJ\nEnu8BGcY6F+SQFXxhv2rUz0h4wKBgQDQxuJt82xsvBpyJTcMmli+/xgb7m1rMxM1\nZvA5fH49SXthx/n/oJQ0uqRSWbTgglGBxPm5fPVXj6QY9S5Z6ys7AidfuCmkgUM3\n3mEgdGx5iCzwmsFJJsM05t0jk6hXMVnPxhoDUfilzx6kk/e40S9+rX4Q48pFFa8m\nexCTTirygQKBgQCPX8EmUPRKoDSlHuERvMoUiSdkUnqpaWpx296eiTZe2yfoGtlU\nB1RLsq5vSXr533twtWH1V4tMMfxL90HmY5ik79PW+BVHGPnxkcjUSCgZLGeId2U5\n3WvXeGuuWWISjm8avBntDPKyEzADnKsYDXSH4ZhYClyh73DCI/a7KvquIwKBgHQU\n0RsfSL7gi7fBt2z7eLKhtW76T75WBK0hkhn0fWBoNgD1JqyaRS1YRTtAg5B9BQKp\nWcxnjSZlSHFUCbSXTE8f8HKJPCYqdQxgShK4iQO90nbpJOUed1U3s+cvF197ohsj\nY51K+3x9v+T0HL2XGdhOcJTFgtaMqvkzXdD5mmmBAoGBAIqcbjjoC7yvezV8JAbh\nct6tQdZFv/40Sn0/NrKn1xOlJwe+Okhom9k3XnCV/2ugxa3EwUvmlaUwDoYbprwH\nvcjTLU8ES1v6EAUgVloorOmUgy3TGAY3rErTeKwdkBNpRmH743KSZvurULs5a4Pc\nsIzU/+HVWeHI9PLy3dlDlU13\n-----END PRIVATE KEY-----\n
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@memora-8b99d.iam.gserviceaccount.com
   PORT=3001
   NODE_ENV=production
   ```

### Step 4: Get Your Railway URL
1. After deployment completes, go to the **"Settings"** tab
2. Look for **"Domains"** section
3. Copy the **generated Railway URL**
4. It will look like: `https://memora-backend-production-xxxxx.up.railway.app`

### Step 5: Setup Database
1. In Railway dashboard, click **"Deploy"** tab
2. Once deployment is successful, click **"View Logs"**
3. Open a new terminal and run:
   ```bash
   cd backend
   railway run npx prisma db push
   ```

---

## Option 2: Command Line (Alternative)

If the dashboard method doesn't work, try:

```bash
cd backend

# Initialize new Railway project
railway init

# Follow prompts to create new service
# Deploy
railway up

# Get the URL
railway status
```

---

## 🎯 Expected Result

After deployment, you'll get a URL like:
```
https://memora-backend-production-xxxxx.up.railway.app
```

**Your VITE_API_BASE_URL should be:**
```
https://your-railway-url.up.railway.app/api
```

---

## 🔧 Troubleshooting

### If deployment fails:
1. Check the **"Deploy"** logs in Railway dashboard
2. Ensure `package.json` has correct scripts
3. Verify environment variables are set

### If database connection fails:
1. Run `railway run npx prisma db push` after deployment
2. Check DATABASE_URL format in environment variables

### Common issues:
- **Build fails**: Check Node.js version in `package.json`
- **Database errors**: Verify Neon database URL
- **Firebase errors**: Check Firebase service account key format