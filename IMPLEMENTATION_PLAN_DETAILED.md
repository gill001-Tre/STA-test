# DETAILED IMPLEMENTATION PLAN
## Entra ID SSO + Azure Storage for Strategy Tracker

---

## EXECUTIVE SUMMARY

**What You're Building:**
- Entra ID login (only `@tre.se` employees can access)
- Azure Storage for persistent cloud data
- Multi-device access (login on different device = same data)
- No backend required (frontend only)

**Timeline:**
- Your setup: ~15 minutes (Azure Portal)
- My implementation: ~2 hours (code)
- Testing: ~30 minutes
- **Total: ~2.5 hours end-to-end**

**Cost:**
- ~$0.03/month for Azure Storage
- FREE for authentication (Entra ID)
- FREE for app hosting (Azure Static Web Apps - already have it)

---

## PHASE 1: AZURE PORTAL SETUP (15 minutes)
### Your Responsibility

### STEP 1: Create Azure Storage Account

**What to Do:**
1. Go to https://portal.azure.com
2. Click "Create a resource"
3. Search "Storage account"
4. Click "Create"

**Fill the Form:**
- **Resource Group:** Create new → name it `strategy-tracker-rg`
- **Storage account name:** `strategytrackerapp` (must be lowercase, globally unique)
- **Region:** "West Europe" (closest to Sweden)
- **Performance:** Standard
- **Redundancy:** Locally-redundant storage (LRS) - cheapest option
- **Disable public access:** Leave defaults
- Click "Next" until "Review + create"
- Click "Create"

**Wait 1-2 minutes for deployment**

**After Creation - Get Your Credentials:**
1. Go to the storage account
2. Click "Security + networking" → "Access keys"
3. **Copy these values to notepad:**
   - **Storage account name** (should be `strategytrackerapp`)
   - **Key1** (long string like `abcdef1234567890...==`)
   - **Connection string** (starts with `DefaultEndpointProtocol=...`)

**Screenshot checkpoints:**
- ✅ Storage account created
- ✅ You have Storage account name
- ✅ You have Key1 (full key)
- ✅ You have Connection string

---

### STEP 2: Create Tables in Storage

**What to Do:**
1. In storage account, click "Data storage" → "Tables"
2. Click "Create table"
3. Name: `MustWins` → Create
4. Repeat 3 more times:
   - `KeyActivities`
   - `SubTasks`
   - `StrategyPillars`

**Verify:**
- You should see 4 tables listed

---

### STEP 3: Verify/Configure Entra ID App Registration

**Your app is PARTIALLY configured. We need to complete it:**

1. Go to https://portal.azure.com
2. Search "App registrations"
3. You should see your app (should say `Strategy Tracker App` or similar from previous setup)
4. Click on it

**Verify Configuration:**

**A. Supported account types:**
1. Click "Manage" → "Authentication" (or Branding & properties)
2. Look for "Supported account types"
3. Should say: **"Accounts in this organizational directory only"** ← If it says this, you're good!
4. If not, change it to organizational directory only

**B. Redirect URIs:**
1. Click "Manage" → "Authentication"
2. You should see "Web" platform
3. Add two redirect URIs (if not already there):
   - `http://localhost:3000` (for local testing)
   - `https://lemon-hill-00ab62e03.3.azurestaticapps.net` (for production app)
4. Save

**C. API Permissions:**
1. Click "Manage" → "API permissions"
2. Should show `User.Read` permission
3. If not:
   - Click "Add a permission"
   - Select "Microsoft Graph"
   - Select "Delegated permissions"
   - Search and check: `User.Read`
   - Click "Add permissions"

**Get Your Entra ID Credentials:**
1. Go back to App Registration overview
2. **Copy these to notepad:**
   - **Application (client) ID** (UUID like `a1b2c3d4-e5f6-7890-...`)
   - **Directory (tenant) ID** (UUID like `87654321-4321-4321-...`)

**Screenshot checkpoints:**
- ✅ Supported accounts: "Accounts in this organizational directory only"
- ✅ Redirect URIs configured (both http://localhost:3000 and https://lemon-hill-00ab62e03.3.azurestaticapps.net)
- ✅ API Permissions has User.Read
- ✅ You have Client ID
- ✅ You have Tenant ID

---

## PHASE 2: LOCAL CONFIGURATION (5 minutes)
### Your Responsibility

### STEP 4: Create `.env.local` File

**File Location:**
```
c:\Users\gill001\Desktop\STA-App\.env.local
```

**Content (Copy-paste and fill in YOUR values):**
```dotenv
# Entra ID Authentication
VITE_AZURE_CLIENT_ID=<paste your Client ID here>
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/<paste your Tenant ID here>
VITE_REDIRECT_URI=http://localhost:3000

# Azure Storage
VITE_AZURE_STORAGE_ACCOUNT=<paste your Storage account name here>
VITE_AZURE_STORAGE_KEY=<paste your Key1 here>
VITE_AZURE_STORAGE_CONNECTION_STRING=<paste your Connection string here>
```

**Example (DO NOT use these - just format reference):**
```dotenv
VITE_AZURE_CLIENT_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/87654321-4321-4321-4321-210987654321
VITE_REDIRECT_URI=http://localhost:3000

VITE_AZURE_STORAGE_ACCOUNT=strategytrackerapp
VITE_AZURE_STORAGE_KEY=abcdef1234567890ABCDEF1234567890abcdef1234567890ABCDEF12345678==
VITE_AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointProtocol=https;AccountName=strategytrackerapp;AccountKey=abcdef...==;EndpointSuffix=core.windows.net
```

**⚠️ IMPORTANT:**
- `.env.local` is already in `.gitignore` (won't be committed to Git)
- These are SECRET credentials - don't share them
- When you restart `npm run dev`, Vite loads these automatically

**Verify:**
```powershell
npm run dev
```
Open browser DevTools (F12) → Console
```javascript
console.log(import.meta.env.VITE_AZURE_CLIENT_ID)
```
Should show your Client ID (not `undefined`)

---

## PHASE 3: CODE IMPLEMENTATION (2 hours)
### My Responsibility (Copilot Will Do)

### STEP 5: Create `AzureStorageService.ts`

**File:** `src/services/AzureStorageService.ts`

**What It Does:**
- Connects to Azure Tables using `@azure/data-tables` SDK
- Provides methods to save/load/delete data
- Returns data in SAME format as localStorage (minimal page changes)
- Handles errors gracefully
- Manages authentication token

**Methods I'll Implement:**
```typescript
// Must-Wins
getMustWins(year: string): Promise<MustWin[]>
saveMustWin(data: MustWin, year: string): Promise<void>
updateMustWinProgress(id: number, progress: number, year: string): Promise<void>
deleteMustWin(id: number, year: string): Promise<void>

// Key Activities
getKeyActivities(year: string): Promise<KeyActivity[]>
saveKeyActivity(data: KeyActivity, year: string): Promise<void>
updateKeyActivityProgress(id: number, progress: number, year: string): Promise<void>
deleteKeyActivity(id: number, year: string): Promise<void>

// Sub-Tasks
getSubTasks(year: string): Promise<SubTask[]>
saveSubTask(data: SubTask, year: string): Promise<void>
updateSubTaskProgress(id: number, progress: number, year: string): Promise<void>
deleteSubTask(id: number, year: string): Promise<void>

// Strategy Pillars
getStrategyPillars(year: string): Promise<StrategyPillar[]>
saveStrategyPillar(data: StrategyPillar, year: string): Promise<void>
deleteStrategyPillar(id: number, year: string): Promise<void>
```

---

### STEP 6: Update `src/components/Layout/Header.tsx`

**Changes:**
- Add "Login with Entra ID" button (when user not logged in)
- On click: Show Entra ID login popup
- On success: Show "Sabrina Gill (sabrina@tre.se) | Logout"
- On logout: Clear token and redirect to login

**Code Changes:**
```typescript
import { useMsal, useAccount } from '@azure/msal-react'

// Get user info
const { instance } = useMsal()
const account = useAccount()

// Login handler
const handleLogin = () => {
  instance.loginPopup({
    scopes: ['User.Read']
  })
}

// Logout handler
const handleLogout = () => {
  instance.logoutPopup({
    postLogoutRedirectUri: '/'
  })
}

// UI
{account ? (
  <button onClick={handleLogout}>
    {account.name} ({account.username}) | Logout
  </button>
) : (
  <button onClick={handleLogin}>
    Login with Entra ID
  </button>
)}
```

---

### STEP 7: Update 8 Pages to Use Azure Storage

**Pages to Update:**

| # | File | What Changes |
|---|------|-------------|
| 1 | `Dashboard.tsx` | Load Must-Wins, Key Activities, Sub-Tasks from Azure |
| 2 | `MustWins.tsx` | Load all Must-Wins from Azure |
| 3 | `CreateMustWin.tsx` | Save new Must-Wins to Azure |
| 4 | `UpdateMustWinProgress.tsx` | Update progress in Azure |
| 5 | `KeyActivities.tsx` | Load all Key Activities from Azure |
| 6 | `CreateKeyActivity.tsx` | Save new Key Activities to Azure |
| 7 | `SubTasks.tsx` | Load all Sub-Tasks from Azure |
| 8 | `UpdateSubTaskProgress.tsx` | Update progress in Azure |

**Pattern for Each Page:**

```typescript
// BEFORE (localStorage)
useEffect(() => {
  const stored = localStorage.getItem('must-wins-data')
  const data = JSON.parse(stored)
  setData(data)
}, [])

// AFTER (Azure Storage)
import { useAccount } from '@azure/msal-react'
import { AzureStorageService } from '@/services/AzureStorageService'

useEffect(() => {
  const account = useAccount()
  
  if (!account) {
    console.log('Not logged in')
    return
  }
  
  const loadData = async () => {
    try {
      const service = new AzureStorageService()
      const data = await service.getMustWins('2025')
      setData(data)
    } catch (error) {
      console.error('Failed to load data:', error)
      setError('Failed to load data from Azure')
    }
  }
  
  loadData()
}, [account])
```

**UI Changes:**
- Add loading state: "Loading data..."
- Add error state: "Failed to load data"
- Add success message on create/update/delete

---

## PHASE 4: TESTING & DEPLOYMENT (30 minutes)
### Both (You + Me)

### STEP 8: Test Locally

**1. Start dev server:**
```powershell
npm run dev
```

**2. Test login:**
- Click "Login with Entra ID"
- Entra ID popup appears
- Enter your work email (e.g., `sabrina.gill@tre.se`)
- Enter your work password
- Optional: 2FA code if enabled
- Popup closes
- Header shows: "Sabrina Gill (sabrina.gill@tre.se) | Logout"

**3. Test data operations:**
- Click "Create Must-Win"
- Fill form
- Click "Save"
- Check DevTools Network tab → See Azure request (POST)
- See success message
- Verify it appears in Must-Wins list
- Refresh page → Data persists (from Azure!)

**4. Test logout:**
- Click "Logout"
- Header shows "Login with Entra ID" again
- Open DevTools → No token in sessionStorage

**5. Test on different browser:**
- Open different browser (Chrome if using Edge, etc.)
- Visit `http://localhost:3000`
- Login with same credentials
- Verify SAME data appears ✅

---

### STEP 9: Deploy to Azure Static Web Apps

**1. Commit code:**
```powershell
git add .
git commit -m "feat: Add Entra ID login and Azure Storage integration"
```

**2. Push to GitHub:**
```powershell
git push origin feature/azure-login
```

**3. GitHub Actions automatically:**
- Builds the app
- Runs tests
- Deploys to `https://lemon-hill-00ab62e03.3.azurestaticapps.net`

**4. Add environment variables to Static Web Apps:**
1. Go to https://portal.azure.com
2. Find your Static Web App (search "lemon-hill")
3. Go to "Configuration" → "Application settings"
4. Add same 6 variables from `.env.local`
5. Save → App auto-redeploys

**5. Test live app:**
- Visit: `https://lemon-hill-00ab62e03.3.azurestaticapps.net`
- Login with Entra ID
- Test data operations
- Verify everything works

---

### STEP 10: Create Pull Request

**1. Create PR on GitHub:**
```
Title: "feat: Implement Entra ID SSO and Azure Storage integration"
Description: 
- Add Entra ID organizational login
- Replace localStorage with Azure Tables
- Add user authentication
- Add error handling and loading states
```

**2. Review checklist:**
- [ ] Login works
- [ ] Create Must-Win works
- [ ] Create Key Activity works
- [ ] Create Sub-Task works
- [ ] Data persists across page refreshes
- [ ] Data persists across browser sessions
- [ ] Logout works
- [ ] No localStorage calls remain

**3. Merge when satisfied**

---

## PHASE 5: POST-IMPLEMENTATION
### Ongoing

### STEP 11: Add More Users

**How:**
1. IT admin adds employees to your Entra ID organization
2. Those employees can now login to Strategy Tracker
3. They see same shared company data

**Access Control:**
- Everyone sees all data (no row-level security yet)
- Future: Can implement per-user data isolation if needed

### STEP 12: Monitor & Maintain

**What to monitor:**
- Azure Storage costs (should stay ~$0.03/month)
- User login issues (IT handles)
- Data integrity (verify Azure backups)

**Maintenance:**
- Renew tokens automatically (no action needed)
- Update secrets if compromised (update `.env.local` and Azure portal)
- Monitor error logs

---

## SUMMARY CHECKLIST

### Before Implementation:
- [ ] Azure Storage Account created
- [ ] 4 Tables created (MustWins, KeyActivities, SubTasks, StrategyPillars)
- [ ] Entra ID app registration configured
- [ ] Redirect URIs set (localhost:3000 + production URL)
- [ ] API Permissions granted (User.Read)
- [ ] `.env.local` created with all 6 variables
- [ ] `npm run dev` works without errors

### After Implementation:
- [ ] Entra ID login button works
- [ ] Login popup appears
- [ ] Token acquired after login
- [ ] Header shows logged-in user
- [ ] Create Must-Win saves to Azure
- [ ] Create Key Activity saves to Azure
- [ ] Create Sub-Task saves to Azure
- [ ] Data persists after refresh
- [ ] Data persists on different device
- [ ] Logout clears session
- [ ] Live deployment works
- [ ] PR merged to main

---

## TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| "Config is not defined" | Check `.env.local` is in root directory |
| "Client ID undefined" | Restart `npm run dev` after adding `.env.local` |
| "Login popup blocked" | Browser popup blocker? Allow popups for localhost |
| "Token expired error" | MSAL should auto-refresh, if not, user logs in again |
| "Can't connect to Azure" | Check internet, verify storage account name/key in `.env.local` |
| "Only my account can login" | That's correct for Entra ID - other users need Entra ID credentials |

---

## FINAL SUMMARY

**What you're getting:**
✅ Entra ID SSO login (only company employees)
✅ Azure Storage for persistent data
✅ Multi-device access
✅ Automatic user authentication
✅ IT-managed access control
✅ Audit logs of all logins
✅ No backend to maintain
✅ Cost-effective (~$0.03/month)

**Timeline:**
- Your setup: 15 mins
- My implementation: 2 hours
- Testing: 30 mins
- **Total: 2.5 hours**

**When ready, tell me:**
"Ready with Entra ID - Azure Portal setup complete, `.env.local` created with all credentials"

**Then I'll start implementing the code!**

