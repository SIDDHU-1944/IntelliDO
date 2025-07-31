import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // adjust path as needed

const ProtectedRoute = ({ children }) => {
  const { userData, loading } = useContext(AuthContext);
  // console.log(userData);

  if(loading){ 
    return <div>Loading....</div>
  }

  if (!userData?.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;