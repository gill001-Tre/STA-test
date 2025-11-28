import { Link, useLocation } from 'react-router-dom'
// import { useMsal } from '@azure/msal-react'
import { useState } from 'react'

const Header = () => {
  const location = useLocation()
  // const { instance, accounts } = useMsal()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const navItems = [
    { name: 'Strategic Overview', path: '/dashboard' },
    { name: 'Strategy Pillars', path: '/strategy-pillars' },
    { name: 'Must-wins', path: '/must-wins' },
    { name: 'Key Activities', path: '/key-activities' },
  ]

  const handleLogout = () => {
    // instance.logoutPopup()
    console.log('Logout - will be implemented with SSO')
  }

  const years = [2026, 2027, 2028]

  return (
    <header className="bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-xl">3</span>
            </div>
            <span className="text-xl font-semibold">Tre Strategy Tracker</span>
          </Link>

          {/* Right side - Navigation, Year Selector, and Profile */}
          <div className="flex items-center space-x-6">
            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`hover:text-gray-200 transition-colors ${
                    location.pathname === item.path ? 'border-b-2 border-white' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-white text-gray-900 px-3 py-1.5 pr-8 rounded-lg border-none outline-none cursor-pointer appearance-none bg-no-repeat bg-right"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.25rem'
              }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={handleLogout}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-primary hover:bg-gray-100 transition-colors"
                title="User Profile"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
