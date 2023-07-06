import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux'
import { registerSuccess, registerFailure } from './redux/actions';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().required('Email is required').email('Invalid email address'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
});

function Register() {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const handleRegister = async (data: { name: string, email: string; password: string }) => {
    try {
      const response = await fetch('https://mock-api.arikmpt.com/api/user/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        dispatch(registerSuccess());
        navigate('/login');
      } else {
        const { error } = await response.json();
        dispatch(registerFailure(error));
        throw new Error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div data-testid="register" className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Registration Page</h2>
        <form onSubmit={handleSubmit(handleRegister)}>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2">Name:</label>
              <input id="name" type="text" {...register('name')} className="border border-gray-300 px-3 py-2 rounded w-full" />
              {errors.name && <p>{errors.name.message}</p>}
          </div>
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
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
        </form>
        <p className="mt-4">
          Already have an account? <Link data-testid="loginPage" to="/login" className="text-blue-500">Login here</Link>.
        </p>
      </div>
    </div>
  );
}

export default Register;
