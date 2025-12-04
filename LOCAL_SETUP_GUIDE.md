# Local Setup Guide - Test Flow Implementation

## Overview
This guide documents the local setup implementation for the Strategy Tracker App, including year-aware storage, role-based authentication, and user switching functionality following the test flow diagram.

## Completed Setup (Foundation)

### 1. Year-Aware Storage System
**File**: `src/utils/storageHelper.ts`

Implemented utility functions for managing localStorage with year prefixes:
- `getYearStorageKey(baseKey, year)` - Generate year-specific keys
- `saveToYearStorage(baseKey, data, year)` - Save year-specific data
- `loadFromYearStorage(baseKey, year)` - Load year-specific data
- `removeFromYearStorage(baseKey, year)` - Remove year-specific data
- `getYearsWithData(baseKey)` - Get all years with data for a key
- `clearYearData(year)` - Clear all data for a specific year
- `migrateToYearPrefixedStorage(baseKey, year)` - Backwards compatibility

**Storage Keys**:
- `STRATEGY_PILLARS: 'strategy-pillars-data'`
- `MUST_WINS: 'must-wins-data'`
- `KEY_ACTIVITIES: 'key-activities-data'`
- `SUB_TASKS: 'sub-tasks-data'`
- `AUTH_USER: 'auth-user'`

### 2. Authentication Context with Test Users
**File**: `src/contexts/AuthContext.tsx`

Created auth context with 4 test users matching the test flow:
- **CTIO** (ctio@tre.se) - Avatar: CT
- **Head of Department** (hod@tre.se) - Avatar: HD
- **Teamchef** (chef@tre.se) - Avatar: TC
- **Employee** (employee@tre.se) - Avatar: EM

**Features**:
- `useAuth()` hook for accessing auth context
- `switchUser(user)` function for switching between test users
- Year-aware user storage (user preference per year)
- `getTestUsers()` to get all test users
- `getUserByRole(role)` to get user by role

### 3. Year Context
**File**: `src/contexts/YearContext.tsx`

Manages selected year state across the app:
- Available years: [2026, 2027, 2028]
- Default year: 2026
- `useYear()` hook to access year context
- `setSelectedYear()` to change selected year

### 4. Header Component Updates
**File**: `src/components/Layout/Header.tsx`

Enhanced header with:
- **Year Selector**: Dropdown to switch between 2026, 2027, 2028
- **User Switcher**: Click user avatar to switch between test users
- Displays current user name, role, and email
- Shows which user is currently selected
- Quick logout option

### 5. Dashboard Year-Aware Loading
**File**: `src/pages/Dashboard/Dashboard.tsx`

Updated to use year-aware storage:
- Imports `useYear` hook and storage helpers
- Loads data for selected year only
- Updates when `selectedYear` changes (dependency array)
- Displays counts for:
  - Strategy Pillars (for selected year)
  - Must-wins (for selected year)
  - Key Activities (for selected year)
  - Total Sub-tasks (for selected year)

### 6. Provider Setup
**File**: `src/main.tsx`

Added providers in correct order:
```tsx
<MsalProvider>
  <AuthProvider>
    <YearProvider>
      <App />
    </YearProvider>
  </AuthProvider>
</MsalProvider>
```

## Test Flow Verification

The implementation supports the test flowchart:

### Roles & Permissions
- ✅ CTIO: Full access to all functions
- ✅ Head of Department: Access to department data
- ✅ Teamchef: Access to team data
- ✅ Employee: Dashboard view only

### Data Isolation
- ✅ Year-aware storage (2026, 2027, 2028)
- ✅ Each user can have different data per year
- ✅ Switching years shows year-specific data
- ✅ Switching users shows user-specific preferences

### Navigation Hierarchy
- Dashboard (view-only for all)
- Strategy Pillars → Must-Wins → Key Activities → Sub-Tasks
- Each level properly nested

## What Still Needs Implementation

### 1. Update CRUD Pages for Year-Aware Storage

Files to update with year-aware storage:

#### Strategy Pillars
- `src/pages/StrategyPillars/CreateStrategyPillar.tsx`
- `src/pages/StrategyPillars/StrategyPillars.tsx`
- `src/pages/StrategyPillars/EditStrategyPillar.tsx`

#### Must-Wins
- `src/pages/MustWins/CreateMustWin.tsx`
- `src/pages/MustWins/MustWins.tsx`
- `src/pages/MustWins/EditMustWin.tsx`
- `src/pages/MustWins/UpdateMustWinProgress.tsx`

#### Key Activities
- `src/pages/KeyActivities/CreateKeyActivity.tsx`
- `src/pages/KeyActivities/KeyActivities.tsx`
- `src/pages/KeyActivities/UpdateKeyActivity.tsx`
- `src/pages/KeyActivities/UpdateKeyActivitiesProgress.tsx`
- `src/pages/KeyActivities/KeyActivityDetail.tsx`

#### Sub-Tasks
- `src/pages/SubTasks/CreateSubTask.tsx`
- `src/pages/SubTasks/SubTasks.tsx`
- `src/pages/SubTasks/UpdateSubTask.tsx`
- `src/pages/SubTasks/UpdateSubTaskProgress.tsx`

**Pattern to Apply**:
```tsx
import { useYear } from '@/contexts/YearContext'
import { loadFromYearStorage, saveToYearStorage, STORAGE_KEYS } from '@/utils/storageHelper'

// In component
const { selectedYear } = useYear()

// When loading
const data = loadFromYearStorage(STORAGE_KEYS.STORAGE_KEY, selectedYear)

// When saving
saveToYearStorage(STORAGE_KEYS.STORAGE_KEY, updatedData, selectedYear)

// Add selectedYear to useEffect dependencies
useEffect(() => { ... }, [selectedYear])
```

### 2. Implement Role-Based Access Control

Create ProtectedRoute component that checks user role:
- File: `src/components/ProtectedRoute.tsx`
- Check user role before allowing access
- Redirect to dashboard for unauthorized access

### 3. Add Role-Based UI Visibility

Components that should be hidden for certain roles:
- Create/Edit/Delete buttons for non-CTIO users
- Assign functions for head of department only
- Progress update for specific roles

### 4. Test Data Creation UI

Add quick-start data creation for testing:
- Buttons to generate sample data for each year
- Pre-populated pillars, wins, activities, tasks
- Reset data button to clear current year

## Current Testing Status

### ✅ What You Can Test Now
1. Switch between 4 test users via user dropdown
2. Switch between years 2026, 2027, 2028
3. View dashboard with year-specific counts (empty for new years)
4. Data persists per year (try: create data in 2026, switch to 2027, switch back)

### ❌ What Will Work After Full Implementation
1. Create strategy pillars (year-aware)
2. Create must-wins linked to pillars
3. Create key activities linked to wins
4. Create sub-tasks linked to activities
5. Update progress at each level
6. View data separated by year
7. Role-based permission enforcement

## Running Tests

### To Test Year-Aware Functionality
1. Open DevTools Console (F12)
2. Create pillar in 2026 via UI (after CRUD updates)
3. Switch to year 2027
4. Verify dashboard shows 0 pillars
5. Switch back to 2026
6. Verify dashboard shows your pillar

### To Test User Switching
1. Click user avatar in header
2. Select different user
3. Verify user info updates
4. Check localStorage: `auth-user-2026` should change

### To Test Storage
```javascript
// In Console
localStorage.getItem('auth-user-2026')  // See current user
localStorage.getItem('strategy-pillars-data-2026')  // See pillars for 2026
localStorage.getItem('strategy-pillars-data-2027')  // See pillars for 2027
```

## Next Steps

1. Run `git commit` to save foundation work
2. Update all CRUD pages with year-aware storage pattern
3. Implement role-based access control
4. Add role-based UI visibility
5. Create test data generation utilities
6. Test complete flow with all 4 users and 3 years

## File Dependencies

```
src/
  contexts/
    AuthContext.tsx ─────────┐
    YearContext.tsx ─────────┤
  utils/                      │
    storageHelper.ts ─────────┤
  components/                 │
    Layout/Header.tsx ─────────┤─── Uses all above
  pages/                      │
    Dashboard/Dashboard.tsx ───┤
    StrategyPillars/*.tsx ─────┤
    MustWins/*.tsx ────────────┤
    KeyActivities/*.tsx ───────┤
    SubTasks/*.tsx ────────────┘
```

## Notes

- All storage keys use format: `{baseKey}-{year}`
- Year defaults to 2026 in YearContext
- Auth defaults to CTIO user
- Year changes should trigger data reload via useEffect dependency
- All CRUD pages should import and use year context
- Storage helpers handle null/undefined gracefully
