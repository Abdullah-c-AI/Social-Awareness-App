# Upload to GitHub - Commands

## After installing Git, run these commands in your project directory:

```bash
# 1. Initialize Git repository
git init

# 2. Add all files to staging
git add .

# 3. Create initial commit
git commit -m "Initial commit: Social Awareness App with campaign management"

# 4. Add GitHub remote (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 5. Push to GitHub
git push -u origin main
```

## If you get authentication errors:

### Option 1: Use Personal Access Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with "repo" permissions
3. Use token as password when prompted

### Option 2: Use GitHub CLI
```bash
# Install GitHub CLI
winget install GitHub.cli

# Authenticate
gh auth login

# Push with CLI
gh repo create social-awareness-app --public --source=. --remote=origin --push
```

## Important Files to Check:

Make sure these files are in your project:
- ✅ README.md
- ✅ DEVELOPER_MANUAL.md  
- ✅ USER_MANUAL.md
- ✅ package.json (root)
- ✅ backend/ folder
- ✅ frontend/ folder

## .gitignore File

Create a `.gitignore` file in your project root:

```gitignore
# Dependencies
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
*/dist/
*/build/

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

## Troubleshooting:

### If "main" branch doesn't exist:
```bash
git branch -M main
git push -u origin main
```

### If you get "remote origin already exists":
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### If you need to update existing repository:
```bash
git pull origin main --allow-unrelated-histories
git push origin main
```


