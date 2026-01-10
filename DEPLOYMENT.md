# Deploying to Cloudflare Pages with blogfromhell.com

This guide will walk you through deploying your Next.js blog to Cloudflare Pages and connecting your custom domain `blogfromhell.com`.

## Prerequisites

1. A GitHub, GitLab, or Bitbucket account (to host your code)
2. A Cloudflare account with `blogfromhell.com` already added
3. Your domain DNS managed by Cloudflare

## Step 1: Push Your Code to GitHub

1. If you haven't already, initialize a git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub (e.g., `blogfromhell`)

3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/blogfromhell.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Cloudflare Pages

1. **Log into Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to **Pages** in the sidebar

2. **Create a New Project**
   - Click **Create a project**
   - Click **Connect to Git**
   - Authorize Cloudflare to access your Git provider
   - Select your repository (`blogfromhell`)

3. **Configure Build Settings**
   - **Project name**: `blogfromhell` (or your preferred name)
   - **Production branch**: `main` (or `master`)
   - **Framework preset**: `Next.js` (or `Static HTML` since we're using static export)
   - **Build command**: `npm run build`
   - **Build output directory**: `.next` (Next.js standard build output directory)
   - **Root directory**: `/` (leave as default)

4. **Environment Variables** (if needed)
   - Add any environment variables your app requires
   - For now, you can skip this step

5. **Click "Save and Deploy"**
   - Cloudflare will start building your site
   - This may take a few minutes

## Step 3: Connect Your Custom Domain

1. **In Cloudflare Pages Dashboard**
   - Go to your project settings
   - Click on **Custom domains** tab
   - Click **Set up a custom domain**

2. **Add Your Domain**
   - Enter `blogfromhell.com`
   - Cloudflare will automatically configure DNS records
   - You can also add `www.blogfromhell.com` if desired

3. **DNS Configuration**
   - Cloudflare will create a CNAME record automatically
   - If you need to do it manually:
     - Go to **DNS** in your Cloudflare dashboard
     - Add a CNAME record:
       - **Name**: `@` (or leave blank for root domain)
       - **Target**: Your Pages URL (e.g., `blogfromhell.pages.dev`)
       - **Proxy status**: Proxied (orange cloud)

4. **SSL/TLS Settings**
   - Go to **SSL/TLS** in Cloudflare dashboard
   - Set encryption mode to **Full** or **Full (strict)**
   - Cloudflare will automatically provision SSL certificates

## Step 4: Wait for Deployment

- The first deployment may take 5-10 minutes
- Subsequent deployments are faster
- You'll receive a notification when deployment is complete

## Step 5: Verify Your Site

1. Visit `https://blogfromhell.com` in your browser
2. Your site should be live!

## Troubleshooting

### Build Fails
- Check the build logs in Cloudflare Pages dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility (Cloudflare Pages uses Node.js 18 by default)

### Domain Not Working
- Wait 5-10 minutes for DNS propagation
- Check DNS records in Cloudflare dashboard
- Ensure SSL/TLS mode is set to **Full** or **Full (strict)**

### Site Shows 404
- Verify the build output directory is correct
- Check that `next.config.js` doesn't have conflicting settings

## Continuous Deployment

Once set up, every push to your `main` branch will automatically trigger a new deployment. You can also:
- Set up preview deployments for pull requests
- Configure branch-specific environments
- Set up custom build commands per branch

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Cloudflare Pages Custom Domains](https://developers.cloudflare.com/pages/platform/custom-domains/)
