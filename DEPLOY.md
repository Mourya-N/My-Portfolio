# Deployment Guide: Vercel

Since your portfolio is now a purely client-side React.js application integrated with **EmailJS**, it can be hosted **100% free** on Vercel.

Choose one of the two deployment methods below.

---

## Method A: GitHub Git Integration (Highly Recommended)
This is the best method because Vercel will automatically redeploy your site every time you run `git push` to update your code.

### Step 1: Initialize Git and Push to GitHub
1. If you haven't already, initialize git in your workspace root directory:
   ```bash
   git init
   git add .
   git commit -m "feat: complete SDE portfolio redesign"
   ```
2. Create a new repository on your GitHub account named `My-Portfolio`.
3. Link and push your local repository to GitHub (replace `<your-username>` with your GitHub username):
   ```bash
   git remote add origin https://github.com/<your-username>/My-Portfolio.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Import Project in Vercel Dashboard
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and log in using your GitHub account.
2. Click **Add New...** -> **Project**.
3. Under "Import Git Repository", find `My-Portfolio` and click **Import**.

### Step 3: Configure Build and Project Settings
Vercel will detect the repository. You must configure the subdirectory because the React code is inside the `frontend/` folder:

1. **Framework Preset**: Auto-detected as **Vite** (leave as default).
2. **Root Directory**: Click "Edit" and select **`frontend`** (this is critical!).
3. **Build & Development Settings**: Keep defaults (Build command: `npm run build`, Output directory: `dist`).

### Step 4: Add Environment Variables
Before clicking deploy, expand the **Environment Variables** section and add the keys from your local `frontend/.env` file:

| Key | Value |
| :--- | :--- |
| `VITE_EMAILJS_SERVICE_ID` | `service_jfhk55f` |
| `VITE_EMAILJS_PUBLIC_KEY` | `bR5ND0RD-3oQKJDqb` |
| `VITE_EMAILJS_TEMPLATE_ID` | `template_udz85iw` |

### Step 5: Deploy
1. Click **Deploy**.
2. Vercel will build and publish your portfolio in under a minute.
3. You will receive a production URL (e.g., `https://my-portfolio.vercel.app`).

---

## Method B: Vercel CLI (Quick Command Line Deployment)
This is the fastest method to deploy directly from your local terminal.

### Step 1: Run Vercel CLI
We have launched the command for you in your workspace. If you need to run it again, execute the following command in the **`frontend/`** directory:
```bash
npx vercel
```

### Step 2: Answer the Interactive Prompts
Answer the terminal prompts exactly as follows:
1. `Set up and deploy "~/Documents/VS.Code/My-Portfolio/frontend"?` -> Type **`y`** (Yes) and press Enter.
2. `Which scope do you want to deploy to?` -> Select your personal Vercel scope and press Enter.
3. `Link to existing project?` -> Type **`n`** (No) and press Enter.
4. `What’s your project’s name?` -> Press Enter to accept `frontend` or type `mourya-portfolio`.
5. `In which directory is your code located?` -> Press Enter to accept `./` (since you are inside `frontend/`).
6. Vercel will analyze your code:
   `Auto-detected Project Settings (Vite):`
   - Build Command: `vite build`
   - Development Command: `vite dev`
   - Install Command: `npm install`
   - Output Directory: `dist`
7. `Want to modify these settings?` -> Type **`n`** (No) and press Enter.

### Step 3: Add Environment Variables in Dashboard
CLI deployment does not automatically upload your local `.env` variables for security. You must add them:
1. Go to your project page on the [Vercel Dashboard](https://vercel.com/dashboard).
2. Go to **Settings** -> **Environment Variables**.
3. Add the three keys:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
   - `VITE_EMAILJS_TEMPLATE_ID`
4. Trigger a production redeploy:
   - Go to the **Deployments** tab.
   - Click the three dots next to your latest deployment and select **Redeploy**.

---

## Post-Deployment Checklist
- [ ] Test the contact form to ensure messages send and successfully trigger emails via EmailJS.
- [ ] Click the **View Resume** and **Download PDF** buttons to verify the resume file opens and downloads.
- [ ] Test page speed and mobile display on a physical phone.
- [ ] (Optional) Add a custom domain in Vercel project Settings under the **Domains** tab.
