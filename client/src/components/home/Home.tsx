import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  username: string;
  email: string;
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/current-user', {
          withCredentials: true // クッキーを含めるために必要
        });
        
        setUser(response.data);
        setLoading(false);
      } catch (error: unknown) {
        console.error('Failed to fetch user:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // 認証エラーの場合、ログインページにリダイレクト
          navigate('/login');
        } else {
          setError('Failed to load user data');
        }
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/logout', {}, { withCredentials: true });
      navigate('/login'); // ログアウト後、ログインページにリダイレクト
    } catch (error) {
      console.error('Failed to log out:', error);
      setError('Failed to log out');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Username:</span> {user.username}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Home;