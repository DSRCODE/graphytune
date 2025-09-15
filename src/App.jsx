import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";
import ProductList from "./pages/Product/ProductList";
import Vendors from "./pages/Users/Vendors/Vendors";
import VendorDetails from "./pages/Users/Vendors/VendorDetails";
import Customers from "./pages/Users/Customers/Customers";
import Delivery from "./pages/Users/Delivery/Delivery";
import OrderList from "./pages/Orders/OrderList";
import CreateProduct from "./pages/Product/CreateProduct";
import TicketList from "./pages/TicketList/TicketList";
import CustomerDetails from "./pages/Users/Customers/CustomerDetails";
import DeliveryDetail from "./pages/Users/Delivery/DeliveryDetail";
import CMSPrivacyEditor from "./components/Editor/Editor";
import Category from "./pages/Category";
import WelcomePage from "./pages/WelcomePage";
import Transaction from "./pages/Transaction/Transaction";

export default function App() {
  const dummyDeliveryData = {
    fullname: "Ravi Kumar",
    age: 30,
    gender: "Male",
    email: "ravi@example.com",
    phone: "9876543210",
    deliveryPhoto: "https://...jpg",
    vehicleType: "Bike",
    vehicleBrand: "Honda",
    vehicleModel: "Shine",
    vehiclePhotoFront: "https://...jpg",
    vehiclePhotoBack: "https://...jpg",
    licensePhoto: "https://...jpg",
    vehicleRCFront: "https://...jpg",
    vehicleRCBack: "https://...jpg",
    status: "active",
  };
  return (
    // <Router basename="/EcommerceAdmin/">
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<WelcomePage />} />
          <Route path="category" element={<Category />} />
          <Route path="users/vendor" element={<Vendors />} />
          <Route path="/vendors/:id" element={<VendorDetails />} />

          <Route path="users/customer" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />

          <Route path="users/delivery" element={<Delivery />} />
          <Route
            path="/delivery/:id"
            element={<DeliveryDetail data={dummyDeliveryData} />}
          />

          <Route path="products/list" element={<ProductList />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="orders/list" element={<OrderList />} />
          <Route path="transaction/list" element={<Transaction />} />
          <Route path="support/tickets" element={<TicketList />} />

          <Route
            path="/settings/privacypolicy"
            element={<CMSPrivacyEditor />}
          />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
