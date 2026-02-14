# Deploying Your Portfolio

Your app is a **Node.js + Express** server with **MongoDB Atlas** and static files. Use a host that runs Node (not static-only).

## Option 1: Render (recommended, free tier)

1. **Push your code to GitHub**
   - Create a repo and push this project (do **not** commit `.env`; it’s in `.gitignore`).
   - Ensure `public/resume.pdf` is in the repo if you want the resume link to work.

2. **Sign up and create a Web Service**
   - Go to [render.com](https://render.com) and sign up (GitHub login is fine).
   - Dashboard → **New** → **Web Service**.
   - Connect your GitHub account and select the portfolio repo.

3. **Configure the service**
   - **Name:** e.g. `mourya-portfolio`
   - **Runtime:** Node
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Plan:** Free

4. **Environment variables**
   - In the service, open **Environment**.
   - Add:
     - **Key:** `MONGO_URI`  
     - **Value:** your MongoDB Atlas connection string (same as in `.env`).
   - Do **not** set `PORT`; Render sets it automatically.

5. **Deploy**
   - Click **Create Web Service**. Render will build and deploy.
   - Your site will be at `https://<your-service-name>.onrender.com`.

6. **MongoDB Atlas (if needed)**
   - In Atlas: **Network Access** → add **0.0.0.0/0** (allow from anywhere) so Render can connect.
   - Keep your database user password safe and only in Render env vars (and local `.env`).

---

## Option 2: Railway

1. Go to [railway.app](https://railway.app) and sign up with GitHub.
2. **New Project** → **Deploy from GitHub repo** → select your portfolio repo.
3. In **Variables**, add `MONGO_URI` with your Atlas connection string.
4. Railway will detect Node and run `npm start`. It will assign a URL like `https://<name>.up.railway.app`.

---

## Option 3: Fly.io

1. Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/) and sign up.
2. In your project folder run:
   ```bash
   fly launch
   ```
   Accept defaults, then add your secret:
   ```bash
   fly secrets set MONGO_URI="your-mongodb-atlas-uri"
   ```
3. Deploy:
   ```bash
   fly deploy
   ```
4. Your app will be at `https://<app-name>.fly.dev`.

---

## After deployment

- **Contact form** and **resume links** use the same origin as your site, so they work without extra config.
- To use a **custom domain**: add it in your host’s dashboard (Render/Railway/Fly) and point DNS as they instruct.
- On the **free tier**, the server may sleep after inactivity; the first request can be slow.

## Checklist before deploy

- [ ] Code is on GitHub (no `.env` or `node_modules` committed).
- [ ] `MONGO_URI` is set in the host’s environment variables.
- [ ] MongoDB Atlas allows connections from anywhere (`0.0.0.0/0`) if required.
- [ ] `public/resume.pdf` exists and is committed if you want the resume link to work.
