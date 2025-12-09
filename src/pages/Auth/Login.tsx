import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { login, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-orange-500 to-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-orange-500 to-primary">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/3 Line Logo - white.png"
            alt="Tre Logo"
            className="h-16 mx-auto mb-4 invert"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <h1 className="text-2xl font-bold text-gray-900">Strategy Tracker</h1>
          <p className="text-gray-500 mt-2">Sign in to continue</p>
        </div>

        {/* Login Button */}
        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {/* Microsoft Logo */}
          <svg className="w-6 h-6" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
          </svg>
          Sign in with Microsoft
        </button>

        {/* Info */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Supports Microsoft personal and corporate accounts
        </p>
      </div>
    </div>
  );
};

export default Login;
