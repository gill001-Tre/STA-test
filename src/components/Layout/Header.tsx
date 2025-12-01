import { Link, useLocation } from 'react-router-dom'
// import { useMsal } from '@azure/msal-react'
import { useState, useRef, useEffect } from 'react'

const Header = () => {
  const location = useLocation()
  // const { instance, accounts } = useMsal()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [isPillarsDropdownOpen, setIsPillarsDropdownOpen] = useState(false)
  const [isMustWinsDropdownOpen, setIsMustWinsDropdownOpen] = useState(false)
  const [isKeyActivitiesDropdownOpen, setIsKeyActivitiesDropdownOpen] = useState(false)
  const pillarsDropdownRef = useRef<HTMLDivElement>(null)
  const mustWinsDropdownRef = useRef<HTMLDivElement>(null)
  const keyActivitiesDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pillarsDropdownRef.current && !pillarsDropdownRef.current.contains(event.target as Node)) {
        setIsPillarsDropdownOpen(false)
      }
      if (mustWinsDropdownRef.current && !mustWinsDropdownRef.current.contains(event.target as Node)) {
        setIsMustWinsDropdownOpen(false)
      }
      if (keyActivitiesDropdownRef.current && !keyActivitiesDropdownRef.current.contains(event.target as Node)) {
        setIsKeyActivitiesDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navItems = [
    { name: 'Strategic Overview', path: '/dashboard' },
  ]

  const pillarsSubMenu = [
    { name: 'Create Strategy Pillar', path: '/strategy-pillars/create' },
    { name: 'Show all Strategies', path: '/strategy-pillars' },
  ]

  const mustWinsSubMenu = [
    { name: 'Create Win', path: '/must-wins/create' },
    { name: 'Show all Wins', path: '/must-wins' },
    { name: 'Update Win Progress', path: '/must-wins/progress' },
  ]

  const keyActivitiesSubMenu = [
    { name: 'Create Key Activity', path: '/key-activities/create' },
    { name: 'Show all Key Activities', path: '/key-activities' },
    { name: 'Update Activity Progress', path: '/key-activities/progress' },
    { name: 'Create Sub-task', path: '/sub-tasks/create' },
    { name: 'Show all Sub-tasks', path: '/sub-tasks' },
    { name: 'Update Subtask Progress', path: '/sub-tasks/progress' },
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
              
              {/* Key Activities with Dropdown */}
              <div className="relative" ref={keyActivitiesDropdownRef}>
                <button
                  onClick={() => setIsKeyActivitiesDropdownOpen(!isKeyActivitiesDropdownOpen)}
                  className={`hover:text-gray-200 transition-colors flex items-center gap-1 ${
                    location.pathname.includes('/key-activities') || location.pathname.includes('/sub-tasks') ? 'border-b-2 border-white' : ''
                  }`}
                >
                  Key Activities
                  <svg 
                    className={`w-4 h-4 transition-transform ${isKeyActivitiesDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isKeyActivitiesDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                    {keyActivitiesSubMenu.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsKeyActivitiesDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Must-Wins with Dropdown */}
              <div className="relative" ref={mustWinsDropdownRef}>
                <button
                  onClick={() => setIsMustWinsDropdownOpen(!isMustWinsDropdownOpen)}
                  className={`hover:text-gray-200 transition-colors flex items-center gap-1 ${
                    location.pathname.includes('/must-wins') ? 'border-b-2 border-white' : ''
                  }`}
                >
                  Must-Wins
                  <svg 
                    className={`w-4 h-4 transition-transform ${isMustWinsDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isMustWinsDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                    {mustWinsSubMenu.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMustWinsDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Strategic Pillars with Dropdown */}
              <div className="relative" ref={pillarsDropdownRef}>
                <button
                  onClick={() => setIsPillarsDropdownOpen(!isPillarsDropdownOpen)}
                  className={`hover:text-gray-200 transition-colors flex items-center gap-1 ${
                    location.pathname.includes('/strategy-pillars') ? 'border-b-2 border-white' : ''
                  }`}
                >
                  Strategic Pillars
                  <svg 
                    className={`w-4 h-4 transition-transform ${isPillarsDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isPillarsDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                    {pillarsSubMenu.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsPillarsDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
