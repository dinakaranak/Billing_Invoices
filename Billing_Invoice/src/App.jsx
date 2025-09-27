import { Routes, Route, HashRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Admin Components
import SignupPage from './Component/Admin/Pages/SignupPage';
import SideNavbar from './Component/Admin/SideNavbar';
import Dashboard from './Component/Admin/Pages/Dashboard';
import Products from './Component/Admin/Pages/Products';
import Customers from './Component/Admin/pages/Customers';

import ProductStockList from './Component/Admin/pages/ProductStockList';
import StockDashboard from './Component/Admin/pages/StockDashboard';
import AdminProfile from './Component/Admin/AdminProfile';
import UserManagement from './Component/Admin/pages/UserManagement';
import TopNavbar from './Component/Admin/TopNavbar';
import BillingInvoices from './Component/Admin/pages/BillingInvoices';
import ProfitReport from './Component/Admin/pages/ProfitReport';
import SellerExpenseList from './Component/Admin/pages/SellerExpenseList';
import CreditDue from './Component/Admin/pages/CreditDue';
import BillingReports from './Component/Admin/pages/BillingReports';
import SellerBills from './Component/Admin/pages/SellerBills';
import Expenditure from './Component/Admin/Pages/Expenditure';

// Cashier Components
import AuthWrapper from './Component/Invoice/AuthWrapper';
import Header from './Component/Invoice/Header';
import BillingSystem from './Component/Invoice/BillingSystem';
import Sales from './Component/Invoice/Sales';
import Transaction from './Component/Invoice/Transaction';
import PrintableBill from './Component/Invoice/PrintableBill';
import Reports from './Component/Invoice/Reports';

// Unified Login Component
import UnifiedLogin from './Component/Admin/UnifiedLogin';
import Marketing from './Component/Admin/Pages/Marketing';

const MainLayout = ({ activePage, setActivePage }) => (
  <div className="flex flex-col h-screen overflow-hidden">
    <TopNavbar setActivePage={setActivePage} />
    <div className="flex flex-1 overflow-hidden">
      <SideNavbar activeItem={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-y-auto ">
        {activePage === 'Dashboard' && (
          <Dashboard setActivePage={setActivePage} />
        )}
        {activePage === 'Products' && <Products setActivePage={setActivePage} />}
        {activePage === 'Billing / Invoices' && <BillingInvoices />}
        {activePage === 'Customers' && <Customers />}
        {activePage === 'Credit Dues' && <CreditDue />}
        {activePage === 'Product Stock List' && <ProductStockList setActivePage={setActivePage} />}
        {activePage === 'Stock Summary' && <StockDashboard setActivePage={setActivePage} />}
        {activePage === 'ProfitReport' && <ProfitReport />}
        {activePage === 'Expense Menu' && <SellerExpenseList />}
        {activePage === 'Billing Reports' && <BillingReports />}
        {activePage === 'Admin Management' && <AdminProfile />}
        {activePage === 'Seller Bills uploaded' && <SellerBills />}
        {activePage === 'User Management' && <UserManagement setActivePage={setActivePage} />}
        {activePage === 'Expenditure' && <Expenditure />}
        {activePage === 'Marketing' && <Marketing />}
      </main>
    </div>
  </div>
);

function App() {
  // Initialize state with value from localStorage or default to 'Dashboard'
  const [activePage, setActivePage] = useState(() => {
    const savedPage = localStorage.getItem('activePage');
    return savedPage || 'Dashboard';
  });

  // Update localStorage whenever activePage changes
  useEffect(() => {
    localStorage.setItem('activePage', activePage);
  }, [activePage]);

  return (
    <HashRouter>
      <Routes>
        {/* Landing page with login options */}
        <Route path="/" element={<UnifiedLogin />} />

        {/* Admin Routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/admin"
          element={
            <MainLayout activePage={activePage} setActivePage={setActivePage} />
          }
        />

        {/* Cashier Routes */}
        <Route path='/login' element={<UnifiedLogin initialMode="user" />} />
        <Route path="/admin-login" element={<UnifiedLogin initialMode="admin" />} />
        <Route path="/billing" element={
          <AuthWrapper>
            <div className="flex flex-col h-screen">
              <Header />
              <div className="flex-1 overflow-hidden">
                <BillingSystem
                  onFocusProductSearch={() => { }}
                  onFocusProductCode={() => { }}
                  onFocusQuantity={() => { }}
                  onTriggerAddProduct={() => { }}
                  onFocusCustomerName={() => { }}
                  onFocusPhoneNumber={() => { }}
                  onTriggerHold={() => { }}
                  onTriggerPrint={() => { }}
                  onTriggerPayment={() => { }}
                />
              </div>
            </div>
          </AuthWrapper>
        } />
        <Route path='/sales' element={
          <AuthWrapper>
            <>
              <Header />
              <Sales />
            </>
          </AuthWrapper>
        } />
        <Route path='/transactions' element={
          <AuthWrapper>
            <>
              <Header />
              <Transaction />
            </>
          </AuthWrapper>
        } />
        <Route path='/bill' element={<PrintableBill />} />
        <Route path='/Reports' element={
          <AuthWrapper>
            <>
              <Header />
              <Reports />
            </>
          </AuthWrapper>
        } />
      </Routes>
    </HashRouter>

  );
}

export default App;