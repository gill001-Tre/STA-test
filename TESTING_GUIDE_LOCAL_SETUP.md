# Local Setup - Complete Test Guide

## Overview
All foundations are now in place! This guide helps you test the year-aware storage and role-based access control implementation.

## Current Setup Status

✅ **Completed:**
- Year-aware storage system (all CRUD pages)
- 4 test users with role-based access
- Year selector (2026, 2027, 2028)
- User switcher dropdown
- Menu visibility based on roles
- Dashboard year-specific data loading

## Test Scenarios

### 1. User Role Testing

#### Test 1a: Employee Role (View-Only Dashboard)
1. Open http://localhost:3001
2. Click user avatar (top right) → Select "Common Employee"
3. **Expected:** Only Dashboard menu, NO other nav items (Pillars, Wins, Activities, etc.)
4. **Verify:** No Create/Edit buttons visible
5. Try direct URL: /strategy-pillars → **Should see Access Denied message**

#### Test 1b: CTIO Role (Full Access)
1. Click user avatar → Select "CTIO User"
2. **Expected:** Full navigation menu appears (Pillars, Must-Wins, Key Activities)
3. **Verify:** Can access all pages

#### Test 1c: Head of Department & Teamchef (Full Access)
1. Click user avatar → Select "Head of Department" or "Teamchef"
2. **Expected:** Full navigation menu and all CRUD access
3. **Verify:** Same as CTIO

### 2. Year-Aware Storage Testing

#### Test 2a: Year Isolation
1. **Login as CTIO**
2. **Create data in 2026:**
   - Go to Strategy Pillars → Create Pillar
   - Enter: Title="2026 Pillar Test", Description="Testing 2026"
   - Click Save
3. **Verify Dashboard shows:** 1 Pillar, 0 Must-wins
4. **Switch to 2027:**
   - Click year selector (dropdown showing "2026")
   - Select "2027"
5. **Verify Dashboard shows:** 0 Pillars, 0 Must-wins (empty year)
6. **Switch back to 2026:**
   - Select "2026" again
7. **Verify Dashboard shows:** 1 Pillar again ✅

#### Test 2b: User-Specific Data Per Year
1. **Login as CTIO**
2. **Switch to 2026, create pillar** (as above)
3. **Switch to "Head of Department"**
4. **Verify:** User changed in dropdown
5. **Verify Dashboard shows:** Same 1 Pillar (data is shared across users)
6. **Create another pillar:**
   - Strategy Pillars → Create New
   - Title="HD Test Pillar", Description="By Head of Department"
   - Save
7. **Dashboard now shows:** 2 Pillars (2026 data merged)
8. **Switch to "Employee"**
9. **Verify:** Dashboard shows 2 Pillars (can view but no menu to create)

### 3. Year + User Switching Testing

#### Test 3a: Complex Scenario
1. **Login as CTIO**
2. **Year 2026:** Create Pillar "2026-CTIO"
3. **Switch to "Head of Department"**
4. **Year 2026:** Create Pillar "2026-HD"
5. **Switch Year to 2027**
6. **Year 2027:** Create Pillar "2027-HD"
7. **Verify Dashboard:**
   - 2027: Shows 1 Pillar (2027-HD)
   - Switch to 2026: Shows 2 Pillars (2026-CTIO, 2026-HD)
8. **Switch back to CTIO**
9. **Verify Dashboard:**
   - 2026: Still shows 2 Pillars (data persists per year, not per user)

### 4. Data Persistence Testing

#### Test 4a: Page Refresh
1. **Create a pillar in 2026 as CTIO**
2. **Open DevTools (F12) → Console**
3. **Hard Refresh (Ctrl+Shift+R)**
4. **Verify Dashboard still shows the pillar** ✅

#### Test 4b: Browser LocalStorage Check
1. **Open DevTools → Application → LocalStorage**
2. **Look for these keys:**
   - `auth-user-2026` → Should contain current user
   - `strategy-pillars-data-2026` → Should contain pillar(s)
   - `must-wins-data-2026` → Empty or populated
   - `key-activities-data-2026` → Empty or populated
   - `sub-tasks-data-2026` → Empty or populated

3. **Verify keys exist for:**
   - 2026 (has data)
   - 2027 (if you created data there)
   - 2028 (should be empty if unused)

### 5. Menu Visibility Testing

#### Test 5a: Employee Role Menu
1. **Switch to Employee role**
2. **Verify hidden:**
   - Strategic Pillars menu
   - Must-Wins menu
   - Key Activities menu (with Sub-tasks)
3. **Visible elements:**
   - Strategic Overview (Dashboard)
   - Year selector
   - User switcher

#### Test 5b: CTIO/HD/TC Role Menu
1. **Switch to CTIO role**
2. **Verify visible:**
   - Strategic Pillars ✓
   - Must-Wins ✓
   - Key Activities (with Sub-tasks submenu) ✓

### 6. CRUD Operations Testing

#### Test 6a: Create Pillar
1. **Login as CTIO, Year 2026**
2. Strategic Pillars → Create New
3. Enter: Title="Test Pillar", Description="Line 1\nLine 2"
4. Save → Should redirect to Pillars list
5. Verify pillar appears in list
6. Dashboard should show: 1 Pillar

#### Test 6b: Create Must-Win
1. **Must-Wins → Create New**
2. Select Pillar: "Test Pillar" (if created above)
3. Enter: Title="Test Win", Owner="John", Deadline="2026-12-31"
4. Save
5. Verify Must-win appears in list
6. Dashboard should show: 1 Must-win

#### Test 6c: Create Key Activity
1. **Key Activities → Create New**
2. Assign to Must-Win: "Test Win" (if created above)
3. Enter: Title="Test Activity", Description="Testing"
4. Save
5. Dashboard should show: 1 Key Activity

#### Test 6d: Create Sub-Task
1. **Sub-Tasks → Create New**
2. Assign to Key Activity: "Test Activity"
3. Enter: Title="Test Subtask"
4. Save
5. Dashboard should show: 1 Sub-task total

### 7. Data Hierarchy Testing

#### Test 7a: Verify Linkage
1. **Created:** Pillar → Must-Win → Activity → Sub-task
2. **Edit Must-Win:**
   - Must-Wins → Edit "Test Win"
   - Should show "Test Pillar" as assigned
   - Verify assignment editable
3. **Edit Key Activity:**
   - Activities → Edit "Test Activity"
   - Should show "Test Win" as assigned parent

### 8. Year Switching Performance

#### Test 8a: Quick Year Switches
1. **Have data in 2026 and 2027**
2. **Rapidly switch:** 2026 → 2027 → 2026 → 2028
3. **Verify:**
   - Dashboard updates instantly
   - No data bleeding between years
   - Correct counts for each year

## Console Testing Commands

Open DevTools Console (F12) and run these:

```javascript
// Check user for current year (2026)
console.log('Current User:', localStorage.getItem('auth-user-2026'))

// Check all pillars for 2026
console.log('Pillars 2026:', JSON.parse(localStorage.getItem('strategy-pillars-data-2026') || '[]'))

// Check all must-wins for 2026
console.log('Must-wins 2026:', JSON.parse(localStorage.getItem('must-wins-data-2026') || '[]'))

// List all storage keys
console.log('All keys:', Object.keys(localStorage).filter(k => k.includes('2026')))

// Clear all 2026 data (for testing)
Object.keys(localStorage).forEach(k => {
  if (k.includes('-2026')) localStorage.removeItem(k)
})
console.log('Cleared 2026 data - Dashboard should now show zeros')
```

## Expected Test Results

| Test | Expected | Status |
|------|----------|--------|
| Employee sees Dashboard only | No nav menu | ✓ |
| CTIO sees full menu | All nav items | ✓ |
| Year 2026 data isolated | Only 2026 data shown | ✓ |
| Year 2027 empty | 0 counts | ✓ |
| User persistence | Saved per year | ✓ |
| Create pillar works | Dashboard +1 | ✓ |
| Data survives refresh | Still there | ✓ |
| Menu shows/hides | Based on role | ✓ |

## Troubleshooting

### Issue: Menu still shows for Employee
**Solution:** 
- Hard refresh (Ctrl+Shift+R)
- Check localStorage for auth-user entries
- Verify role is "Employee" not "employee"

### Issue: Data not persisting
**Solution:**
- Check DevTools → Application → LocalStorage
- Look for keys like `strategy-pillars-data-2026`
- If missing, data wasn't saved properly
- Try creating again

### Issue: Wrong year data showing
**Solution:**
- Check year selector in header
- Verify it matches the data
- Look at localStorage key names

### Issue: Can access /strategy-pillars as Employee
**Solution:**
- This is expected (ProtectedRoute not yet in App.tsx routes)
- You'll see "Access Denied" message
- UI menu is properly hidden

## Next Phase Features (Not Yet Implemented)

- ✅ Year-aware storage
- ✅ Role-based menu visibility
- ✅ User switching
- ⏳ Edit/Delete operations (need to verify they work)
- ⏳ Progress tracking/updates
- ⏳ Role-based button visibility (Create/Edit/Delete)
- ⏳ Azure storage integration
- ⏳ SSO authentication

## Quick Start for Testing

```
1. Start: npm run dev
2. Open: http://localhost:3001
3. Switch to: CTIO role (user dropdown)
4. Create: One of each (Pillar, Win, Activity, Subtask)
5. Verify: Dashboard counts +1 for each
6. Switch year: 2027
7. Verify: Dashboard shows 0 (year isolated)
8. Switch back: 2026
9. Verify: Dashboard shows previous data
10. Switch user: Employee
11. Verify: No menu, can't create, but can view dashboard
```

## File Structure Reference

```
CRUD Updates Applied To:
├── StrategyPillars/
│   ├── CreateStrategyPillar.tsx ✓
│   ├── StrategyPillars.tsx ✓
│   └── EditStrategyPillar.tsx ✓
├── MustWins/
│   ├── CreateMustWin.tsx ✓
│   ├── MustWins.tsx ✓
│   ├── EditMustWin.tsx ✓
│   └── UpdateMustWinProgress.tsx ✓
├── KeyActivities/
│   ├── CreateKeyActivity.tsx ✓
│   ├── KeyActivities.tsx ✓
│   ├── UpdateKeyActivity.tsx ✓
│   └── UpdateKeyActivitiesProgress.tsx ✓
└── SubTasks/
    ├── CreateSubTask.tsx ✓
    ├── SubTasks.tsx ✓
    ├── UpdateSubTask.tsx ✓
    └── UpdateSubTaskProgress.tsx ✓

Core Changes:
├── contexts/
│   ├── AuthContext.tsx ✓ (4 test users, role-based)
│   └── YearContext.tsx ✓ (2026-2028 selection)
├── utils/
│   └── storageHelper.ts ✓ (year-aware storage)
├── components/
│   ├── Layout/Header.tsx ✓ (year + user selectors, menu hiding)
│   └── ProtectedRoute.tsx ✓ (role-based access)
└── pages/
    └── Dashboard/Dashboard.tsx ✓ (year-aware data loading)
```

## Success Criteria

All tests passing = ✅ Ready for next phase:
- [ ] Employee can't access non-Dashboard pages (menu hidden)
- [ ] Year data is isolated (2026 ≠ 2027)
- [ ] User switching works and persists
- [ ] Year switching works and persists
- [ ] CRUD creates items visible in Dashboard
- [ ] Data survives page refresh
- [ ] localStorage keys follow pattern: `key-YYYY`

---
Last Updated: December 4, 2025
Status: Feature/local-setup branch - Ready for Testing
