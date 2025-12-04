import { Link, useLocation } from 'react-router-dom'
// import { useMsal } from '@azure/msal-react'
import { useState, useRef, useEffect } from 'react'
import logo from '../../assets/logo.png'
import { useYear } from '@/contexts/YearContext'
import { useAuth, getTestUsers } from '@/contexts/AuthContext'

const Header = () => {
  const location = useLocation()
  const { selectedYear, setSelectedYear, availableYears } = useYear()
  const { user, switchUser } = useAuth()
  // const { instance, accounts } = useMsal()
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isPillarsDropdownOpen, setIsPillarsDropdownOpen] = useState(false)
  const [isMustWinsDropdownOpen, setIsMustWinsDropdownOpen] = useState(false)
  const [isKeyActivitiesDropdownOpen, setIsKeyActivitiesDropdownOpen] = useState(false)
  const [isSubTasksDropdownOpen, setIsSubTasksDropdownOpen] = useState(false)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const pillarsDropdownRef = useRef<HTMLDivElement>(null)
  const mustWinsDropdownRef = useRef<HTMLDivElement>(null)
  const keyActivitiesDropdownRef = useRef<HTMLDivElement>(null)
  const subTasksDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
      if (pillarsDropdownRef.current && !pillarsDropdownRef.current.contains(event.target as Node)) {
        setIsPillarsDropdownOpen(false)
      }
      if (mustWinsDropdownRef.current && !mustWinsDropdownRef.current.contains(event.target as Node)) {
        setIsMustWinsDropdownOpen(false)
      }
      if (keyActivitiesDropdownRef.current && !keyActivitiesDropdownRef.current.contains(event.target as Node)) {
        setIsKeyActivitiesDropdownOpen(false)
        setIsSubTasksDropdownOpen(false)
      }
      if (subTasksDropdownRef.current && !subTasksDropdownRef.current.contains(event.target as Node)) {
        setIsSubTasksDropdownOpen(false)
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
  ]

  const subTasksSubMenu = [
    { name: 'Create Sub-task', path: '/sub-tasks/create' },
    { name: 'Show all Sub-tasks', path: '/sub-tasks' },
    { name: 'Update Sub-task Progress', path: '/sub-tasks/progress' },
  ]

    const years = [2026, 2027, 2028]

  const handleLogout = () => {
    // instance.logoutPopup()
    console.log('Logout - will be implemented with SSO')
  }

  const testUsers = getTestUsers()

  return (
    <header className="bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group hover:opacity-80 transition-opacity">
            <img 
              src={logo} 
              alt="Tre Strategy Tracker Logo" 
              className="h-10 w-auto"
            />
            <span className="text-lg font-semibold hidden sm:inline">Tre Strategy Tracker</span>
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
                    {/* Key Activities Options */}
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
                    
                    {/* Divider */}
                    <div className="my-1 border-t border-gray-200"></div>
                    
                    {/* Sub-tasks Submenu */}
                    <div className="relative" ref={subTasksDropdownRef}>
                      <button
                        onClick={() => setIsSubTasksDropdownOpen(!isSubTasksDropdownOpen)}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-primary transition-colors flex items-center justify-between"
                      >
                        <span className="font-medium">Sub-tasks</span>
                        <svg 
                          className={`w-4 h-4 transition-transform ${isSubTasksDropdownOpen ? 'rotate-180' : 'rotate-270'}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      {/* Sub-tasks Submenu Items */}
                      {isSubTasksDropdownOpen && (
                        <div className="pl-4">
                          {subTasksSubMenu.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => {
                                setIsSubTasksDropdownOpen(false)
                                setIsKeyActivitiesDropdownOpen(false)
                              }}
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors text-sm"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
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
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* User Profile Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-primary hover:bg-gray-100 transition-colors text-xs font-semibold"
                title={user?.name || 'User'}
              >
                {user?.avatar || 'US'}
              </button>
              
              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.role}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <p className="px-4 py-2 text-xs font-semibold text-gray-700 uppercase">Switch User</p>
                    {testUsers.map((testUser) => (
                      <button
                        key={testUser.id}
                        onClick={() => {
                          switchUser(testUser)
                          setIsUserDropdownOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          user?.id === testUser.id
                            ? 'bg-orange-100 text-primary font-semibold'
                            : 'text-gray-800 hover:bg-orange-50 hover:text-primary'
                        }`}
                      >
                        <span className="font-medium">{testUser.name}</span>
                        <p className="text-xs text-gray-600">{testUser.role}</p>
                      </button>
                    ))}
                  </div>
                  
                  <div className="py-1 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
