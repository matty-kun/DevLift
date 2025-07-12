import React from 'react';

// import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Removed all auth-related logic
    return <>{children}</>;
};

export default PrivateRoute;