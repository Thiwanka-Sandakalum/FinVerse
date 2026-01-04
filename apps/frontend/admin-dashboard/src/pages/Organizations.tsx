import React from 'react';
import { Outlet } from 'react-router-dom';

export const Organizations: React.FC = () => {
    return (
        <div className="space-y-8">
            <Outlet />
        </div>
    );
};
