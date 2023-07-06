import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard/Dashboard';
import NotFound from './components/NotFound';
import CategoryDetails from './components/Dashboard/CategoryList';
import EditCategoryPage from './components/Dashboard/EditCategory';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/category/:categoryId" element={<PrivateRoute><CategoryDetails /></PrivateRoute>} />
        <Route path="/category/edit/:categoryId" element={<PrivateRoute><EditCategoryPage /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
