import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux'
import { loginSuccess, loginFailure } from './redux/actions';

interface TokenResponse {
  data: any;
  token: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address.').required('Email is required.'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must contain at least one letter and one number.')
    .required('Password is required.'),
});

interface LoginFormValues {
  email: string;
  password: string;
}

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  });

const handleLogin = async (data: LoginFormValues) => {
  const { email, password } = data;

  try {
    const response = await axios.post<TokenResponse>('https://mock-api.arikmpt.com/api/user/login', {
      email,
      password,
    });

    if (response.status === 200) {
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      dispatch(loginSuccess(token));
      navigate('/dashboard');
    } else {
      dispatch(loginFailure('Failed to login.'));
      setError('Failed to login.');
    }
  } catch (error) {
    dispatch(loginFailure('An error occurred. Please try again.'));
    console.error(error);
  }
};


  return (
    <div data-testid="login" className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email:</label>
            <input id="email" type="text" {...register('email')} className="border border-gray-300 px-3 py-2 rounded w-full" />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">Password:</label>
            <input id="password" type="password" {...register('password')} className="border border-gray-300 px-3 py-2 rounded w-full" />
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
        <p className="mt-4">
          Don't have an account? <Link to="/register" className="text-blue-500">Register here</Link>.
        </p>
      </div>
    </div>
  );
}

export default Login;

