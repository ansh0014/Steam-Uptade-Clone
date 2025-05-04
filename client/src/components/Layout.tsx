import { useEffect, useState } from "react";
import { Link } from "wouter";
import Sidebar from "@/components/Sidebar";
import CartModal from "@/components/CartModal";
import PaymentModal from "@/components/PaymentModal";
import SuccessModal from "@/components/SuccessModal";
import Footer from "@/components/Footer";
import SteamLogo from "@/components/SteamLogo";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/use-auth";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  
  const { cart } = useCart();
  const { user, logoutMutation } = useAuth();

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCartToggle = () => {
    setCartModalOpen(!cartModalOpen);
  };

  const handleCheckout = () => {
    setCartModalOpen(false);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setPaymentModalOpen(false);
    setSuccessModalOpen(true);
  };

  const handleSuccessClose = () => {
    setSuccessModalOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.id === 'cart-modal' || target.id === 'payment-modal' || target.id === 'payment-success-modal') {
        if (target.id === 'cart-modal') setCartModalOpen(false);
        if (target.id === 'payment-modal') setPaymentModalOpen(false);
        if (target.id === 'payment-success-modal') setSuccessModalOpen(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-steam-black">
      {/* Top navigation bar */}
      <header className="bg-steam-dark-blue py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="mr-8">
              <SteamLogo />
            </a>
            <nav className="hidden md:block">
              <ul className="flex space-x-6 text-sm font-medium">
                <li className="text-steam-blue hover:brightness-125"><a href="#">STORE</a></li>
                <li className="hover:text-steam-blue"><a href="#">COMMUNITY</a></li>
                <li className="hover:text-steam-blue"><a href="#">ABOUT</a></li>
                <li className="hover:text-steam-blue"><a href="#">SUPPORT</a></li>
              </ul>
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white text-sm">
              Install Steam
            </button>
            
            {user ? (
              <>
                <div className="text-steam-blue hover:brightness-125 text-sm">
                  Welcome, {user.username}
                </div>
                <button 
                  onClick={() => logoutMutation.mutate()} 
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <a href="/auth" className="text-gray-300 hover:text-white text-sm">
                Login
              </a>
            )}
            
            <span className="text-gray-500">|</span>
            <button className="text-gray-300 hover:text-white text-sm">
              Language ▼
            </button>
          </div>
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white" 
            onClick={handleMobileMenuToggle}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      {/* Secondary navigation */}
      <div className="bg-gradient-to-b from-steam-dark-blue to-steam-black border-b border-gray-700">
        <div className="container mx-auto">
          <div className="hidden md:flex text-sm">
            <a href="#" className="py-2 px-4 hover:text-steam-blue">Your Store</a>
            <a href="#" className="py-2 px-4 hover:text-steam-blue">New & Noteworthy</a>
            <a href="#" className="py-2 px-4 hover:text-steam-blue">Categories</a>
            <a href="#" className="py-2 px-4 hover:text-steam-blue">Points Shop</a>
            <a href="#" className="py-2 px-4 hover:text-steam-blue">News</a>
            <a href="#" className="py-2 px-4 hover:text-steam-blue">Labs</a>
            
            <div className="ml-auto flex items-center px-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-[#316282] rounded px-3 py-1 text-sm w-48 text-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-steam-blue"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300">
                  <i className="fas fa-search"></i>
                </button>
              </div>
              <button
                className="ml-4 bg-steam-blue hover:bg-opacity-80 text-white rounded px-3 py-1 text-sm"
                onClick={handleCartToggle}
              >
                <i className="fas fa-shopping-cart mr-1"></i> Cart ({cart.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-steam-dark-blue border-b border-gray-700`}>
        <nav className="container mx-auto px-4 py-2">
          <ul className="space-y-2">
            <li><a href="#" className="block py-2 hover:text-steam-blue">STORE</a></li>
            <li><a href="#" className="block py-2 hover:text-steam-blue">COMMUNITY</a></li>
            <li><a href="#" className="block py-2 hover:text-steam-blue">ABOUT</a></li>
            <li><a href="#" className="block py-2 hover:text-steam-blue">SUPPORT</a></li>
          </ul>
          <div className="mt-4 flex">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-[#316282] rounded px-3 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-steam-blue"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300">
                <i className="fas fa-search"></i>
              </button>
            </div>
            <button
              className="ml-2 bg-steam-blue hover:bg-opacity-80 text-white rounded px-3 py-2"
              onClick={handleCartToggle}
            >
              <i className="fas fa-shopping-cart"></i>
            </button>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto p-4">
          {children}
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <CartModal 
        isOpen={cartModalOpen} 
        onClose={() => setCartModalOpen(false)} 
        onCheckout={handleCheckout}
      />
      
      <PaymentModal 
        isOpen={paymentModalOpen} 
        onClose={() => setPaymentModalOpen(false)} 
        onPaymentSuccess={handlePaymentSuccess}
      />
      
      <SuccessModal 
        isOpen={successModalOpen} 
        onClose={handleSuccessClose}
      />
    </div>
  );
}
