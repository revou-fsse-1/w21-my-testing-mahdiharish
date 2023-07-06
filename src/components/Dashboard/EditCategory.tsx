import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Category } from '../types';

const EditCategoryPage = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<{ data: Category }>(
          `https://mock-api.arikmpt.com/api/category/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategory(response.data.data);
        setName(response.data.data.name);
        setIsActive(response.data.data.is_active);
      } catch (error) {
        console.error('Failed to fetch category:', error);
      }
    };
    fetchCategory();
  }, [categoryId]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put<{ data: Category }>(
        `https://mock-api.arikmpt.com/api/category/update`,
        { id: categoryId, name, is_active: isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Update response:', response);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };
  if (!category) {
    return <div>Loading...</div>;
  }
  console.log('Category:', category);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="text-center">Edit Category</h2>
              </div>
            </div>
            <form className="mt-10" onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div className="relative mt-4">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-5 w-5"
                />
                <label htmlFor="isActive" className="ml-2 text-gray-700">
                  Active
                </label>
              </div>
              <div className="block">
                <button
                  type="submit"
                  className="mt-8 bg-blue-500 text-white rounded-lg px-4 py-2 transition duration-300 ease-in-out hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryPage;
