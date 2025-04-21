import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Layout from './pages/Home/Layout'
import Home from './pages/Home/Home'
import { AuthProvider } from './store/auth.jsx';
import Error from './components/Home/Error.jsx';
import { AdminAnalysis, AdminChangePassword, AdminDashboard, AdminLayout, AdminLogin, AdminPayments, AdminRegister, AdminSettings, AllCompanies, AllDeliveryPartners, AllOrders, CompanyDetails, PartnerDetails, PartnerPaymentDetails, SaveDeliveryCities, SetDeliveryRate, SetDeliveryZones } from './pages/Admin/index.js'
import { AcceptOrder, DeliveryPartnerForm, NavigateLocation, PartnerApplication, PartnerDashboard, PartnerEarning, PartnerLayout, PartnerLogin, PartnerOrderPage, PartnerOrders, PartnerPayments, PartnerProfile, PartnerRegister, PartnerUpdatePassword, PartnerUpdateProfile, SetPaymentMethod } from './pages/Delivery-Partner/index.js';
import { AddFundPage, BusinessForm, CompanyApplication, CompanyDashboard, CompanyFinances, CompanyForm, CompanyLayout, CompanyLogin, CompanyOrderPage, CompanyOrders, CompanyRegister, CompanyReport, CompanySettings, CompanyUpdatePassword, CreateOrder, SavedAddressesScreen } from './pages/Company/index.js'
import Logout from './pages/Home/Logout.jsx';
import PartnerRouteWrapper from './pages/PrivateRoutes/PartnerRouteWrapper.jsx';
import CompanyRouteWrapper from './pages/PrivateRoutes/CompanyRouteWrapper.jsx';
import AdminRouteWrapper from './pages/PrivateRoutes/AdminRouteWrapper.jsx';
import AdminOrderPage from './pages/Admin/AdminOrderPage.jsx';
import Track from './pages/Home/Track.jsx';
import ContactForm from './pages/Home/ContactForm.jsx';
import TrackingDetails from './pages/Home/TrackingDetails.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Layout />} >
        <Route path='' element={<Home />} />
        <Route path='track' element={<Track />} />
        <Route path='track/:id' element={<TrackingDetails />} />
        <Route path='contact' element={<ContactForm />} />
        <Route path='admin-login' element={<AdminLogin />} />
        <Route path='admin-register' element={<AdminRegister />} />
        <Route path='partner-register' element={<PartnerRegister />} />
        <Route path='partner-login' element={<PartnerLogin />} />
        <Route path='partner-details' element={<DeliveryPartnerForm />} />
        <Route path='company-details' element={<CompanyForm />} />
        <Route path='company-register' element={<CompanyRegister />} />
        <Route path='company-login' element={<CompanyLogin />} />
        <Route path='logout' element={<Logout />} />
      </Route>
      <Route path='/admin' element={<AdminRouteWrapper><AdminLayout /></AdminRouteWrapper>} >
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='partners' element={<AllDeliveryPartners />} />
        <Route path='partners/:id' element={<PartnerDetails />} />
        <Route path='companies' element={<AllCompanies />} />
        <Route path='companies/:id' element={<CompanyDetails />} />
        <Route path='orders' element={<AllOrders />} />
        <Route path='orders/:id' element={<AdminOrderPage />} />
        <Route path='analysis' element={<AdminAnalysis />} />
        <Route path='payments' element={<AdminPayments />} />
        <Route path='partner-payment/:id' element={<PartnerPaymentDetails />} />
        <Route path='settings' element={<AdminSettings />} />
        <Route path='change-password' element={<AdminChangePassword />} />
        <Route path='delivery-zone' element={<SetDeliveryZones />} />
        <Route path='delivery-cities' element={<SaveDeliveryCities />} />
        <Route path='delivery-rate' element={<SetDeliveryRate />} />
      </Route>
      <Route path='/partner' element={<PartnerRouteWrapper>
        <PartnerLayout />
      </PartnerRouteWrapper>}
      >
        <Route path='dashboard' element={<PartnerDashboard />} />
        <Route path='orders' element={<PartnerOrders />} />
        <Route path='orders/:id' element={<PartnerOrderPage />} />
        <Route path='order/accept/:id' element={<AcceptOrder />} />
        <Route path="earnings" element={<PartnerEarning />} />
        <Route path="payments" element={<PartnerPayments />} />
        <Route path="profile" element={<PartnerProfile />} />
        <Route path="application" element={<PartnerApplication />} />
        <Route path="navigate/:partnerId/:orderId" element={<NavigateLocation />} />
        <Route path='change-password' element={<PartnerUpdatePassword />} />
        <Route path='update-profile' element={<PartnerUpdateProfile />} />
        <Route path='set-payment' element={<SetPaymentMethod />} />
      </Route>
      <Route path='/company' element={<CompanyRouteWrapper><CompanyLayout /></CompanyRouteWrapper>} >
        <Route path='dashboard' element={<CompanyDashboard />} />
        <Route path='orders' element={<CompanyOrders />} />
        <Route path='orders/:id' element={<CompanyOrderPage />} />
        <Route path='create-order' element={<CreateOrder />} />
        <Route path='finances' element={<CompanyFinances />} />
        <Route path='add-fund' element={<AddFundPage />} />
        <Route path='reports' element={<CompanyReport />} />
        <Route path='settings' element={<CompanySettings />} />
        <Route path='profile' element={<BusinessForm />} />
        <Route path="application" element={<CompanyApplication />} />
        <Route path='addresses' element={<SavedAddressesScreen />} />
        <Route path='change-password' element={<CompanyUpdatePassword />} />
      </Route>
      <Route path='*' element={<Error />} />
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </StrictMode>
  </AuthProvider>,
)
