import React from 'react';

interface DirectoryLayoutProps {
    title: string;
    subtitle: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
}

const DirectoryLayout: React.FC<DirectoryLayoutProps> = ({ title, subtitle, actions, children }) => (
    <>
        <div className="flex items-center justify-between mb-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
                <p className="text-slate-500">{subtitle}</p>
            </div>
            {actions && <div className="flex gap-2">{actions}</div>}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            {children}
        </div>
    </>
);

export default DirectoryLayout;
