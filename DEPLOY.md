# Deploy to Cloudflare Pages (auto on push to main)

Every push to `main` (or `master`) rebuilds and ships the site via GitHub Actions → Cloudflare Pages. No card required. Free unlimited bandwidth + free custom domain.

## One-time setup

### 1. Push this repo to GitHub
```powershell
cd C:\Users\Shashank.sj\Downloads\shashank-portfolio
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

### 2. Create the Cloudflare Pages project (only needed once)
1. Sign up at https://dash.cloudflare.com (free, no card).
2. Open **Workers & Pages** → **Create** → **Pages** → **Create using direct upload**.
3. Project name: **`shashank-portfolio`** (must match the `--project-name` in `.github/workflows/deploy.yml`).
4. Click **Create project** and skip the upload step — the GitHub Action will push the first build.

### 3. Get your Cloudflare credentials
- **Account ID:** dashboard right sidebar → **Account ID** → copy.
- **API Token:**
  1. https://dash.cloudflare.com/profile/api-tokens → **Create Token**.
  2. Use the **"Edit Cloudflare Workers"** template (or custom: permissions `Account → Cloudflare Pages → Edit`).
  3. Copy the token (shown once).

### 4. Add the secrets to GitHub
In your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**

| Name                     | Value                          |
|--------------------------|--------------------------------|
| `CLOUDFLARE_API_TOKEN`   | the token from step 3          |
| `CLOUDFLARE_ACCOUNT_ID`  | the account ID from step 3     |

### 5. Push to trigger the first deploy
```powershell
git commit --allow-empty -m "trigger first deploy"
git push
```

Watch it run: **GitHub repo → Actions tab → Deploy to Cloudflare Pages**.
First build takes ~1–2 minutes. After that, your site is live at:

```
https://shashank-portfolio.pages.dev
```

## Every subsequent push
Just `git push` to `main` or `master`. The workflow rebuilds and redeploys automatically. PRs and other branches deploy as **preview environments** with their own URLs.

## Custom domain (optional, free)
Cloudflare dashboard → Pages → `shashank-portfolio` → **Custom domains** → add your domain. Cloudflare auto-issues SSL.

## Local commands
```powershell
cd portfolio
npm run dev      # http://localhost:4321
npm run build    # outputs to portfolio/dist
npm run preview  # preview the production build
```
