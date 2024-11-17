import React from 'react';
import {Outlet} from 'react-router-dom';

const AuthLayout: React.FC = () => {
    return (
        <div style={{ height: '100%', alignContent: 'center' }}>
            <Outlet/>
        </div>
    );
};

export default AuthLayout;
