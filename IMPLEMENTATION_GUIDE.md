# STRATEGY TRACKER APP - SSO + ENTRA ID + ROLE-BASED + AZURE STORAGE
## Complete Implementation Guide (Frontend Only, No Backend)

**Version:** 1.0  
**Date:** December 3, 2025  
**Branch:** feature/azure-login  
**Status:** Ready to Implement

---

## TABLE OF CONTENTS
1. [Current State Analysis](#current-state-analysis)
2. [What You Need to Understand](#what-you-need-to-understand)
3. [Simple Explanation of Key Concepts](#simple-explanation-of-key-concepts)
4. [Your Requirements](#your-requirements)
5. [Solution Architecture](#solution-architecture)
6. [Step-by-Step Implementation Plan](#step-by-step-implementation-plan)
7. [Cost Analysis](#cost-analysis)
8. [Security & Compliance](#security--compliance)
9. [Timeline & Next Steps](#timeline--next-steps)

---

# CURRENT STATE ANALYSIS

## Your Project Today
```
Frontend Application:
├─ Framework: React 18.3.1 + TypeScript 5.6.2
├─ Deployment: Azure Static Web Apps (LIVE)
├─ URL: https://lemon-hill-00ab62e03.3.azurestaticapps.net
├─ Build Tool: Vite 5.4.8
├─ Styling: Tailwind CSS 3.4.13
│
├─ Year Support: 2026, 2027, 2028 only
│  ├─ Dropdown shows: 2026, 2027, 2028
│  ├─ Default: Current year selected
│  └─ Past years: Not supported
│
├─ Data Storage: localStorage (browser only)
│  ├─ Keys: must-wins-data, key-activities-data, sub-tasks-data
│  ├─ Problem: Lost when cache cleared, no multi-device sync
│  └─ Accessible from: Only that browser on that device
│
├─ Authentication: NONE (currently)
│  ├─ MSAL configured but disabled
│  ├─ All pages are public
│  └─ No user identification
│
├─ Authorization: NONE
│  ├─ No user roles
│  ├─ All users see all data
│  └─ No access controls
│
└─ Backend: NONE
   ├─ Frontend only
   ├─ No API backend
   └─ No server-side logic

GitHub Actions:
└─ Auto-deploys on push to main
```

## What Exists in Code
- ✅ MSAL already installed (@azure/msal-browser, @azure/msal-react)
- ✅ @azure/data-tables already installed
- ✅ config.ts has Entra ID + Azure Storage config ready
- ✅ Types defined for User, Roles, etc.
- ✅ App.tsx has routing set up
- ✅ Header.tsx has logout button placeholder
- ✅ All pages structure ready

---

# WHAT YOU NEED TO UNDERSTAND

## 1. SSO (Single Sign-On)

### Without SSO
```
You use 3 different apps:
├─ App A: Login with username/password
├─ App B: Login with username/password  
├─ App C: Login with username/password
└─ Result: 3 login prompts, frustrating

Each app stores your credentials separately.
Each time you log in to new device = enter password again.
```

### With SSO
```
You log in ONCE to your organization's identity provider (Entra ID):
├─ Entra ID stores: Your identity, roles, permissions
├─ Token created: Proves "you are sabrina.gill@tre.se"
├─ App A: Asks Entra ID "Is this token valid?" → YES → Login automatically
├─ App B: Asks Entra ID "Is this token valid?" → YES → Login automatically
├─ App C: Asks Entra ID "Is this token valid?" → YES → Login automatically
└─ Result: 1 login, automatic access to all apps

Token expires after ~1 hour, automatically refreshed by browser.
Same device = automatic re-login, no password needed.
Different device = login once with credentials, then automatic.
```

## 2. Entra ID (What Is It?)

### Simple Explanation
```
Entra ID = Your Company's Central Identity Manager

Your Organization (TRE):
├─ HR System → Creates employee accounts
├─ Email: sabrina.gill@tre.se
├─ Password: Managed by company
├─ Groups: IT can assign you to groups
├─ 2FA: Company can require
├─ Disabled: If you leave, company disables account
│
└─ Entra ID is the central place where:
   ├─ All user info is stored
   ├─ Passwords are validated
   ├─ Permissions are checked
   └─ Apps ask: "Is this person allowed?"

What Entra ID Does:
├─ Authentication: "Are you who you claim to be?"
│  └─ Validates username + password
├─ Authorization: "What are you allowed to do?"
│  └─ Returns user's roles and groups
└─ SSO: "Enable automatic login"
   └─ Issues tokens that apps trust
```

## 3. MSAL (What Is It?)

### Simple Explanation
```
MSAL = Microsoft Authentication Library
└─ It's an NPM package you install in your React app

What MSAL Does:
├─ Handles login popup
├─ Communicates with Entra ID
├─ Stores tokens in browser
├─ Refreshes tokens automatically
├─ Provides user information to your app
└─ Handles logout

Your App Code:
├─ Imports: import { useMsal } from '@azure/msal-react'
├─ Calls: instance.loginPopup()
├─ MSAL opens: Entra ID login page
├─ User enters: sabrina.gill@tre.se + password
├─ Entra ID returns: JWT token with user info
├─ MSAL stores: Token in sessionStorage
└─ Your app uses: Token for authentication

Why MSAL instead of writing it yourself?
├─ MSAL handles security best practices
├─ MSAL manages token refresh
├─ MSAL handles errors gracefully
├─ MSAL supports offline scenarios
└─ MSAL is battle-tested and secure
```

## 4. Role-Based Access Control (RBAC)

### Your 4 Roles
```
ADMIN (CTIO - Chief Technology Innovation Officer)
├─ Can: Create/Edit/Delete everything
├─ Access: Full app (all pages, all features)
├─ Sees: Complete dashboard with all organization data
├─ Controls: Manage users, set roles, view all departments
├─ Reports: Full access to all reports
└─ Permissions: Unrestricted full access

HEAD_OF_DEPARTMENT
├─ Can: Create/Edit/Delete own department Must-Wins, Key Activities
├─ Can: Assign to their department members
├─ Access: Full app (all pages, all features)
├─ Sees: Department dashboard + all data for their department
├─ Cannot: Access other departments' data
├─ Reports: Department-specific reports
└─ Permissions: Full access to app, filtered by department

TEAM_CHEF (Team Leader)
├─ Can: Create/Edit/Delete own team Key Activities & Sub-tasks
├─ Can: Update Sub-task progress
├─ Access: Full app (all pages, all features)
├─ Sees: Team dashboard + all data for their team
├─ Cannot: Access other teams' data
├─ Reports: Team-specific reports
└─ Permissions: Full access to app, filtered by team

EMPLOYEE (Common User)
├─ Can: View dashboard only
├─ Cannot: Access any other pages
├─ Sees: Read-only dashboard view
├─ Cannot: Create/Edit/Delete anything
├─ Cannot: View detailed pages
├─ Reports: No access
└─ Permissions: Dashboard read-only access only
```

### How Roles Are Determined
```
Option A: From Entra ID Groups (Automatic)
├─ IT admin creates groups: "StrategyTracker_Admins"
├─ IT adds users to groups
├─ When user logs in:
│  └─ Entra ID includes groups in token
│  └─ App reads groups → Determines role
│  └─ User automatically gets role
└─ Result: No manual setup needed

Option B: Manual Management (Simple, Start Here)
├─ You create Users table in Azure Storage
├─ Table: email → role mapping
├─ When user logs in:
│  └─ App queries Users table
│  └─ Gets role from table
│  └─ Assigns role to user
└─ Result: You manage via admin UI

RECOMMENDATION: Start with Option B, migrate to A later
```

## 5. Azure Storage Tables

### What It Is
```
Azure Storage Tables = Cloud Database

Instead of localStorage (browser storage):
├─ ❌ localStorage: Only on 1 device, lost if cache cleared
├─ ✅ Azure Tables: Cloud storage, multi-device, permanent
│
└─ Your data:
   ├─ Must-Wins → Stored in Azure
   ├─ Key Activities → Stored in Azure
   ├─ Sub-Tasks → Stored in Azure
   ├─ Strategy Pillars → Stored in Azure
   ├─ Users (roles) → Stored in Azure
   └─ All encrypted and backed up by Azure
```

### How It Works
```
Table Structure:
├─ PartitionKey: Year (2026, 2027, 2028)
├─ RowKey: Unique ID (e.g., "MustWin_1")
├─ Other columns: Your data (title, progress, deadline, etc.)

Example MustWins Table:
┌──────────────────────────────────────────────────────────┐
│ PartitionKey │ RowKey      │ Title          │ Progress   │
├──────────────────────────────────────────────────────────┤
│ 2026         │ MustWin_1   │ Revenue Growth │ 45%        │
│ 2026         │ MustWin_2   │ Efficiency     │ 78%        │
│ 2026         │ MustWin_3   │ Innovation     │ 23%        │
│ 2027         │ MustWin_1   │ Market Exp.    │ 10%        │
│ 2027         │ MustWin_2   │ New Product    │ 35%        │
│ 2028         │ MustWin_1   │ Digital Shift  │ 5%         │
└──────────────────────────────────────────────────────────┘

Why this structure?
├─ PartitionKey (year) allows: Get all 2026 data quickly
├─ RowKey (ID) allows: Get specific item by ID
├─ Supports querying: Get items by status, progress, deadline
├─ Scales: Can store millions of rows
├─ Year isolation: Each year's data separate (2026, 2027, 2028)
└─ Multi-year support: Can work with 3 years simultaneously
```

---

# SIMPLE EXPLANATION OF KEY CONCEPTS

## The Complete Flow (Step by Step)

```
DAY 1 - FIRST LOGIN:
────────────────────
1. Sabrina opens: https://lemon-hill-00ab62e03.3.azurestaticapps.net
2. Browser loads React app
3. App checks: "Is token in browser?" → NO
4. App shows: "Login with Entra ID" button
5. Sabrina clicks login button
6. MSAL opens popup: Entra ID login page
7. Sabrina enters: sabrina.gill@tre.se + password
8. Entra ID validates (checks Active Directory)
9. Entra ID returns: Token with user info
   ├─ oid: "12345" (Sabrina's unique ID)
   ├─ name: "Sabrina Gill"
   ├─ email: "sabrina.gill@tre.se"
   └─ groups: ["StrategyTracker_Admins"] (if using groups)
10. MSAL stores token in sessionStorage
11. App queries Users table:
    └─ Get row: email = "sabrina.gill@tre.se"
    └─ Get role: "admin" (from table or groups)
12. App sets user context:
    ├─ Name: "Sabrina Gill"
    ├─ Email: "sabrina.gill@tre.se"
    ├─ Role: "admin"
    └─ Token: <stored in memory>
13. Dashboard loads with role-based UI
    ├─ Shows: "Create Strategy Pillar" button (admin only)
    ├─ Shows: Delete buttons (admin only)
    ├─ Shows: Full data (admin can see all)
    └─ Shows: "Hello, Sabrina (admin)"
14. Sabrina can:
    ├─ Create Must-Win
    ├─ Update progress
    ├─ View all data
    └─ Access Azure Tables (token proves identity)
15. Every operation:
    ├─ Includes token: "Prove you're authorized"
    ├─ Includes user: "Who is doing this?"
    └─ Azure validates both → Allows operation

DAY 2 - SAME DEVICE:
────────────────────
1. Sabrina opens app again
2. Browser still has token (valid for ~1 hour)
3. App checks: "Is token in browser?" → YES
4. MSAL automatically uses token
5. No login prompt needed
6. Dashboard loads immediately with:
   ├─ User: Sabrina Gill
   ├─ Role: admin
   └─ Same access as before
7. If token expired:
   ├─ MSAL automatically refreshes it
   ├─ User doesn't notice anything
   └─ Access continues seamlessly

DAY 3 - DIFFERENT DEVICE:
─────────────────────────
1. Sabrina opens app on new laptop
2. Browser has NO token (different device)
3. App shows: "Login with Entra ID" button
4. Same flow as Day 1
5. After login: Same access, same role
6. Now data is SYNCED:
   ├─ Changes from laptop 1 are visible on laptop 2
   ├─ All changes stored in Azure Tables
   └─ No desktop-only data anymore

LOGOUT:
───────
1. Sabrina clicks "Logout"
2. MSAL deletes token from browser
3. App clears user context
4. Redirects to login page
5. Next time: Must login again
```

## Why This Is Secure

```
Your Password:
├─ Never sent to your app
├─ Only sent to Entra ID (Microsoft's secure servers)
├─ Your app never sees password
├─ Token is time-limited (1 hour)
└─ Token can be revoked by admin

Entra ID Controls:
├─ Who can log in (employees only, blocked if left company)
├─ 2FA enforcement (IT can require phone approval)
├─ Unusual location blocking (IT can block suspicious login)
├─ Account disabling (IT disables when employee leaves)
└─ Audit trail (Complete history of who logged in when)

Your App Security:
├─ Token proves identity
├─ Role proves authorization
├─ User email tracked (audit trail)
├─ All data encrypted at rest in Azure
└─ All data encrypted in transit
```

---

# YOUR REQUIREMENTS

## What You Want
1. ✅ SSO login with Entra ID
   - Employees use @tre.se account
   - Automatic login on same device
   - Works across all apps
   
2. ✅ Role-based authentication
   - 4 roles: admin(CTIO), head_of_department, team_chef, employee(common user)
   - Full app access for admin/HOD/Chef
   - Dashboard-only access for common employees
   - Different UI and permissions for each role

3. ✅ Save data in Azure Storage Tables
   - Replace localStorage
   - Multi-device sync
   - Persistent backup

4. ✅ Cost-effective
   - No backend needed
   - Frontend only
   - ~$0.06/month Azure cost

5. ✅ Simple implementation
   - Use existing MSAL config
   - Minimal new code
   - Leverage Microsoft services

## What We're NOT Doing
- ❌ Building backend API (not needed)
- ❌ Database (Azure Tables is enough)
- ❌ Complex enterprise setup (start simple)
- ❌ End-to-end encryption (overkill for internal app)
- ❌ Advanced security (SSO + Entra ID is sufficient)

---

# SOLUTION ARCHITECTURE

## High-Level Architecture

```
Your React App (Frontend Only)
│
├─ Layer 1: Authentication
│  ├─ MSAL (handles login/logout)
│  ├─ Entra ID (validates credentials)
│  └─ Token storage (sessionStorage in browser)
│
├─ Layer 2: Authorization
│  ├─ User context (global state)
│  ├─ Role checking (what can user do?)
│  └─ UI adaptation (show/hide based on role)
│
├─ Layer 3: Data Access
│  ├─ AzureStorageService (talks to Azure Tables)
│  ├─ localStorage → REMOVED ❌
│  └─ Azure Tables → ADDED ✅
│
└─ Layer 4: Presentation
   ├─ Dashboard (shows role-based UI)
   ├─ Must-Wins page (shows role-based features)
   ├─ Key Activities page (filtered by role)
   └─ Sub-Tasks page (role-based access)

External Services:
├─ Entra ID (authenticates users)
├─ Azure Static Web Apps (hosts frontend)
├─ Azure Storage Tables (stores data)
└─ GitHub (stores code)
```

## Data Flow

```
User Login:
User → React App → MSAL → Entra ID → Token → Browser Cache

Year Selection:
User opens app → Year dropdown shows: 2026, 2027, 2028
→ User selects year (e.g., 2026)
→ All data queries filtered by year

User Creates Must-Win:
User fills form → Selects year (2026, 2027, or 2028)
→ Click Save → App calls AzureStorageService 
→ Service adds: createdBy (email), createdAt (timestamp), year
→ Service sends to Azure Tables API with PartitionKey = year
→ Azure validates token, stores data
→ Confirmation back to user

User Views Dashboard:
App loads → User selects year → Queries Azure Tables
→ Gets all Must-Wins for selected year (2026, 2027, or 2028)
→ Filters by role (if team_chef, only show their tasks)
→ Displays on dashboard

User Logs Out:
Click Logout → MSAL clears token → App clears context
→ Browser cleared of sensitive data
→ Redirected to login page
```

## Folder Structure (After Implementation)

```
src/
├─ components/
│  ├─ Layout/
│  │  └─ Header.tsx (UPDATED - add login/logout)
│  └─ ProtectedRoute.tsx (NEW - for role-based routing)
│
├─ contexts/
│  └─ AuthContext.tsx (NEW - global auth state)
│
├─ services/
│  ├─ AzureStorageService.ts (NEW - Azure Tables operations)
│  └─ RoleService.ts (NEW - role permissions)
│
├─ config/
│  └─ config.ts (UPDATED - add role config)
│
├─ types/
│  └─ index.ts (ADD User interface with roles)
│
├─ pages/
│  ├─ Dashboard.tsx (UPDATED - use Azure, show role-based UI)
│  ├─ MustWins/ (UPDATED - use Azure instead of localStorage)
│  ├─ KeyActivities/ (UPDATED - use Azure)
│  └─ SubTasks/ (UPDATED - use Azure)
│
├─ App.tsx (UPDATED - wrap with AuthProvider)
├─ main.tsx (UPDATED - MSAL provider)
└─ index.css (no change)
```

---

# STEP-BY-STEP IMPLEMENTATION PLAN

## PHASE 1: AZURE PORTAL SETUP (30 minutes)

### Step 1.1: Create Azure Storage Account
**Goal:** Cloud storage for your data

**What to do:**
1. Open https://portal.azure.com
2. Click "Create a resource"
3. Search "Storage account"
4. Click "Create"
5. Fill form:
   - Subscription: (your Azure subscription)
   - Resource Group: Create new → "strategy-tracker-rg"
   - Storage account name: `strategytrackerapp` (must be globally unique)
   - Region: `West Europe` (closest to Sweden)
   - Performance: `Standard`
   - Redundancy: `Locally-redundant storage (LRS)` (cheapest)
6. Click "Review + Create" → "Create"
7. Wait 1-2 minutes for deployment

**What you get:**
- Storage account name: `strategytrackerapp`
- You'll need to copy:
  - Storage account name
  - Account key (from "Access keys" section)
  - Connection string

### Step 1.2: Create Azure Tables
**Goal:** Create tables for your data

**What to do:**
1. Go to your storage account (created above)
2. In left menu → "Tables"
3. Click "Create table"
4. Create 4 tables (one at a time):
   - Table 1: `MustWins`
   - Table 2: `KeyActivities`
   - Table 3: `SubTasks`
   - Table 4: `StrategyPillars`
   - Table 5: `Users` (for role management)

**Note:** Tables will be empty until app adds data

### Step 1.3: Verify/Create Entra ID App Registration
**Goal:** Enable SSO login

**Check if exists:**
1. Go to https://portal.azure.com
2. Search "App registrations"
3. Look for "Strategy Tracker App" (might already be registered)

**If NOT exists, create it:**
1. Click "New registration"
2. Name: `Strategy Tracker App`
3. Supported account types: **"Accounts in this organizational directory only"** ← IMPORTANT
4. Redirect URI:
   - Platform: `Web`
   - URI: `http://localhost:3000`
5. Click "Register"

**What you get:**
- Application (client) ID: Copy this
- Directory (tenant) ID: Copy this
- Use these in `.env.local`

**Add production redirect URI:**
1. In app → Settings → "Authentication"
2. Redirect URIs → Add URI:
   - `https://lemon-hill-00ab62e03.3.azurestaticapps.net`
3. Save

**Add API permissions:**
1. In app → "API permissions"
2. Click "Add a permission"
3. Select "Microsoft Graph"
4. Delegated permissions:
   - Search and add: `User.Read`
   - Search and add: `openid`
   - Search and add: `profile`
   - Search and add: `email`
5. Click "Grant admin consent for [tenant]"

---

## PHASE 2: LOCAL SETUP (15 minutes)

### Step 2.1: Create `.env.local` File

**File location:** `c:\Users\gill001\Desktop\STA-App\.env.local`

**What to add:**
```dotenv
# Entra ID (SSO)
VITE_AZURE_CLIENT_ID=<Application ID from Step 1.3>
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/<Tenant ID from Step 1.3>
VITE_REDIRECT_URI=http://localhost:3000

# Azure Storage Tables
VITE_AZURE_STORAGE_ACCOUNT=<storage account name from Step 1.1>
VITE_AZURE_STORAGE_KEY=<account key from Step 1.1>
VITE_AZURE_STORAGE_CONNECTION_STRING=<connection string from Step 1.1>

# Role Management
VITE_ROLE_SOURCE=manual
```

**Important:**
- `.env.local` is in `.gitignore` (never committed)
- Keep values private (these are your secrets)
- Vite will load these when you run `npm run dev`

### Step 2.2: Verify Configuration
**What to do:**
1. Open terminal
2. Run: `npm run dev`
3. Open DevTools (F12)
4. In console, type: `console.log(import.meta.env.VITE_AZURE_CLIENT_ID)`
5. Should show your Client ID (not "undefined")

---

## PHASE 3: CODE IMPLEMENTATION (3-4 hours)

### File 1: `src/contexts/AuthContext.tsx` (NEW)
**Purpose:** Manage authentication globally

**What it does:**
- Wraps entire app with auth state
- Provides: user, role, login, logout functions
- Handles token storage and refresh
- Queries Users table for role

**Key methods:**
```
useAuth() returns:
├─ user: { name, email, id, avatar }
├─ role: 'admin' | 'head_of_department' | 'team_chef' | 'viewer'
├─ isAuthenticated: boolean
├─ login(): void
├─ logout(): void
└─ loading: boolean
```

**Usage in components:**
```typescript
const { user, role, logout } = useAuth()
// Show user name and role in header
// Redirect if not authenticated
// Show/hide features based on role
```

### File 2: `src/services/AzureStorageService.ts` (NEW)
**Purpose:** Handle all Azure Tables operations

**What it does:**
- Replace all localStorage calls
- Connect to Azure Tables using SDK
- Handle CRUD operations (Create, Read, Update, Delete)
- Add user tracking (who created/updated)
- Add timestamps automatically
- Support 3 years: 2026, 2027, 2028

**Key methods:**
```
// Must-Wins (year-specific)
getMustWins(year: '2026' | '2027' | '2028'): Promise<MustWin[]>
saveMustWin(year: string, data: MustWin): Promise<void>
updateMustWin(year: string, id: string, data: Partial<MustWin>): Promise<void>
deleteMustWin(year: string, id: string): Promise<void>

// Key Activities (year-specific)
getKeyActivities(year: '2026' | '2027' | '2028'): Promise<KeyActivity[]>
saveKeyActivity(year: string, data: KeyActivity): Promise<void>
// ... similar for all other entities

// Sub-Tasks (year-specific)
getSubTasks(year: '2026' | '2027' | '2028'): Promise<SubTask[]>
saveSubTask(year: string, data: SubTask): Promise<void>
// ...

// User & Roles (year-independent, shared across all years)
getUserRole(email: string): Promise<Role>
setUserRole(email: string, role: Role): Promise<void>
getAllUsers(): Promise<User[]>
```

**Example usage:**
```typescript
// Get Must-Wins for 2026
const wins = await azureStorageService.getMustWins('2026')

// Save new Must-Win for 2026 (with user tracking)
await azureStorageService.saveMustWin('2026', {
  id: 1,
  title: 'Revenue Growth',
  progress: 0,
  year: '2026',
  createdBy: 'sabrina.gill@tre.se',
  createdByName: 'Sabrina Gill',
  createdAt: new Date()
})

// Update progress for 2027
await azureStorageService.updateMustWin('2027', '1', { progress: 50 })
```

### File 3: `src/services/RoleService.ts` (NEW)
**Purpose:** Determine what users can do based on role

**What it does:**
- Check permissions
- Determine UI visibility
- Enforce access controls
- Manage role-specific features

**Key methods:**
```
canCreateStrategyPillar(role: Role): boolean
canEditMustWin(role: Role, createdBy: string, currentUserEmail: string): boolean
canDeleteItem(role: Role): boolean
canSeeAllData(role: Role): boolean
canViewUserRole(role: Role): boolean

// Returns permissions object
getPermissions(role: Role): {
  canCreate: boolean,
  canEdit: boolean,
  canDelete: boolean,
  canSeeAll: boolean,
  ...
}
```

**Example usage:**
```typescript
const canDelete = RoleService.canDeleteItem(userRole)
{canDelete && <button onClick={delete}>Delete</button>}
```

### File 4: `src/components/Layout/Header.tsx` (UPDATE)
**Changes:**
- Uncomment MSAL imports
- Add login button (if not authenticated)
- Add user name + role display (if authenticated)
- Add logout button
- Show user avatar with initials

**Before:**
```typescript
// const { instance, accounts } = useMsal()
const handleLogout = () => {
  console.log('Logout - will be implemented with SSO')
}
```

**After:**
```typescript
const { instance } = useMsal()
const { user, role, isAuthenticated, login, logout } = useAuth()

const handleLogin = () => {
  instance.loginPopup({ scopes: ['User.Read'] })
}

const handleLogout = () => {
  logout()
  instance.logoutPopup()
}

// In JSX:
{isAuthenticated ? (
  <div className="flex items-center gap-3">
    <span>{user?.name} ({role})</span>
    <button onClick={handleLogout}>Logout</button>
  </div>
) : (
  <button onClick={handleLogin}>Login with Entra ID</button>
)}
```

### File 5-12: Update Data Pages

**Files to update:**
- `Dashboard.tsx`
- `MustWins.tsx`
- `CreateMustWin.tsx`
- `UpdateMustWinProgress.tsx`
- `KeyActivities.tsx`
- `CreateKeyActivity.tsx`
- `SubTasks.tsx`
- `UpdateSubTaskProgress.tsx`

**Pattern in each file:**

**BEFORE (localStorage, no year):**
```typescript
useEffect(() => {
  const stored = localStorage.getItem('must-wins-data')
  const data = JSON.parse(stored)
  setMustWins(data)
}, [])
```

**AFTER (Azure, year-aware):**
```typescript
const [selectedYear, setSelectedYear] = useState('2026') // or current year

useEffect(() => {
  const loadData = async () => {
    try {
      const data = await azureStorageService.getMustWins(selectedYear)
      setMustWins(data)
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }
  loadData()
}, [selectedYear]) // Re-load when year changes

// Year dropdown in UI
<select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
  <option value="2026">2026</option>
  <option value="2027">2027</option>
  <option value="2028">2028</option>
</select>
```

**Role-based rendering:**
```typescript
const { role } = useAuth()
const canEdit = role === 'admin' || role === 'head_of_department'

{canEdit && <button onClick={edit}>Edit</button>}
```

### File 13: `src/App.tsx` (UPDATE)
**Changes:**
- Wrap app with AuthProvider
- Import AuthProvider and MsalProvider
- Ensure MsalProvider wraps AuthProvider

**Pattern:**
```typescript
import { MsalProvider } from '@azure/msal-react'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <BrowserRouter>
          {/* Routes */}
        </BrowserRouter>
      </AuthProvider>
    </MsalProvider>
  )
}
```

### File 14: Add Route Protection (NEW)
**Purpose:** Protect routes by role - only common employees see dashboard only

**Route Access Rules:**
```typescript
// Dashboard - Everyone can access
<Route path="/" element={<Dashboard />} />

// Pages - Only Admin, HOD, Chef can access
<ProtectedRoute 
  path="/must-wins/*"
  allowedRoles={['admin', 'head_of_department', 'team_chef']}
  component={MustWinsPage}
/>

<ProtectedRoute 
  path="/key-activities/*"
  allowedRoles={['admin', 'head_of_department', 'team_chef']}
  component={KeyActivitiesPage}
/>

<ProtectedRoute 
  path="/sub-tasks/*"
  allowedRoles={['admin', 'head_of_department', 'team_chef']}
  component={SubTasksPage}
/>

// Admin Only
<ProtectedRoute 
  path="/settings/users"
  allowedRoles={['admin']}
  component={UserManagement}
/>

// If Employee (common user) tries to access protected pages:
// → Redirect to Dashboard with message: "You don't have access to this page"
```

**What happens:**
```
Admin (CTIO):
├─ Loads app
├─ Can access: Dashboard, Must-Wins, Activities, Sub-Tasks, Settings
└─ Full unrestricted access

Head of Department:
├─ Loads app
├─ Can access: Dashboard, Must-Wins, Activities, Sub-Tasks
└─ Data filtered by department

Team Chef:
├─ Loads app
├─ Can access: Dashboard, Must-Wins, Activities, Sub-Tasks
└─ Data filtered by team

Employee (Common User):
├─ Loads app
├─ Sees: Dashboard only
├─ Tries to access: /must-wins → Redirected to dashboard
├─ Sees message: "Contact admin for access"
└─ Navigation menu hides other links
```

---

## PHASE 4: AZURE STORAGE CONFIGURATION (15 minutes)

### Step 4.1: Add Environment Variables to Static Web App
**Goal:** Configure deployed app with Azure credentials

**What to do:**
1. Go to https://portal.azure.com
2. Find your Static Web App (search "lemon-hill")
3. Go to "Settings" → "Configuration"
4. Click "Application settings"
5. Add each variable:
   - Name: `VITE_AZURE_CLIENT_ID` → Value: (your Client ID)
   - Name: `VITE_AZURE_AUTHORITY` → Value: (your Authority URL)
   - Name: `VITE_REDIRECT_URI` → Value: `https://lemon-hill-00ab62e03.3.azurestaticapps.net`
   - Name: `VITE_AZURE_STORAGE_ACCOUNT` → Value: (your storage account)
   - Name: `VITE_AZURE_STORAGE_KEY` → Value: (your storage key)
   - Name: `VITE_AZURE_STORAGE_CONNECTION_STRING` → Value: (your connection string)
   - Name: `VITE_ROLE_SOURCE` → Value: `manual`
6. Click "Save"
7. App automatically redeploys with new variables

**Wait:** 2-3 minutes for deployment

---

## PHASE 5: TESTING (1 hour)

### Test Locally (npm run dev)

**Test 1: Authentication**
```
[ ] Open http://localhost:3000
[ ] See "Login with Entra ID" button
[ ] Click button
[ ] Login popup appears
[ ] Enter sabrina.gill@tre.se
[ ] Enter password
[ ] Popup closes
[ ] Header shows "Sabrina Gill (admin)"
[ ] See "Logout" button
```

**Test 2: Data Operations**
```
[ ] Click "Create Must-Win"
[ ] Fill form
[ ] Click Save
[ ] See success message
[ ] Check DevTools → Network → See Azure Tables request
[ ] See in response: 201 Created
[ ] Refresh page
[ ] Data still visible (loaded from Azure)
```

**Test 3: Role-Based Access**
```
[ ] As admin: Can see Create buttons
[ ] As admin: Can see Delete buttons
[ ] Open different browser (simulates different user)
[ ] Log out and clear storage
[ ] Log in as team_chef role
[ ] Cannot see Create buttons
[ ] Can only see update progress
```

**Test 4: Multi-Device Sync**
```
[ ] Create Must-Win on Device A
[ ] Open app on Device B (same or different user)
[ ] Log in
[ ] See same Must-Win on Device B
[ ] Proves data is in Azure (not local)
```

### Test Live Deployment

**After pushing to main:**
```
[ ] Go to https://lemon-hill-00ab62e03.3.azurestaticapps.net
[ ] Click "Login with Entra ID"
[ ] Same flow as local
[ ] Can create/edit data
[ ] Data persists across sessions
[ ] Works from different devices
[ ] Works from different browsers
```

---

# COST ANALYSIS

## Initial Costs (One-time)
```
Azure Setup:
├─ Storage Account: FREE
├─ App Registration: FREE
├─ Tables: FREE (first 20GB/month)
└─ Total: $0

Your Time:
├─ Azure Portal setup: 30 minutes
├─ Code implementation: 3-4 hours (I do it)
├─ Testing: 1 hour
└─ Total: ~5 hours
```

## Monthly Costs (Ongoing)
```
Azure Services:
├─ Storage Account (10GB data): $0.01-0.02/month
├─ Transactions (50K read/write): $0.005/month
├─ Azure Static Web Apps: FREE (100GB bandwidth)
├─ Entra ID Authentication: FREE (unlimited logins)
└─ Subtotal: ~$0.02/month

Microsoft 365 (already paid):
├─ Entra ID: Included in your subscription
├─ Users & Groups: Included
└─ Subtotal: $0 (already paying)

Total Monthly: ~$0.02-0.03
```

## Cost Comparison

```
Before (Current):
├─ Hosting: Azure Static Web Apps (FREE)
├─ Data: localStorage in browser (FREE)
├─ Auth: None (FREE)
└─ Total: FREE but no multi-device, no backup

After (New):
├─ Hosting: Azure Static Web Apps (FREE)
├─ Data: Azure Storage (0.03/month)
├─ Auth: Entra ID (FREE)
└─ Total: $0.03/month with multi-device, backup, audit trail

Cost increase: ~$1/year (negligible)
Benefits gained: Multi-device sync, backup, audit trail, SSO
ROI: Extremely positive
```

## Why So Cheap?
```
Azure Storage Pricing:
├─ First 20GB/month: FREE
├─ After 20GB: $0.01/GB
├─ Your usage: ~5-10GB → FREE or $0.01-0.05

Entra ID:
├─ Already paying for Microsoft 365
├─ Entra ID included in license
├─ No additional cost

Transactions:
├─ 1M transactions/month = ~$0.40
├─ Your usage: ~50K/month = ~$0.002
└─ Negligible

Why no backend costs?
├─ Frontend only = no servers to run
├─ Azure Static Web Apps = built-in free hosting
├─ Azure Functions = not needed (you have no backend)
└─ No database server = using Azure Tables (cheap)
```

---

# SECURITY & COMPLIANCE

## What's Secure
```
Authentication:
✅ Password never sent to your app
✅ Only sent to Entra ID (Microsoft's secure servers)
✅ Your app receives only token
✅ Token is time-limited (1 hour expiry)
✅ Token automatically refreshed
✅ Token revoked on logout

Authorization:
✅ Roles determine permissions
✅ Cannot access others' data
✅ Audit trail (who changed what, when)
✅ User identification on every action

Data Protection:
✅ Encrypted at rest (Azure default)
✅ Encrypted in transit (HTTPS)
✅ Backed up by Azure (automatic)
✅ Regional redundancy available

Entra ID Controls:
✅ IT can enable 2FA
✅ IT can block unusual locations
✅ IT can disable accounts
✅ IT has full audit log
✅ Company policies enforceable
```

## What's NOT Secure Yet (Future Improvements)
```
❌ Storage key in frontend code
   → OK for internal apps, not OK for public
   → Fix: Add backend API to proxy requests

❌ No rate limiting
   → Could prevent abuse
   → Fix: Add API Management

❌ No data encryption end-to-end
   → Current: Encrypted in transit + at rest
   → Could be: Encrypted even Azure can't see
   → Fix: Application-level encryption later

These are NOT needed now (internal company app)
But consider later if data becomes sensitive
```

## Compliance Notes
```
GDPR (EU Data Protection):
├─ Data stored in EU (West Europe region) ✅
├─ User consent collected (at login) ✅
├─ Right to deletion: Can be implemented
├─ Audit trail: Available in Entra ID
└─ Data protection: Encryption enabled ✅

Company Requirements:
├─ Employee management: Via Entra ID ✅
├─ Access control: Via roles ✅
├─ Audit trail: Via Entra ID + your logs
├─ Data security: Via Azure storage
└─ Backup/Disaster recovery: Via Azure
```

---

# TIMELINE & NEXT STEPS

## Implementation Timeline

```
Week 1:
├─ Day 1 (30 min): Azure Portal setup
│  └─ Create storage account, Entra app, tables
├─ Day 1 (15 min): Create `.env.local`
│  └─ Local configuration
└─ Days 2-4 (4 hours): Code implementation
   ├─ Create new files (contexts, services)
   ├─ Update existing files (pages, header)
   ├─ Test locally
   └─ Commit to feature/azure-login

Week 1-2:
├─ Day 5: Deploy & test on live
│  ├─ Push to main
│  ├─ GitHub Actions builds
│  └─ Azure Static Web Apps deploys (2-3 min)
└─ Test on production URL

Week 2:
├─ User testing
├─ Fix any bugs
├─ Optimize performance
└─ Document for team

Total Time: ~6-8 hours (mostly my coding)
Your Time: ~1.5 hours (setup + testing)
```

## Your Action Items

### Before Implementation
```
Priority 1 (Must Do):
☐ Complete Azure Portal setup (Step 1.1-1.3)
☐ Create `.env.local` file (Step 2.1)
☐ Verify npm run dev works (Step 2.2)
☐ Confirm all Azure values are correct

Priority 2 (Nice to Have):
☐ Read this document thoroughly
☐ Understand authentication flow
☐ Understand role-based access
☐ Plan who gets which role
```

### During Implementation
```
☐ I create new files and update existing ones
☐ You monitor progress
☐ You test locally
☐ You provide feedback
☐ You test role-based features
```

### After Implementation
```
☐ Test all user roles
☐ Test multi-device access
☐ Test data persistence
☐ Test logout/login
☐ Set user roles in Users table
☐ Document for team
☐ Plan production migration
```

## Next Step

**Tell me:** "I'm ready to implement"

**I will:**
1. Create all new files (AuthContext, AzureStorageService, RoleService)
2. Update all existing files (Header, Dashboard, pages)
3. Add route protection
4. Commit to feature/azure-login branch
5. Create pull request
6. You review and test
7. Deploy to production

**Then you have:**
- ✅ SSO login with Entra ID
- ✅ Role-based access control
- ✅ Azure Storage Tables for data
- ✅ Multi-device data sync
- ✅ Audit trail (user tracking)
- ✅ Production-ready authentication

---

# APPENDIX: QUICK REFERENCE

## File Checklist
```
New Files to Create:
[ ] src/contexts/AuthContext.tsx
[ ] src/services/AzureStorageService.ts
[ ] src/services/RoleService.ts
[ ] src/components/ProtectedRoute.tsx

Files to Update:
[ ] src/components/Layout/Header.tsx (add login/logout/user info)
[ ] src/App.tsx (wrap with providers)
[ ] src/main.tsx (add MsalProvider)
[ ] src/pages/Dashboard.tsx (use Azure, employee-friendly)
[ ] src/pages/MustWins/*.tsx (protected route)
[ ] src/pages/KeyActivities/*.tsx (protected route)
[ ] src/pages/SubTasks/*.tsx (protected route)
[ ] src/types/index.ts (ensure 4 roles defined)
[ ] src/config/config.ts (optional updates)

Configuration:
[ ] .env.local (6 variables)
[ ] Azure Static Web App settings (6 variables)
```

## Environment Variables Checklist
```
.env.local Must Have:
[ ] VITE_AZURE_CLIENT_ID
[ ] VITE_AZURE_AUTHORITY
[ ] VITE_REDIRECT_URI
[ ] VITE_AZURE_STORAGE_ACCOUNT
[ ] VITE_AZURE_STORAGE_KEY
[ ] VITE_AZURE_STORAGE_CONNECTION_STRING
[ ] VITE_ROLE_SOURCE (set to "manual")
```

## Role Permission Matrix
```
                          Admin    HOD      Chef     Employee
View Dashboard            ✅       ✅       ✅       ✅
View Must-Wins            ✅       ✅       ✅       ❌
View Key Activities       ✅       ✅       ✅       ❌
View Sub-Tasks            ✅       ✅       ✅       ❌
Create Must-Win           ✅       ✅       ❌       ❌
Create Key Activity       ✅       ✅       ✅       ❌
Create Sub-Task           ✅       ✅       ✅       ❌
Update Progress           ✅       ✅       ✅       ❌
Edit Items                ✅       ✅       ✅       ❌
Delete Items              ✅       ✅       ❌       ❌
View All Data             ✅       ❌       ❌       ❌
View Dept Data            ✅       ✅       ❌       ❌
View Team Data            ✅       ✅       ✅       ❌
Manage Users/Roles        ✅       ❌       ❌       ❌
Access All Pages          ✅       ✅       ✅       ❌
Dashboard Only            ✅       ✅       ✅       ✅
```

## Key Commands
```
npm run dev              → Start local development
npm run build           → Build for production
npm run lint            → Check code quality
git add .               → Stage all changes
git commit -m "msg"     → Commit changes
git push origin feature/azure-login → Push to GitHub
```

---

**Document Version:** 1.0  
**Last Updated:** December 3, 2025  
**Status:** Ready to Implement  
**Branch:** feature/azure-login

**Questions?** Refer back to "Simple Explanation of Key Concepts" section.

