import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import Users from "./pages/admin/Users";
import Categories from "./pages/admin/Categories";
import Products from "./pages/admin/Products";
import Blogs from "./pages/admin/Blogs";
import CustomerProducts from "./pages/customer/Products";
import HomePage from "./pages/customer/HomePage";
import ProductDetails from "./pages/customer/ProductDetails";
import CustomerBlogs from "./pages/customer/Blogs";
import BlogDetails from "./pages/customer/BlogDetails";
import Login from "./pages/customer/Login";
import Register from "./pages/customer/Register";
import ProtectedCustomerRoute from "./components/customer/ProtectedCustomerRoute";
import Wishlist from "./pages/customer/Wishlist";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import OrderSuccess from "./pages/customer/OrderSuccess";
import Orders from "./pages/customer/Orders";
import OrderDetails from "./pages/customer/OrderDetails";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetails from "./pages/admin/OrderDetails";
import AdminPayments from "./pages/admin/Payments";
import AdminManagement from "./pages/admin/AdminManagement";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProfile from "./pages/admin/AdminProfile";

const App = () => {

  return (
    <Routes>
      {/* Root Path */}
      <Route path="/" element={<HomePage />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />
      {/* Admin */}
      <Route path="/admin" element={<ProtectedAdminRoute> <AdminLayout /> </ProtectedAdminRoute>}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/blogs" element={<Blogs />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/admins" element={<AdminManagement />} />
        <Route path="/admin/profile" element={<AdminProfile />} />  
      </Route>

      {/* Customer */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<CustomerProducts />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/blogs" element={<CustomerBlogs />} />
      <Route path="/blogs/:id" element={<BlogDetails />} />

      <Route element={<ProtectedCustomerRoute />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
      </Route>

      {/* Default Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;