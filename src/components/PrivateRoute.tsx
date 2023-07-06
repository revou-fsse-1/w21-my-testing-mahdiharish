import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('token') !== null;
  if (!isAuthenticated) {
    toast.error('You need to login in order to access the dashboard!', {
      position: toast.POSITION.TOP_CENTER
    });
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}

export default PrivateRoute;