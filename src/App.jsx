import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { setupScrollDetection } from './utils/scrollOptimizer';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrdersProvider } from './context/OrdersContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { CouponsProvider } from './context/CouponsContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { FAQProvider } from './context/FAQContext';
import { ReferralProvider } from './context/ReferralContext';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';

// Lazy load components pesados
const Header = lazy(() => import('./components/Header'));
const Footer = lazy(() => import('./components/Footer'));
const ReferralBanner = lazy(() => import('./components/ReferralBanner'));
const BackToTop = lazy(() => import('./components/BackToTop'));
const WhatsAppButton = lazy(() => import('./components/WhatsAppButton'));

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const OrderConfirmed = lazy(() => import('./pages/OrderConfirmed'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Profile = lazy(() => import('./pages/Profile'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const Addresses = lazy(() => import('./pages/Addresses'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const MyCoupons = lazy(() => import('./pages/MyCoupons'));
const Notifications = lazy(() => import('./pages/Notifications'));
const RecentlyViewed = lazy(() => import('./pages/RecentlyViewed'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Referrals = lazy(() => import('./pages/Referrals'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ReturnsPolicy = lazy(() => import('./pages/ReturnsPolicy'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const NotFound = lazy(() => import('./pages/NotFound'));
const TestAuth = lazy(() => import('./pages/TestAuth'));
const DebugAuth = lazy(() => import('./pages/DebugAuth'));

// Admin Pages
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ContentEditor = lazy(() => import('./pages/admin/ContentEditor'));
const BannerManager = lazy(() => import('./pages/admin/BannerManager'));
const CouponManager = lazy(() => import('./pages/admin/CouponManager'));
const ProductManager = lazy(() => import('./pages/admin/ProductManager'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const OrderManager = lazy(() => import('./pages/admin/OrderManager'));
const CustomerManager = lazy(() => import('./pages/admin/CustomerManager'));
const FaqManager = lazy(() => import('./pages/admin/FaqManager'));

function App() {
  // Setup de detecção de scroll para otimizar performance
  useEffect(() => {
    const cleanup = setupScrollDetection();
    return cleanup;
  }, []);

  return (
    <AuthProvider>
      <ProductProvider>
        <FAQProvider>
          <RecentlyViewedProvider>
            <NotificationsProvider>
              <CouponsProvider>
                <ReviewsProvider>
                  <OrdersProvider>
                    <WishlistProvider>
                      <ReferralProvider>
                        <CartProvider>
                          <Router>
            <ScrollToTop />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <div className="flex flex-col min-h-screen overflow-x-hidden">
              <Suspense fallback={<div className="h-20 bg-dark-900" />}>
                <Header />
                <ReferralBanner />
              </Suspense>
              <main className="flex-grow overflow-x-hidden">
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/produtos" element={<Products />} />
                  <Route path="/produto/:id" element={<ProductDetail />} />
                  <Route path="/carrinho" element={<Cart />} />
                  <Route path="/sobre" element={<About />} />
                  <Route path="/contato" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/termos-uso" element={<TermsOfService />} />
                  <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
                  <Route path="/trocas-devolucoes" element={<ReturnsPolicy />} />
                  <Route path="/rastreio" element={<OrderTracking />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/esqueceu-senha" element={<ForgotPassword />} />
                  <Route path="/redefinir-senha/:token" element={<ResetPassword />} />
                  <Route path="/test-auth" element={<TestAuth />} />
                  <Route path="/debug-auth" element={<DebugAuth />} />
                  
                  {/* Rotas Protegidas */}
                  <Route path="/favoritos" element={
                    <PrivateRoute>
                      <Wishlist />
                    </PrivateRoute>
                  } />
                  <Route path="/checkout" element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  } />
                  <Route path="/pedido-confirmado" element={
                    <PrivateRoute>
                      <OrderConfirmed />
                    </PrivateRoute>
                  } />
                  <Route path="/perfil" element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } />
                  <Route path="/perfil/editar" element={
                    <PrivateRoute>
                      <EditProfile />
                    </PrivateRoute>
                  } />
                  <Route path="/perfil/enderecos" element={
                    <PrivateRoute>
                      <Addresses />
                    </PrivateRoute>
                  } />
                  <Route path="/perfil/senha" element={
                    <PrivateRoute>
                      <ChangePassword />
                    </PrivateRoute>
                  } />
                  <Route path="/pedidos" element={
                    <PrivateRoute>
                      <Orders />
                    </PrivateRoute>
                  } />
                  <Route path="/pedidos/:id" element={
                    <PrivateRoute>
                      <OrderDetail />
                    </PrivateRoute>
                  } />
                  <Route path="/cupons" element={
                    <PrivateRoute>
                      <MyCoupons />
                    </PrivateRoute>
                  } />
                  <Route path="/notificacoes" element={
                    <PrivateRoute>
                      <Notifications />
                    </PrivateRoute>
                  } />
                  <Route path="/perfil/vistos-recentemente" element={
                    <PrivateRoute>
                      <RecentlyViewed />
                    </PrivateRoute>
                  } />
                  <Route path="/indicar-amigos" element={
                    <PrivateRoute>
                      <Referrals />
                    </PrivateRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <PrivateRoute requiredRole="ADMIN">
                      <AdminLayout />
                    </PrivateRoute>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="produtos" element={<ProductManager />} />
                    <Route path="pedidos" element={<OrderManager />} />
                    <Route path="clientes" element={<CustomerManager />} />
                    <Route path="conteudo" element={<ContentEditor />} />
                    <Route path="banners" element={<BannerManager />} />
                    <Route path="faqs" element={<FaqManager />} />
                    <Route path="cupons" element={<CouponManager />} />
                    <Route path="configuracoes" element={<SettingsPage />} />
                  </Route>

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Suspense fallback={<div className="h-32 bg-dark-900" />}>
                <Footer />
              </Suspense>
              
              {/* Botões Flutuantes */}
              <Suspense fallback={null}>
                <BackToTop />
                <WhatsAppButton />
              </Suspense>
            </div>
          </Router>
                        </CartProvider>
                      </ReferralProvider>
                    </WishlistProvider>
                  </OrdersProvider>
                </ReviewsProvider>
              </CouponsProvider>
            </NotificationsProvider>
          </RecentlyViewedProvider>
        </FAQProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
