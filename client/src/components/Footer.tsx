export default function Footer() {
  return (
    <footer className="bg-steam-dark-blue text-sm p-6 mt-8">
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div className="mb-6 md:mb-0">
          <h3 className="font-semibold mb-2">ABOUT STEAM</h3>
          <ul className="space-y-1 text-gray-400">
            <li><a href="#" className="hover:text-white">What is Steam?</a></li>
            <li><a href="#" className="hover:text-white">Releases</a></li>
            <li><a href="#" className="hover:text-white">Steam Deck</a></li>
            <li><a href="#" className="hover:text-white">Steam Reviews</a></li>
          </ul>
        </div>
        
        <div className="mb-6 md:mb-0">
          <h3 className="font-semibold mb-2">STORE</h3>
          <ul className="space-y-1 text-gray-400">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Discovery Queue</a></li>
            <li><a href="#" className="hover:text-white">Wishlist</a></li>
            <li><a href="#" className="hover:text-white">News</a></li>
          </ul>
        </div>
        
        <div className="mb-6 md:mb-0">
          <h3 className="font-semibold mb-2">COMMUNITY</h3>
          <ul className="space-y-1 text-gray-400">
            <li><a href="#" className="hover:text-white">Discussions</a></li>
            <li><a href="#" className="hover:text-white">Workshop</a></li>
            <li><a href="#" className="hover:text-white">Market</a></li>
            <li><a href="#" className="hover:text-white">Broadcasts</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">SUPPORT</h3>
          <ul className="space-y-1 text-gray-400">
            <li><a href="#" className="hover:text-white">Help</a></li>
            <li><a href="#" className="hover:text-white">Steam Support</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-700 pt-4 text-gray-400 text-xs">
        <p>© {new Date().getFullYear()} Valve Corporation. All rights reserved. All trademarks are property of their respective owners in the US and other countries.</p>
        <p className="mt-2">VAT included in all prices where applicable.</p>
      </div>
    </footer>
  );
}
