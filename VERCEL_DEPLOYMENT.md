# Deploying to Vercel with blogfromhell.com

This guide will walk you through deploying your Next.js blog to Vercel and connecting your custom domain `blogfromhell.com`.

## Prerequisites

1. A GitHub account with your code pushed to a repository
2. A Vercel account (free tier available)
3. Your domain `blogfromhell.com` ready to connect

## Step 1: Push Your Code to GitHub

Your code should already be on GitHub at: `https://github.com/organdonor1/blogfromhell`

If not, make sure it's pushed:
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

## Step 2: Deploy to Vercel

1. **Sign up/Log into Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account (or log in if you already have one)

2. **Import Your Project**
   - Click **"Add New..."** → **"Project"**
   - Click **"Import Git Repository"**
   - Select your repository: `organdonor1/blogfromhell`
   - Click **"Import"**

3. **Configure Project Settings**
   - **Project Name**: `blogfromhell` (or your preferred name)
   - **Framework Preset**: Vercel will auto-detect **Next.js** ✅
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables** (if needed)
   - Add any environment variables your app requires
   - For now, you can skip this step

5. **Click "Deploy"**
   - Vercel will start building your site
   - This usually takes 1-3 minutes
   - You'll see the build progress in real-time

## Step 3: Connect Your Custom Domain

1. **After Deployment Completes**
   - Go to your project dashboard
   - Click on the **"Settings"** tab
   - Click **"Domains"** in the sidebar

2. **Add Your Domain**
   - Enter `blogfromhell.com`
   - Click **"Add"**
   - Vercel will show you DNS configuration instructions

3. **Configure DNS**
   - Go to your domain registrar (where you manage blogfromhell.com)
   - Add the DNS records Vercel provides:
     - **Type**: `A` or `CNAME`
     - **Name**: `@` (for root domain) or leave blank
     - **Value**: The value Vercel provides (e.g., `76.76.21.21` or a CNAME)
   - For `www.blogfromhell.com`, add another record:
     - **Type**: `CNAME`
     - **Name**: `www`
     - **Value**: `cname.vercel-dns.com`

4. **Wait for DNS Propagation**
   - DNS changes can take 5 minutes to 48 hours
   - Usually takes 5-15 minutes
   - Vercel will show the status in the dashboard

5. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - Your site will be available at `https://blogfromhell.com` once DNS propagates

## Step 4: Verify Your Site

1. Visit `https://blogfromhell.com` in your browser
2. Your full blog site should be live with all the features!

## Continuous Deployment

Once set up:
- Every push to your `main` branch automatically triggers a new deployment
- Preview deployments are created for pull requests
- You can see deployment history and rollback if needed

## Vercel Dashboard Features

- **Analytics**: View site traffic and performance
- **Logs**: Check build and runtime logs
- **Environment Variables**: Manage secrets and config
- **Team Collaboration**: Invite team members
- **Preview Deployments**: Test changes before merging

## Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node.js 18.x by default)

### Domain Not Working
- Wait for DNS propagation (can take up to 48 hours)
- Verify DNS records are correct in your domain registrar
- Check domain status in Vercel dashboard

### Site Shows Old Content
- Check if the latest deployment succeeded
- Clear browser cache
- Verify you're looking at the production deployment

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Custom Domains on Vercel](https://vercel.com/docs/concepts/projects/domains)

## Benefits of Vercel for Next.js

- ✅ Native Next.js support (no configuration needed)
- ✅ Automatic optimizations (Image Optimization, Edge Functions)
- ✅ Global CDN for fast loading
- ✅ Preview deployments for every PR
- ✅ Automatic HTTPS/SSL
- ✅ Analytics and monitoring built-in
- ✅ Free tier with generous limits
