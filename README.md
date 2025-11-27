# Tre Strategy Tracker

A modern web application to track strategy progress across organizational levels with Azure SSO authentication and SharePoint integration.

## 🎯 Overview

The Strategy Tracker enables companies to monitor and manage their strategic initiatives across multiple organizational levels:
- **Strategy Pillars**: High-level strategic objectives
- **Must-Wins**: Critical initiatives aligned to pillars
- **Key Activities**: Actionable projects with KPIs
- **Sub-tasks**: Granular tasks for team execution

## 🚀 Features

- ✅ **Azure AD SSO Authentication** - Secure single sign-on
- ✅ **Azure Table Storage** - Scalable data persistence
- ✅ **SharePoint Integration** - Live dashboard embedding
- ✅ **Real-time Progress Tracking** - Visual progress indicators
- ✅ **Multi-level Hierarchy** - From strategy to execution
- ✅ **KPI Management** - Baseline, Target, and Stretch goals
- ✅ **Role-based Access** - Admin, Department Heads, Team Chiefs
- ✅ **Year-based Filtering** - Multi-year strategy tracking

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Authentication**: MSAL.js (Microsoft Authentication Library)
- **Storage**: Azure Table Storage
- **Build Tool**: Vite
- **Charts**: Recharts
- **State Management**: Zustand

## 📋 Prerequisites

- Node.js 18+ and npm
- Azure subscription
- Azure AD tenant
- Azure Storage Account

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/gill001-Tre/strategy-tracker-app.git
cd strategy-tracker-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Azure AD

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Configure:
   - Name: `Strategy Tracker`
   - Redirect URI: `http://localhost:3000` (SPA)
5. Note the **Application (client) ID** and **Directory (tenant) ID**

### 4. Configure Azure Storage

1. Create an Azure Storage Account
2. Create the following tables:
   - `StrategyPillars`
   - `MustWins`
   - `KeyActivities`
   - `SubTasks`
   - `Users`
   - `KPIs`
3. Note the **Storage Account Name** and **Access Key**

### 5. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Azure AD Configuration
VITE_AZURE_CLIENT_ID=your_client_id_here
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/your_tenant_id_here
VITE_REDIRECT_URI=http://localhost:3000

# Azure Storage Configuration
VITE_AZURE_STORAGE_ACCOUNT=your_storage_account_name
VITE_AZURE_STORAGE_KEY=your_storage_account_key
VITE_AZURE_STORAGE_CONNECTION_STRING=your_connection_string
```

### 6. Run Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## 🌐 SharePoint Integration

To embed the dashboard in SharePoint:

1. Build the application for production
2. Deploy to Azure Static Web Apps or similar hosting
3. In SharePoint, add a **Web Part** > **Embed**
4. Use the production URL as the embed source
5. Configure CORS in Azure to allow SharePoint domain

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   └── Layout/          # Layout components
├── config/              # Configuration files
├── pages/               # Page components
│   ├── Auth/           # Authentication pages
│   ├── Dashboard/      # Dashboard views
│   ├── StrategyPillars/
│   ├── MustWins/
│   ├── KeyActivities/
│   └── SubTasks/
├── services/           # API and data services
├── stores/             # State management
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## 🔐 Authentication Flow

1. User accesses the application
2. If not authenticated, redirected to Microsoft login
3. User signs in with company SSO credentials
4. MSAL acquires access token
5. Token used for Azure Storage API calls
6. User session maintained in sessionStorage

## 📊 Data Model

### Strategy Pillars
- Partition Key: Year
- Row Key: Unique ID
- Fields: Title, Description, Wins Count

### Must-Wins
- Partition Key: Strategy Pillar ID
- Row Key: Unique ID
- Fields: Title, Description, Progress, Status, Deadline

### Key Activities
- Partition Key: Must-Win ID
- Row Key: Unique ID
- Fields: Title, Description, KPIs, Sub-tasks Count

### Sub-tasks
- Partition Key: Key Activity ID
- Row Key: Unique ID
- Fields: Title, Description, Progress, Status

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📝 License

This project is proprietary and confidential.

## 👥 Support

For issues or questions, please contact the development team.
