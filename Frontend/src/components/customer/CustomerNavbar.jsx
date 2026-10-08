import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart, FaStar, FaBars, FaSignOutAlt, FaSignInAlt, FaBoxOpen } from 'react-icons/fa';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const customerToken = localStorage.getItem("customerToken") || localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("customerToken");
        localStorage.removeItem("customerUser");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className='w-full h-17 bg-black sticky top-0 z-50'>
            <div className='flex justify-between p-5 pl-25 pr-25 max-[1024px]:pl-3 max-[1024px]:pr-3 items-center h-full'>
                <button onClick={() => setMenuOpen(!menuOpen)} className='text-white max-[1024px]:flex hidden'><FaBars /></button>
                {menuOpen && (
                    <div className="absolute top-17 left-0 w-full bg-[#29282e] p-4">
                        <ul className='flex flex-col text-white gap-7 text-lg'>
                            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                            <li><Link to="/" onClick={() => setMenuOpen(false)}>Collection</Link></li>
                            <li><Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link></li>
                            <li><Link to="/blogs" onClick={() => setMenuOpen(false)}>Blogs</Link></li>
                            {customerToken && <li><Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link></li>}
                            {customerToken ? (
                                <li>
                                    <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="text-red-400 hover:text-red-300">
                                        Logout
                                    </button>
                                </li>
                            ) : (
                                <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
                            )}
                        </ul>
                    </div>
                )}
                <Link to="/"><img className='w-40 h-6 [1024px]:-translate-x-45' src="https://nov-gearnix.myshopify.com/cdn/shop/files/Logo_white.png?v=1722670258&width=300" alt="Gearnix Logo" /></Link>
                <div className='max-[1024px]:hidden flex'>
                    <ul className='flex text-white gap-7 text-lg'>
                        <li><Link className='hover:text-pink-500 duration-400' to="/">Home</Link></li>
                        <li><Link className='hover:text-pink-500 duration-400' to="/">Collection</Link></li>
                        <li><Link className='hover:text-pink-500 duration-400' to="/products">Products</Link></li>
                        <li><Link className='hover:text-pink-500 duration-400' to="/blogs">Blogs</Link></li>
                        {customerToken && <li><Link className='hover:text-pink-500 duration-400' to="/orders">My Orders</Link></li>}
                    </ul>
                </div>
                <div>
                    <ul className='flex text-white gap-5 max-[768px]:gap-2 text-lg items-center'>
                        <li><Link to="/products" title="Search"><FaSearch className='hover:text-pink-500 duration-400' /></Link></li>
                        {customerToken && (
                            <li><Link to="/orders" title="My Orders"><FaBoxOpen className='hover:text-pink-500 duration-400' /></Link></li>
                        )}
                        <li><Link to="/wishlist" title="Wishlist"><FaStar className='hover:text-pink-500 duration-400' /></Link></li>
                        <li><Link to="/cart" title="Shopping Cart"><FaShoppingCart className='hover:text-pink-500 duration-400' /></Link></li>
                        
                        {customerToken ? (
                            <li>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    title="Logout"
                                    className="flex items-center gap-1 bg-red-600/80 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition duration-200"
                                >
                                    <FaSignOutAlt className="text-xs" />
                                    <span>Logout</span>
                                </button>
                            </li>
                        ) : (
                            <li>
                                <Link
                                    to="/login"
                                    title="Customer Login"
                                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition duration-200"
                                >
                                    <FaSignInAlt className="text-xs" />
                                    <span>Login</span>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;