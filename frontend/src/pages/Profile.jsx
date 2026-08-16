import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';

function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-md mx-auto mt-10 px-6">
        <h1 className="text-2xl font-semibold text-text-primary mb-6">
          Profile
        </h1>
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <div>
            <p className="text-xs font-medium text-text-secondary mb-1">Name</p>
            <p className="text-sm text-text-primary">{user?.name}</p>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-xs font-medium text-text-secondary mb-1">Email</p>
            <p className="text-sm text-text-primary">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;