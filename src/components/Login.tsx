// import { useContext, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { UserContext } from './UserContext';

// const schema = yup.object().shape({
//   email: yup.string().email('Please enter a valid email address.').required('Email is required.'),
//   password: yup
//     .string()
//     .min(8, 'Password must be at least 8 characters long.')
//     .matches(
//       /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
//       'Password must contain at least one letter and one number.'
//     )
//     .required('Password is required.'),
// });

// interface LoginFormValues {
//   email: string;
//   password: string;
// }

// function Login() {
//   const { setUser, setToken } = useContext(UserContext);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormValues>({
//     resolver: yupResolver(schema),
//   });

//   const handleLogin = async (data: LoginFormValues) => {
//     const { email, password } = data;

//     try {
//       const response = await fetch('https://mock-api.arikmpt.com/api/user/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email,
//           password,
//         }),
//       });

//       if (response.ok) {
//         const { token } = await response.json();
//         const user = { email, isLoggedIn: true };
//         setUser(user);
//         setToken(token);
//         localStorage.setItem('token', token);
//         console.log(token) // Store token in local storage
//         navigate('/dashboard');
//       } else {
//         const { error } = await response.json();
//         setError(error);
//       }
//     } catch (error) {
//       setError('An error occurred. Please try again.');
//     }
//   };

import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
      const { token } = response.data.data; // Get the token from the response
      localStorage.setItem('token', token); // Store the token in local storage
      navigate('/dashboard');
    } else {
      setError('Failed to login.');
    }
  } catch (error) {
    setError('An error occurred. Please try again.');
    console.error(error);
  }
};


  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            <input type="text" {...register('email')} className="border border-gray-300 px-3 py-2 rounded w-full" />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password:</label>
            <input type="password" {...register('password')} className="border border-gray-300 px-3 py-2 rounded w-full" />
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

