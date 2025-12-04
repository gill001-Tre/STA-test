# Testing Report - Phase 1 Local Implementation
**Date:** December 3, 2025
**Environment:** Local Development (npm run dev)
**Branch:** feature/azure-login

---

## Test Summary
This document systematically tests all functionality for each role and each page.

### Roles to Test:
1. ✅ **CTIO** - Full access to all pages
2. ✅ **HeadOf** - Full access to all pages
3. ✅ **TeamChef** - Full access to all pages
4. ✅ **Employee** - Dashboard only access

---

## TEST 1: AUTHENTICATION & LOGIN

### Test 1.1: User Login Dropdown
**Expected:** 4 mock users available in login dropdown
- [ ] Login button visible when not authenticated
- [ ] Click login shows dropdown with 4 users
- [ ] Users listed: CTIO, HeadOf, TeamChef, Employee
- [ ] Each user shows correct role label

**Status:** 🔲 Not Tested

### Test 1.2: User Profile Display
**Expected:** After login, user profile shows in header
- [ ] User name displayed
- [ ] User role displayed (CTIO, HeadOf, TeamChef, Employee)
- [ ] User avatar (first letter) displayed
- [ ] User profile dropdown shows email and role

**Status:** 🔲 Not Tested

### Test 1.3: Logout Functionality
**Expected:** Logout clears authentication
- [ ] Logout button visible in user dropdown
- [ ] Click logout redirects to dashboard
- [ ] Login button appears again
- [ ] User data cleared from localStorage

**Status:** 🔲 Not Tested

---

## TEST 2: HEADER NAVIGATION BY ROLE

### Test 2.1: CTIO Role Navigation
**Expected:** Full menu visible
- [ ] Logo visible
- [ ] Year selector visible (2026, 2027, 2028)
- [ ] Navigation menu visible with:
  - [ ] Strategic Overview
  - [ ] Key Activities (with Sub-tasks submenu)
  - [ ] Must-Wins
  - [ ] Strategic Pillars
- [ ] User profile/logout visible

**Status:** 🔲 Not Tested

### Test 2.2: HeadOf Role Navigation
**Expected:** Full menu visible (same as CTIO)
- [ ] Logo visible
- [ ] Year selector visible
- [ ] Navigation menu visible (full)
- [ ] User profile/logout visible

**Status:** 🔲 Not Tested

### Test 2.3: TeamChef Role Navigation
**Expected:** Full menu visible (same as CTIO)
- [ ] Logo visible
- [ ] Year selector visible
- [ ] Navigation menu visible (full)
- [ ] User profile/logout visible

**Status:** 🔲 Not Tested

### Test 2.4: Employee Role Navigation
**Expected:** Minimal menu (no navigation links)
- [ ] Logo visible
- [ ] Year selector visible
- [ ] Navigation menu NOT visible (hidden)
- [ ] User profile/logout visible

**Status:** 🔲 Not Tested

---

## TEST 3: YEAR SELECTOR FUNCTIONALITY

### Test 3.1: Year Filter Changes Data (CTIO Role)
**Expected:** Switching years shows different data or empty
- [ ] Select 2026 → Dashboard shows data (if created)
- [ ] Select 2027 → Dashboard shows empty (no data)
- [ ] Select 2028 → Dashboard shows empty (no data)
- [ ] Switch back to 2026 → Shows 2026 data again

**Status:** 🔲 Not Tested

### Test 3.2: Year Persists Across Navigation
**Expected:** Selected year maintained when navigating
- [ ] Select year 2027
- [ ] Navigate to Must-Wins page
- [ ] Year selector shows 2027
- [ ] Data is year-specific

**Status:** 🔲 Not Tested

---

## TEST 4: PAGE ACCESS CONTROL (CTIO ROLE)

### Test 4.1: Dashboard Page (Public)
**Expected:** Accessible without restrictions
- [ ] Page loads successfully
- [ ] Shows Strategic Performance Overview
- [ ] Shows Strategy Pillars section
- [ ] Shows Must-Wins section
- [ ] Shows Key Activities section
- [ ] Statistics display correctly

**Status:** 🔲 Not Tested

### Test 4.2: Strategic Pillars Pages
**Expected:** Accessible for CTIO
- [ ] /strategy-pillars → Loads successfully
- [ ] /strategy-pillars/create → Loads successfully
- [ ] Can create new pillar
- [ ] Can edit existing pillar

**Status:** 🔲 Not Tested

### Test 4.3: Must-Wins Pages
**Expected:** Accessible for CTIO
- [ ] /must-wins → Loads successfully
- [ ] /must-wins/create → Loads successfully
- [ ] Can create new must-win
- [ ] Can edit must-win
- [ ] Can update progress

**Status:** 🔲 Not Tested

### Test 4.4: Key Activities Pages
**Expected:** Accessible for CTIO
- [ ] /key-activities → Loads successfully
- [ ] /key-activities/create → Loads successfully
- [ ] Can create new activity
- [ ] Can view activity details
- [ ] Can update progress

**Status:** 🔲 Not Tested

### Test 4.5: Sub-Tasks Pages
**Expected:** Accessible for CTIO
- [ ] /sub-tasks → Loads successfully
- [ ] /sub-tasks/create → Loads successfully
- [ ] Can create new sub-task
- [ ] Can edit sub-task
- [ ] Can update progress

**Status:** 🔲 Not Tested

---

## TEST 5: PAGE ACCESS CONTROL (HeadOf ROLE)

### Test 5.1: All Pages Accessible
**Expected:** Same access as CTIO
- [ ] Dashboard accessible
- [ ] Strategy Pillars accessible
- [ ] Must-Wins accessible
- [ ] Key Activities accessible
- [ ] Sub-Tasks accessible

**Status:** 🔲 Not Tested

---

## TEST 6: PAGE ACCESS CONTROL (TeamChef ROLE)

### Test 6.1: All Pages Accessible
**Expected:** Same access as CTIO
- [ ] Dashboard accessible
- [ ] Strategy Pillars accessible
- [ ] Must-Wins accessible
- [ ] Key Activities accessible
- [ ] Sub-Tasks accessible

**Status:** 🔲 Not Tested

---

## TEST 7: PAGE ACCESS CONTROL (Employee ROLE)

### Test 7.1: Dashboard Accessible
**Expected:** Employee can view dashboard
- [ ] /dashboard → Loads successfully
- [ ] Shows Strategic Performance Overview
- [ ] Shows strategy data

**Status:** 🔲 Not Tested

### Test 7.2: Restricted Pages Show Access Denied
**Expected:** Employee blocked from other pages
- [ ] /strategy-pillars → "Access Denied" message
- [ ] /must-wins → "Access Denied" message
- [ ] /key-activities → "Access Denied" message
- [ ] /sub-tasks → "Access Denied" message
- [ ] Access Denied shows correct role

**Status:** 🔲 Not Tested

### Test 7.3: Menu Links Hidden
**Expected:** Employee doesn't see navigation menu
- [ ] No navigation menu in header
- [ ] Can't accidentally click menu links
- [ ] User profile dropdown still works

**Status:** 🔲 Not Tested

---

## TEST 8: ROLE SWITCHING

### Test 8.1: Switch Between Roles
**Expected:** Can switch roles from user dropdown
- [ ] Login as CTIO
- [ ] Open user dropdown
- [ ] "Switch Test User" section visible
- [ ] Can click to switch to HeadOf
- [ ] Role updates correctly in header
- [ ] Access changes appropriately

**Status:** 🔲 Not Tested

### Test 8.2: All Role Switches Work
**Expected:** Can switch to all 4 roles
- [ ] CTIO → HeadOf → TeamChef → Employee → CTIO (full cycle)
- [ ] Header updates each time
- [ ] Role label correct
- [ ] Access control reflects new role

**Status:** 🔲 Not Tested

---

## TEST 9: DATA STORAGE & PERSISTENCE

### Test 9.1: Data Persists on Page Reload
**Expected:** Data saved in localStorage
- [ ] Create must-win in 2026
- [ ] Refresh page
- [ ] Must-win still exists
- [ ] Data intact

**Status:** 🔲 Not Tested

### Test 9.2: Year-Specific Storage
**Expected:** Data stored separately per year
- [ ] Create must-win in 2026
- [ ] Switch to 2027
- [ ] No must-win visible
- [ ] Switch back to 2026
- [ ] Must-win reappears

**Status:** 🔲 Not Tested

### Test 9.3: User Data Persists
**Expected:** Login state persists on refresh
- [ ] Login as CTIO
- [ ] Refresh page
- [ ] Still logged in as CTIO
- [ ] User info displayed

**Status:** 🔲 Not Tested

---

## TEST 10: ERROR HANDLING

### Test 10.1: Invalid Route Access
**Expected:** Proper error handling
- [ ] Navigate to non-existent route
- [ ] Error handled gracefully

**Status:** 🔲 Not Tested

### Test 10.2: Access Denied Displays Role
**Expected:** Employee sees informative message
- [ ] Employee tries to access /must-wins
- [ ] Message: "You don't have permission to access this page"
- [ ] Shows role: "Employee"

**Status:** 🔲 Not Tested

---

## TEST 11: UI/UX

### Test 11.1: Header Responsive
**Expected:** Header works on different screen sizes
- [ ] Desktop view: Full nav visible
- [ ] Mobile view: Navigation hidden (md:flex hidden)
- [ ] Year selector always visible
- [ ] User profile always visible

**Status:** 🔲 Not Tested

### Test 11.2: Dropdowns Work
**Expected:** Dropdowns open/close correctly
- [ ] Year selector dropdown works
- [ ] User profile dropdown works
- [ ] Click outside to close
- [ ] Multiple dropdowns don't conflict

**Status:** 🔲 Not Tested

### Test 11.3: Role Labels Display
**Expected:** Correct role labels shown
- [ ] CTIO shows as "CTIO"
- [ ] HeadOf shows as "HeadOf"
- [ ] TeamChef shows as "TeamChef"
- [ ] Employee shows as "Employee"

**Status:** 🔲 Not Tested

---

## TEST 12: INTEGRATION TESTS

### Test 12.1: Complete User Journey - CTIO
**Expected:** Full workflow works
1. [ ] Login as CTIO
2. [ ] Navigate to Strategy Pillars
3. [ ] Create new pillar
4. [ ] Navigate to Must-Wins
5. [ ] Create must-win for pillar
6. [ ] Change year to 2027
7. [ ] See no data
8. [ ] Change back to 2026
9. [ ] See created data
10. [ ] Logout

**Status:** 🔲 Not Tested

### Test 12.2: Complete User Journey - Employee
**Expected:** Limited workflow works
1. [ ] Login as Employee
2. [ ] See dashboard only
3. [ ] Menu hidden
4. [ ] Change year to 2027
5. [ ] See empty dashboard
6. [ ] Try to access /must-wins
7. [ ] See "Access Denied"
8. [ ] Click back to dashboard
9. [ ] Dashboard works
10. [ ] Logout

**Status:** 🔲 Not Tested

### Test 12.3: Role Transition Workflow
**Expected:** Switching roles works seamlessly
1. [ ] Login as Employee
2. [ ] Menu hidden, dashboard only
3. [ ] Switch to CTIO
4. [ ] Menu appears
5. [ ] Can access all pages
6. [ ] Switch back to Employee
7. [ ] Menu hidden again
8. [ ] Access denied on other pages

**Status:** 🔲 Not Tested

---

## TESTING CHECKLIST

### Before Testing:
- [ ] `npm run dev` is running
- [ ] Browser open to `http://localhost:3001` (or current port)
- [ ] Clear browser cache/localStorage if needed
- [ ] All files compiled without errors

### Quick Reference - Test Credentials:
- **CTIO:** ctio@tre.se / CTIO
- **HeadOf:** hod@tre.se / HeadOf
- **TeamChef:** chef@tre.se / TeamChef
- **Employee:** employee@tre.se / Employee

### Years Available:
- 2026
- 2027
- 2028

---

## SUMMARY

### Total Tests: 50+
### Tests Passed: 🔲
### Tests Failed: 🔲
### Tests Skipped: 🔲

### Critical Issues Found:
- [ ] None yet

### Minor Issues Found:
- [ ] None yet

### Notes:
(To be filled during testing)

---

## Sign-Off

**Tested By:** [Your Name]
**Date Tested:** [Date]
**Overall Status:** [PASS/FAIL]
**Ready for Production:** [YES/NO]
