import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    general: ''
  });
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      email: '',
      password: '',
      general: ''
    };

    // ユーザーネームのバリデーション
    if (username.length < 4) {
      newErrors.username = 'ユーザー名は4文字以上で入力してください';
      isValid = false;
    }

    // メールアドレスのバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
      isValid = false;
    }

    // パスワードのバリデーション
    if (password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await register(username, email, password);
      console.log(response.message);
      navigate('/home');
    } catch (err: unknown) {
      setErrors(prev => ({
        ...prev,
        general: err instanceof Error ? err.message : 'エラーが発生しました'
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    setter(e.target.value);
    // 入力時にそのフィールドのエラーメッセージをクリア
    setErrors(prev => ({
      ...prev,
      [e.target.name]: '',
      general: ''
    }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">新規登録</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="username"
            placeholder="ユーザー名"
            value={username}
            onChange={(e) => handleInputChange(e, setUsername)}
            className={`w-full p-2 border rounded ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => handleInputChange(e, setEmail)}
            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => handleInputChange(e, setPassword)}
            className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errors.general}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          登録
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;