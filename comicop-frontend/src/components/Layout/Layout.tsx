import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
    return (

        <div className="min-h-screen flex flex-col">
            {/* Header cố định trên cùng */}
            <Header />

            {/* flex-grow: main chiếm hết phần còn lại giữa Header và Footer */}
            <main className="flex-grow">
                {/* Outlet: React Router tự render đúng trang theo URL hiện tại */}
                <Outlet />
            </main>

            {/* Footer luôn ở dưới cùng */}
            <Footer />
        </div>
    );
};

export default Layout;