import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  is_active: boolean;
}

function CategoryDetails() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    console.log(categoryId);

    const token = localStorage.getItem('token');
    const fetchCategory = async () => {
      try {
        const response = await axios.get<{ data: Category }>(
          `https://mock-api.arikmpt.com/api/category/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategory(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategory();
  }, [categoryId]);

  if (!category) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Loading...</h2>
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Category Details</h2>
      <p className="text-lg">
        <span className="font-bold">ID:</span> {category.id}
      </p>
      <p className="text-lg">
        <span className="font-bold">Name:</span> {category.name}
      </p>
      <p className="text-lg">
        <span className="font-bold">Status:</span> {category.is_active ? 'Active' : 'Inactive'}
      </p>
    </div>
  );
}

export default CategoryDetails;
