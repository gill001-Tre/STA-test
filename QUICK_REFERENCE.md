# QUICK REFERENCE GUIDE
## What You Need to Know - One Page Summary

---

## THE 3-MINUTE EXPLANATION

**What is SSO (Single Sign-On)?**
- You log in ONCE with your company email
- That login works for all company apps
- You don't create new passwords
- Your company IT controls who can access

**What is Entra ID?**
- Microsoft's enterprise login system
- Your company's IT already uses it
- Secures access to Office 365, Teams, SharePoint, etc.
- Now will also secure access to Strategy Tracker

**What is Azure Storage?**
- Cloud storage (like Google Drive for databases)
- Stores your Must-Wins, Key Activities, Sub-Tasks
- Accessible from any device
- Automatic backups

**How it works (3 steps):**
1. Click "Login with Entra ID" button
2. Enter your work email & password (to Microsoft)
3. Microsoft sends token back to app = You're logged in
4. App saves/loads data from Azure (not from browser)

---

## YOUR TO-DO LIST (15 minutes)

### Step 1: Create Azure Storage
1. Go to https://portal.azure.com
2. Create resource → Storage account
3. Name: `strategytrackerapp`
4. Region: West Europe
5. Create
6. Copy: Account name, Key, Connection string

### Step 2: Configure Entra ID App
1. Go to App Registrations
2. Find your app
3. Check: "Accounts in this organizational directory only" ✅
4. Add Redirect URI: `https://lemon-hill-00ab62e03.3.azurestaticapps.net`
5. Copy: Client ID, Tenant ID

### Step 3: Create `.env.local`
1. Create file: `c:\Users\gill001\Desktop\STA-App\.env.local`
2. Paste content:
```dotenv
VITE_AZURE_CLIENT_ID=<Client ID>
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/<Tenant ID>
VITE_REDIRECT_URI=http://localhost:3000
VITE_AZURE_STORAGE_ACCOUNT=<Storage account name>
VITE_AZURE_STORAGE_KEY=<Key>
VITE_AZURE_STORAGE_CONNECTION_STRING=<Connection string>
```
3. Save

---

## WHAT I'LL DO (2 hours)

- ✅ Create Azure Storage Service
- ✅ Add "Login with Entra ID" button
- ✅ Update all 8 pages
- ✅ Test everything
- ✅ Push to GitHub

---

## AFTER IMPLEMENTATION - HOW TO USE

### User Login Flow:
1. App opens
2. User clicks "Login with Entra ID"
3. Enters email: `sabrina@tre.se`
4. Enters password
5. Optional: 2FA code
6. Header shows: "Sabrina Gill (sabrina@tre.se) | Logout"
7. Can use app normally

### Data Access:
- User creates/edits/deletes data
- Data saved to Azure (not browser)
- User logs out
- User logs in on different device
- SAME data appears ✅

---

## KEY SECURITY FEATURES

| Feature | Benefit |
|---------|---------|
| **Entra ID Login** | Only company employees can access |
| **Token Expiration** | Tokens expire in 1 hour (automatic refresh) |
| **IT Control** | When employee leaves, IT disables account instantly |
| **Audit Logs** | IT can see who logged in when |
| **No Password Storage** | Your app never stores passwords (Microsoft does) |
| **Cloud Backup** | Azure automatically backs up data |

---

## COSTS

- **Azure Storage:** ~$0.02/month
- **Transactions:** ~$0.005/month
- **Authentication:** FREE
- **App Hosting:** FREE (already have it)
- **TOTAL:** ~$0.03/month

✅ Less than a cup of coffee per year!

---

## COMMON QUESTIONS

**Q: What if I forget the `.env.local`?**
A: It's not committed to Git, but you have the values from Azure Portal. Recreate it.

**Q: Can employees outside company login?**
A: No. Only `@tre.se` (or your domain) can login because of Entra ID configuration.

**Q: What if employee account is disabled?**
A: Next login attempt will show "Access Denied" automatically.

**Q: Does app work offline?**
A: No. Needs internet to login and access Azure storage.

**Q: Will existing localStorage data be lost?**
A: Yes, that data is in browser only. Users will start with Azure storage.

**Q: Can I keep old localStorage data?**
A: Yes, we can migrate it to Azure before enabling Entra ID.

**Q: How do I add new users?**
A: Tell IT to add them to Entra ID. They can login immediately.

---

## WHAT CHANGES FOR USERS

### BEFORE:
```
User A: Opens app → No login needed
User A: Creates Must-Win → Saved in browser only
User A: Opens on different device → Data not there
User A: Clears browser cache → Data gone
```

### AFTER:
```
User A: Opens app → Clicks "Login with Entra ID"
User A: Enters email & password → Logged in
User A: Creates Must-Win → Saved in Azure (cloud)
User A: Opens on different device → Same login → SAME data!
User A: Clears browser cache → Data still in Azure ✅
User A: Leaves company → IT disables account → Can't login ✅
```

---

## FILES I'LL CREATE/UPDATE

### Create (New):
- `src/services/AzureStorageService.ts` - Cloud storage connection

### Update (Existing):
- `src/components/Layout/Header.tsx` - Add login/logout
- `src/pages/Dashboard/Dashboard.tsx` - Load from Azure
- `src/pages/MustWins/MustWins.tsx` - Load from Azure
- `src/pages/MustWins/CreateMustWin.tsx` - Save to Azure
- `src/pages/MustWins/UpdateMustWinProgress.tsx` - Update in Azure
- `src/pages/KeyActivities/KeyActivities.tsx` - Load from Azure
- `src/pages/KeyActivities/CreateKeyActivity.tsx` - Save to Azure
- `src/pages/SubTasks/SubTasks.tsx` - Load from Azure
- `src/pages/SubTasks/UpdateSubTaskProgress.tsx` - Update in Azure

**Total: 1 new file + 8 updates**

---

## DEPLOYMENT STEPS

1. **Local Testing:**
   - `npm run dev`
   - Test login, create, edit, delete
   - Test on different browser

2. **Push to GitHub:**
   - `git push origin feature/azure-login`
   - GitHub Actions auto-deploys

3. **Add Secrets to Azure Static Web Apps:**
   - Go to Portal
   - Find Static Web App
   - Add same 6 environment variables

4. **Test Live:**
   - Visit: `https://lemon-hill-00ab62e03.3.azurestaticapps.net`
   - Login and test

5. **Create Pull Request:**
   - Review all changes
   - Merge when satisfied

---

## TIMELINE

| Phase | Duration | Who |
|-------|----------|-----|
| Azure Portal Setup | 15 mins | You |
| Code Implementation | 2 hours | Me |
| Testing | 30 mins | Both |
| Deployment | 10 mins | Me |
| **TOTAL** | **2.5 hours** | - |

---

## READY?

**When you have:**
- ✅ Azure Storage Account created
- ✅ 4 Tables created
- ✅ Entra ID app configured
- ✅ `.env.local` file created with credentials
- ✅ `npm run dev` runs without errors

**Tell me:** "Ready with Entra ID - all Azure setup complete"

**Then I'll implement all the code!**

---

## SUPPORT

If you have questions:
- Check `SSO_ENTRA_ID_EXPLAINED.md` for detailed explanations
- Check `IMPLEMENTATION_PLAN_DETAILED.md` for step-by-step guide
- Ask me directly!

---

**You've got this! 🚀**

