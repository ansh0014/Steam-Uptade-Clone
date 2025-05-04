import { useLocation } from "wouter";
import SteamLogo from "@/components/SteamLogo";

type SidebarProps = {
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  onCartToggle: () => void;
};

export default function Sidebar({ mobileMenuOpen, onMobileMenuToggle, onCartToggle }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { icon: "fa-store", text: "Store", path: "/" },
    { icon: "fa-gamepad", text: "Library", path: "/library" },
    { icon: "fa-users", text: "Community", path: "/community" },
    { icon: "fa-user", text: "Profile", path: "/profile" },
    { icon: "fa-cog", text: "Settings", path: "/settings" },
  ];

  return (
    <div className="bg-steam-dark-blue w-full md:w-64 md:min-h-screen flex-shrink-0 md:sticky md:top-0 z-10 border-b md:border-b-0 md:border-r border-gray-700">
      <div className="flex md:flex-col p-4">
        {/* Logo */}
        <div className="flex justify-center items-center w-full">
          <a href="/" className="inline-block">
            <SteamLogo />
          </a>
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:block mt-8 w-full">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li 
                key={item.text} 
                className={`px-2 py-1 rounded hover:bg-steam-dark-gray ${
                  location === item.path ? 'font-medium text-white' : ''
                }`}
              >
                <a 
                  href={item.path} 
                  className="flex items-center"
                >
                  <i className={`fas ${item.icon} mr-3`}></i>
                  <span>{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden ml-auto items-center space-x-4">
          <button className="text-white" onClick={() => {}}>
            <i className="fas fa-search"></i>
          </button>
          <button className="text-white" onClick={onCartToggle}>
            <i className="fas fa-shopping-cart"></i>
          </button>
          <button className="text-white" onClick={onMobileMenuToggle}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu (hidden by default) */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <nav className="px-4 py-2">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li 
                key={item.text} 
                className={`px-2 py-1 rounded hover:bg-steam-dark-gray ${
                  location === item.path ? 'font-medium text-white' : ''
                }`}
              >
                <a 
                  href={item.path} 
                  className="flex items-center"
                >
                  <i className={`fas ${item.icon} mr-3`}></i>
                  <span>{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
