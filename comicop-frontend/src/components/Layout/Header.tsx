import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Header: React.FC = () => {
    // Lấy thông tin user và hàm logout từ AuthContext
    const { user, logout } = useAuth();
    // Lấy giỏ hàng từ CartContext để hiển thị badge số lượng
    const { cart } = useCart();
    // State điều khiển mở/đóng dropdown menu user
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // State lưu từ khoá tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Xử lý tìm kiếm — chuyển sang trang /search với query
    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    // Xử lý nhấn Enter trong ô tìm kiếm
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-3">
                <div className="flex items-center justify-between">

                    {/* Bên trái: Logo + Navigation */}
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-3xl font-extrabold text-indigo-600">
                            Comicop
                        </Link>
                        <nav className="hidden md:flex space-x-6">
                            <Link
                                to="/"
                                className="text-lg text-gray-700 hover:text-indigo-600 transition-colors"
                            >
                                Trang chủ
                            </Link>
                            <Link
                                to="/manga"
                                className="text-lg text-gray-700 hover:text-indigo-600 transition-colors"
                            >
                                Danh mục
                            </Link>
                            <Link
                                to="/news"
                                className="text-lg text-gray-700 hover:text-indigo-600 transition-colors"
                            >
                                Tin tức
                            </Link>
                        </nav>
                    </div>

                    {/* Giữa: Thanh tìm kiếm */}
                    <div className="flex-1 mx-4 hidden md:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full focus:outline-none focus:border-indigo-600 transition-colors"
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute inset-y-0 right-0 flex items-center pr-4"
                            >
                                <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Bên phải: Giỏ hàng + User */}
                    <div className="flex items-center space-x-6">

                        {/* Icon giỏ hàng với badge số lượng */}
                        <Link
                            to="/cart"
                            className="relative text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            {/* Badge đỏ hiện số sản phẩm trong giỏ */}
                            {cart && cart.items && cart.items.length > 0 && (
                                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
                  {cart.items.length}
                </span>
                            )}
                        </Link>

                        {/* Nếu đã đăng nhập: hiện avatar + dropdown */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 focus:outline-none transition-colors"
                                >
                                    <img
                                        src={user.avatar || '/default-avatar.png'}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span className="hidden lg:block font-medium">{user.username}</span>
                                </button>
                                {/* Dropdown menu */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Hồ sơ
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Đơn hàng
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Nếu chưa đăng nhập: hiện nút Đăng nhập + Đăng ký */
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-lg text-gray-700 hover:text-indigo-600 transition-colors"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white text-lg px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;