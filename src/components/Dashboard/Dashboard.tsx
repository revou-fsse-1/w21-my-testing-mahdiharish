import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';

interface Category {
  id?: string;
  name: string;
  is_active: boolean;
}

const schema = yup.object().shape({
  id: yup.string().optional(),
  name: yup.string().required('Name is required'),
  is_active: yup.boolean().required('Status is required'),
});

function Dashboard() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Category>({
    resolver: yupResolver<Category>(schema),
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCategories(token);
    }
  }, []);

  const fetchCategories = useCallback(async (token: string) => {
    try {
      const response = await axios.get<{ data: Category[] }>('https://mock-api.arikmpt.com/api/category', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleAddCategory = useCallback(async (data: Category) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post<{ data: Category }>(
        'https://mock-api.arikmpt.com/api/category/create',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage('Category added successfully.');
      const newCategory: Category = {
        ...response.data.data,
      };
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      reset();
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Failed to add category.');
      console.error(error);
    }
  }, [reset]);

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://mock-api.arikmpt.com/api/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage('Category deleted successfully.');
      const updatedCategories = categories.filter(category => category.id !== categoryId);
      setCategories(updatedCategories);
    } catch (error) {
      setErrorMessage('Failed to delete category.');
      console.error(error);
    }
  }, [categories]);

  const handleEditCategory = useCallback((categoryId: string) => {
    navigate(`/category/edit/${categoryId}`);
  }, [navigate]);

  const activeCategories = useMemo(() => {
    return categories.filter(category => category.is_active);
  }, [categories]);

  const inactiveCategories = useMemo(() => {
    return categories.filter(category => !category.is_active);
  }, [categories]);

  return (
    <div className="container mx-auto flex flex-col items-center">
      <h1 className="text-3xl font-bold my-6">Dashboard Page</h1>
      <div className="my-6">
        <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleSubmit(handleAddCategory)} className="flex items-end">
          <div className="mr-2">
            <input type="text" {...register('name')} placeholder="Category Name" className="border p-2" />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
          <div className="mr-2">
            <select {...register('is_active')} className="border p-2">
              <option value="">Select Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            {errors.is_active && <p className="text-red-500">{errors.is_active.message}</p>}
          </div>
          <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">
            Add Category
          </button>
        </form>
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
      <div className="my-6">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <table className="w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border-b py-2 px-2 md:px-4">ID</th>
              <th className="border-b py-2 px-2 md:px-4">Name</th>
              <th className="border-b py-2 px-2 md:px-4">Status</th>
              <th className="border-b py-2 px-2 md:px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {activeCategories.map((category) => (
              <tr key={category.id ?? ''}>
                <td className="border-b py-2 px-2 md:px-4">{category.id}</td>
                <td className="border-b py-2 px-2 md:px-4">{category.name}</td>
                <td className="border-b py-2 px-2 md:px-4">{category.is_active ? 'Active' : 'Inactive'}</td>
                <td className="border-b py-2 px-2 md:px-4">
                  <button onClick={() => handleEditCategory(category.id!)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteCategory(category.id!)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 mr-2">
                    Delete
                  </button>
                  <Link to={`/category/${category.id}`} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700 mr-2">
                    Details
                  </Link>
                </td>
              </tr>
            ))}
            {inactiveCategories.map((category) => (
              <tr key={category.id ?? ''}>
                <td className="border-b py-2 px-2 md:px-4">{category.id}</td>
                <td className="border-b py-2 px-2 md:px-4">{category.name}</td>
                <td className="border-b py-2 px-2 md:px-4">{category.is_active ? 'Active' : 'Inactive'}</td>
                <td className="border-b py-2 px-2 md:px-4">
                  <button onClick={() => handleEditCategory(category.id!)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteCategory(category.id!)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 mr-2">
                    Delete
                  </button>
                  <Link to={`/category/${category.id}`} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700 mr-2">
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
