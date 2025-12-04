# SSO & Entra ID Login - SIMPLE EXPLAINED FOR YOUR PROJECT
## Cost-Effective & Simple Implementation Guide

**Your Project Status:**
- ✅ Frontend: React + TypeScript (NO backend)
- ✅ Deployed: Azure Static Web Apps (already live!)
- ✅ Data: Currently localStorage (browser storage only)
- ✅ Auth: MSAL already configured (just needs enabling)
- ✅ Goal: Add Entra ID login + Azure Storage Tables

---

## PART 1: WHAT IS SSO & ENTRA ID? (SIMPLE EXPLANATION)

### Traditional Login (What Most Apps Do)
```
User opens app
  ↓
Clicks "Login"
  ↓
Types email: sabrina@tre.se
Types password: ••••••••
  ↓
App checks: "Is this email & password correct?"
  ↓
If yes → Login successful
If no → Login failed

⚠️ PROBLEM:
- App stores passwords (security risk)
- Each app needs different login
- User remembers many passwords
```

### SSO (Single Sign-On) with Entra ID (What You'll Do)
```
User opens app
  ↓
Clicks "Login with Entra ID"
  ↓
Browser redirects to: login.microsoftonline.com (Microsoft's login page)
  ↓
User types email: sabrina@tre.se
User types password: ••••••••
  ↓
Microsoft's Entra ID checks credentials
  ↓
If yes → Issues a "TOKEN" (like a verified ID card)
If no → Login failed, user can't proceed

Token sent back to YOUR APP
  ↓
App trusts this token from Microsoft
  ↓
App says: "OK, you're logged in as Sabrina"

✅ BENEFITS:
- Passwords NEVER stored in your app
- Same login for all company apps (if they use Entra ID)
- IT admin controls access (can disable employees instantly)
- Better security (Microsoft handles password security)
- Audit logs (IT can see who logged in when)
```

---

## PART 2: HOW IT WORKS - YOUR PROJECT SPECIFIC

### Current Flow (Before - localStorage only)
```
┌─ Your Browser ─────────────────┐
│ App opens                       │
│ ↓                              │
│ No login needed                │
│ ↓                              │
│ Load data from localStorage     │ (Only on THIS device, THIS browser)
│ └─────────────────────────────┘
        PROBLEM: Data lost if cache cleared
        PROBLEM: Different data on different devices
```

### New Flow (After - Entra ID + Azure Storage)
```
Step 1: User opens app
  ↓
┌─ Your App (React) ──────────────┐
│ "Click 'Login with Entra ID'"   │
└─────────────────────────────────┘
  ↓
Step 2: App redirects to Microsoft
  ↓
┌─ Microsoft Entra ID Login ──────┐
│ User enters email & password     │
│ Microsoft verifies credentials   │
│ Issues TOKEN                     │
└─────────────────────────────────┘
  ↓
Step 3: Token sent back to app
  ↓
┌─ Your App (React) ──────────────┐
│ Stores TOKEN in memory          │
│ Shows: "Welcome, Sabrina!"      │
│ Button shows: "Logout"          │
└─────────────────────────────────┘
  ↓
Step 4: User clicks "Create Must-Win"
  ↓
┌─ Your App ──────────────────────┐
│ User fills form                 │
│ Clicks "Save"                   │
│ App uses TOKEN to authenticate  │
│ ↓                              │
│ Sends data to: Azure Tables     │
│ (Cloud storage)                 │
└─────────────────────────────────┘
  ↓
Step 5: User opens app NEXT DAY on DIFFERENT DEVICE
  ↓
┌─ Your App ──────────────────────┐
│ Asks to login again             │
│ User enters credentials         │
│ Gets new TOKEN                  │
│ ↓                              │
│ Loads data from Azure Tables    │
│ SAME data as yesterday! ✅      │
└─────────────────────────────────┘
```

---

## PART 3: KEY CONCEPTS EXPLAINED SIMPLY

### What is a TOKEN?
```
Think of a TOKEN like a concert ticket:
- You go to Microsoft (concert office)
- Prove you're an employee (email + password)
- Get a ticket (TOKEN) with your info
- TOKEN says: "This is valid for 1 hour"
- TOKEN says: "This person is Sabrina from TRE"
- You show TOKEN to your app = App trusts you
- App doesn't need to check password again
```

### What is IDP (Identity Provider)?
```
IDP = The service that verifies who you are

Examples:
- Microsoft Entra ID (for company employees) ← YOUR CHOICE
- Google (for Google accounts)
- Facebook (for Facebook accounts)

YOUR IDP = Microsoft Entra ID = Your company's login system
```

### What is MSAL?
```
MSAL = Microsoft Authentication Library

It's a library (code) that:
1. Connects to Microsoft Entra ID
2. Handles login popup
3. Manages tokens
4. Refreshes tokens automatically
5. Handles logout

✅ GOOD NEWS: Already installed in your package.json!
   @azure/msal-browser (v3.24.0)
   @azure/msal-react (v2.1.0)
```

### What is Azure Storage Tables?
```
Think of it like Google Sheets in the cloud:
- Table "MustWins" = Sheet1
  ├─ Must-Win 1: Revenue Growth, 45% progress
  ├─ Must-Win 2: Efficiency, 78% progress
  └─ Must-Win 3: Market Share, 32% progress
- Table "KeyActivities" = Sheet2
  ├─ Activity 1: Q1 Launch, 60% progress
  └─ Activity 2: Team Hiring, 85% progress
- Table "SubTasks" = Sheet3
- Table "StrategyPillars" = Sheet4

✅ YOU GET:
- Data stored in cloud (not lost if cache cleared)
- Multi-device access (same data everywhere)
- Automatic backups
- Cost: ~$0.03/month for your usage
```

---

## PART 4: YOUR CURRENT PROJECT STRUCTURE

```
Your App (Azure Static Web Apps - Already Deployed!)
│
├─ frontend/
│  ├─ React Components (Dashboard, MustWins, etc.)
│  ├─ localStorage calls (to be replaced with Azure)
│  ├─ MSAL already installed and configured
│  └─ No authentication currently active
│
├─ Data Storage (CURRENT)
│  ├─ strategy-pillars-assignments (localStorage)
│  ├─ must-wins-data (localStorage)
│  ├─ key-activities-data (localStorage)
│  └─ sub-tasks-data (localStorage)
│
└─ NO Backend (Which is fine!)
   ✅ Your app is 100% frontend
   ✅ No server to maintain
   ✅ Lower costs
```

---

## PART 5: HOW YOUR PROJECT WILL CHANGE

### Code Changes (Simple)

**BEFORE (localStorage - existing code):**
```typescript
// Dashboard.tsx
useEffect(() => {
  const stored = localStorage.getItem('must-wins-data')
  const mustWins = JSON.parse(stored)
  setMustWins(mustWins)
}, [])
```

**AFTER (Azure + Entra ID - new code):**
```typescript
// Dashboard.tsx
import { useAccount } from '@azure/msal-react'
import { AzureStorageService } from '@/services/AzureStorageService'

useEffect(() => {
  const account = useAccount()
  
  if (!account) {
    // User not logged in, show login button
    return
  }
  
  // User is logged in, load from Azure
  const service = new AzureStorageService(account)
  const mustWins = await service.getMustWins('2025')
  setMustWins(mustWins)
}, [])
```

**Key Difference:**
- Old: Direct browser storage, no authentication needed
- New: Authentication required, then access cloud storage

---

## PART 6: SIMPLEST IMPLEMENTATION PATH

### What You Need to Do (User's Job):
1. Create Azure Storage Account (5 minutes)
2. Create Entra ID App Registration (5 minutes)
3. Create `.env.local` file with credentials (2 minutes)
4. Push code to GitHub

**Total Setup Time: ~15 minutes**

### What I'll Do (Copilot's Job):
1. Create `AzureStorageService.ts` (connects to Azure Tables)
2. Update `Header.tsx` (add Login/Logout button)
3. Update all 8 pages (replace localStorage with Azure)
4. Test everything locally

**Total Coding Time: ~1-2 hours**

---

## PART 7: THE PLAN (HIGH-LEVEL)

### PHASE 1: Azure Portal Setup (15 minutes)

**Step 1.1: Create Azure Storage Account**
- Go to Azure Portal
- Create storage account
- Create 4 tables: MustWins, KeyActivities, SubTasks, StrategyPillars
- Copy: Storage account name, Key, Connection string

**Step 1.2: Verify Entra ID App Registration**
- Your app is already registered (partially configured)
- Verify it has:
  - Supported account type: "Accounts in this organizational directory only"
  - Redirect URIs: `http://localhost:3000` AND `https://lemon-hill-00ab62e03.3.azurestaticapps.net`
  - API Permissions: User.Read
- Copy: Client ID, Tenant ID

---

### PHASE 2: Local Configuration (10 minutes)

**Step 2.1: Create `.env.local`**
```dotenv
VITE_AZURE_CLIENT_ID=<Client ID from Entra ID>
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/<Tenant ID>
VITE_REDIRECT_URI=http://localhost:3000

VITE_AZURE_STORAGE_ACCOUNT=<storage account name>
VITE_AZURE_STORAGE_KEY=<storage account key>
VITE_AZURE_STORAGE_CONNECTION_STRING=<connection string>
```

**Step 2.2: Verify `.env.local` is in `.gitignore`**
- Check: ✅ Already there

---

### PHASE 3: Code Implementation (By Me - 1-2 hours)

**Step 3.1: Create `AzureStorageService.ts`**
- Service class that:
  - Connects to Azure Tables
  - Provides methods: getMustWins(), saveMustWin(), etc.
  - Returns data in same format as localStorage (minimal page changes)
  - Handles errors gracefully

**Step 3.2: Update `Header.tsx`**
- Add "Login with Entra ID" button
- On click: MSAL popup
- On success: Show "Sabrina Gill (sabrina@tre.se) | Logout"
- On logout: Clear app data

**Step 3.3: Update 8 Pages**
- `Dashboard.tsx` - Load from Azure
- `MustWins.tsx` - Load Must-Wins from Azure
- `CreateMustWin.tsx` - Save to Azure
- `UpdateMustWinProgress.tsx` - Update progress in Azure
- `KeyActivities.tsx` - Load from Azure
- `CreateKeyActivity.tsx` - Save to Azure
- `SubTasks.tsx` - Load from Azure
- `UpdateSubTaskProgress.tsx` - Update progress in Azure

**Pattern for all pages:**
- Remove all `localStorage` calls
- Replace with `AzureStorageService` calls
- Add error handling
- Add loading states
- Keep UI exactly the same (no design changes)

---

### PHASE 4: Deployment (By Me - 10 minutes)

**Step 4.1: Commit & Push**
```
git add .
git commit -m "feat: Add Entra ID login and Azure Storage integration"
git push origin feature/azure-login
```

**Step 4.2: Test on Live App**
- Visit: `https://lemon-hill-00ab62e03.3.azurestaticapps.net`
- Click "Login with Entra ID"
- Enter credentials
- Verify data loads from Azure
- Test create/update/delete operations

**Step 4.3: Create Pull Request**
- GitHub Actions runs tests
- PR ready for review
- Merge to main when satisfied

---

## PART 8: COST BREAKDOWN

| Service | What It Is | Cost/Month |
|---------|-----------|-----------|
| **Azure Storage** | Cloud data storage (tables) | ~$0.02 |
| **Storage Transactions** | Read/write operations | ~$0.005 |
| **Azure Static Web Apps** | Your app hosting | FREE (100GB) |
| **Entra ID** | Authentication/login | FREE |
| **TOTAL** | | **~$0.03/month** |

✅ **Very cost-effective!**

---

## PART 9: SECURITY & TRUST

### Why This is Secure:
1. **Passwords never in your app** - Microsoft handles password security
2. **Tokens expire** - Automatically refreshed (1-hour expiration)
3. **Only company employees can login** - Controlled by IT
4. **Audit logs** - IT can track who accessed what
5. **Account disabled? Instant access denial** - IT controls access

### What You're Trusting:
1. **Microsoft** - For authentication (enterprise-grade)
2. **Azure** - For data storage (enterprise-grade)

✅ **Both are used by Fortune 500 companies** - Very reliable

---

## PART 10: AFTER IMPLEMENTATION - USER EXPERIENCE

### For Employees:
```
Day 1:
  1. Opens app
  2. Sees "Login with Entra ID"
  3. Clicks login
  4. Enters email: sabrina@tre.se
  5. Enters password
  6. App shows "Welcome Sabrina!"
  7. Creates Must-Win "Revenue Growth"
  8. Saves to cloud (Azure)

Day 2 (Different Device):
  1. Opens app
  2. Clicks "Login with Entra ID"
  3. Enters same credentials
  4. Same "Welcome Sabrina!" message
  5. Sees SAME "Revenue Growth" Must-Win ← Data persisted!
  6. Can continue working

Day 100 (Employee Leaves):
  1. IT admin disables account in Entra ID
  2. Employee tries to login
  3. Gets "Access Denied"
  4. Can't access app anymore (automatic!)
```

---

## PART 11: WHAT HAPPENS BEHIND THE SCENES

### Technical Flow (Don't worry about details, just FYI):

```
1. App starts
   → MSAL checks: "Is there a token in browser memory?"
   → If yes: Use existing token, skip login
   → If no: Show "Login with Entra ID" button

2. User clicks "Login with Entra ID"
   → MSAL calls: PublicClientApplication.loginPopup()
   → Browser opens popup window
   → Redirects to: https://login.microsoftonline.com/{tenant-id}

3. User enters credentials in Microsoft's login page
   → Microsoft Entra ID validates credentials
   → Microsoft checks: "Is this person part of TRE organization?"
   → If yes: Generates JWT token
   → If no: Returns error "Not authorized"

4. Token sent back to your app
   → Token contains: Name, Email, Organization, Roles
   → Token contains: Expiration time (usually 1 hour)
   → Token is stored in sessionStorage (browser memory)

5. App uses token to authenticate to Azure Storage
   → Every request to Azure includes token
   → Azure validates token: "Is this token from Microsoft?"
   → If yes: Returns data
   → If no: Returns 401 Unauthorized

6. Token expires (1 hour later)
   → MSAL automatically refreshes token
   → User doesn't need to login again
   → App continues working seamlessly

7. User clicks "Logout"
   → MSAL calls: PublicClientApplication.logoutPopup()
   → Token deleted from browser memory
   → User redirected to login page
```

---

## PART 12: COMMON QUESTIONS ANSWERED

### Q: Do I need a backend?
**A:** No! Your frontend directly talks to Azure Storage. No backend needed.

### Q: What if token expires?
**A:** MSAL automatically refreshes it. User doesn't notice anything.

### Q: Will my app go offline?
**A:** No, it will stay online. But if internet is down, features that need Azure won't work.

### Q: Can users still use the app if their Entra ID account is disabled?
**A:** No, they'll get "Access Denied" on login. IT controls access.

### Q: What if I lose the .env.local file?
**A:** It's in `.gitignore` so not committed. Just recreate it from notes.

### Q: Can I test locally without Azure?
**A:** Yes, we can add a "demo mode" that uses localStorage for testing.

### Q: How do I add more users?
**A:** Just tell IT to add them to your Entra ID organization. They can then login.

---

## READY TO START?

### Next Steps:

1. **You Do (15 minutes):**
   - Create Azure Storage Account
   - Verify Entra ID App Registration
   - Create `.env.local` file
   - Run `npm run dev` locally

2. **Tell Me When Ready:**
   - "Ready with Entra ID credentials" 
   - Provide the 6 environment variables

3. **I Do (1-2 hours):**
   - Implement all the code
   - Test everything
   - Push to GitHub

4. **Final Step:**
   - Test on live deployment
   - Create PR for review
   - Merge when satisfied

---

## SUMMARY IN ONE SENTENCE

**Your app will add a "Login with Entra ID" button that authenticates employees through Microsoft, then saves/loads data from Azure cloud storage instead of browser storage, making data accessible from any device.**

---

## NEXT: DETAILED STEP-BY-STEP PLAN

Ready for the detailed implementation plan with exact steps?

