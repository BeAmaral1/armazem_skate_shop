import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
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
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/esqueceu-senha" element={<ForgotPassword />} />
                  <Route path="/redefinir-senha/:token" element={<ResetPassword />} />
                  
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
