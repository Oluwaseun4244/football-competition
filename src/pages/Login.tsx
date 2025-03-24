import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { usePostQuery } from '../utils/apiUtils';
import Button from '../components/ui/Button';
const Login: React.FC = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);


  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { mutate: login, isPending } = usePostQuery('auth/login', {
    onSuccess: (data: any) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/teams');
    },
    onError: (error) => {
      // console.log(error);
      alert(error.response.data.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {


    e.preventDefault();
    if (formData.email && formData.password) {
      login({ user_name: formData.email, password: formData.password });
      //
      // auth?.login(formData.email, formData.password);

      // if (auth?.isAdmin) {
      //   navigate('/');
      // } else {
      //   navigate(`/team/${encodeURIComponent(auth?.teamName || '')}`);
      // }
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Supreme Prima Liga
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your team
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <Button
              text={'Sign in'}
              bg="bg-blue-600"
              disabled={isPending}
              isLoading={isPending}
              type="submit"
              classNames="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            // onClick={handleSubmit}
            />

          </div>
        </form>

        <div className="text-sm text-center text-gray-600">
          <p>Demo credentials:</p>
          <p>Admin: admin@example.com / any password</p>
          <p>Team: team@example.com / any password</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 