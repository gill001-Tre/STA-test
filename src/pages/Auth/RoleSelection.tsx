import { useState } from 'react';
import { useAuth, ROLE_INFO, UserRole } from '@/contexts/AuthContext';

const RoleSelection = () => {
  const { selectRole } = useAuth();
  const [saving, setSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roles: { role: UserRole; icon: string }[] = [
    { role: 'CTIO', icon: '' },
    { role: 'HeadOfDepartment', icon: '' },
    { role: 'Teamchef', icon: '' },
    { role: 'Employee', icon: '' },
  ];

  const handleSelectRole = async (role: UserRole) => {
    setSelectedRole(role);
    setSaving(true);
    try {
      await selectRole(role);
    } catch (error) {
      console.error('Failed to save role:', error);
      setSaving(false);
      setSelectedRole(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-orange-500 to-primary p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
          <p className="text-gray-500 mt-2">
            This is your first login. Please select your role:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roles.map(({ role, icon }) => {
            const info = ROLE_INFO[role];
            const isSelected = selectedRole === role;

            return (
              <button
                key={role}
                onClick={() => handleSelectRole(role)}
                disabled={saving}
                className={`
                  flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200
                  ${isSelected
                    ? 'border-primary bg-orange-50 ring-2 ring-orange-200'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }
                  ${saving && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <span className="text-4xl mb-3">{icon}</span>
                <span className="font-semibold text-gray-900">{info.title}</span>
                <span className="text-sm text-gray-500 text-center mt-1">
                  {info.description}
                </span>
                {isSelected && saving && (
                  <div className="mt-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {saving && (
          <p className="text-center text-gray-500 mt-6">
            Saving your selection...
          </p>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;
