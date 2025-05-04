import { useCart } from "@/hooks/useCart";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

type CartModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
};

export default function CartModal({ isOpen, onClose, onCheckout }: CartModalProps) {
  const { cart, removeFromCart, getTotalPrice, getSubtotal, getDiscount } = useCart();

  const handleRemoveItem = async (gameId: string) => {
    try {
      await apiRequest("DELETE", `/api/cart/${gameId}`);
      removeFromCart(gameId);
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="cart-modal"
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <div className="bg-steam-dark-blue rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          id="close-cart"
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>

        <h2 className="text-2xl font-bold mb-6">Your Shopping Cart</h2>

        {/* Cart Items */}
        {cart.length === 0 ? (
          <div className="py-8 text-center">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {cart.map((item) => (
              <div key={item.id} className="py-4 flex items-center">
                <img
                  src={item.headerImage}
                  alt={item.title}
                  className="w-20 h-12 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  {item.discount > 0 && (
                    <p className="text-steam-blue text-sm">Special Offer</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold">${item.price.toFixed(2)}</p>
                  <button
                    className="text-gray-400 hover:text-white text-sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <>
            <div className="mt-6 border-t border-gray-700 pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span className="font-bold">${getSubtotal().toFixed(2)}</span>
              </div>
              {getDiscount() > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Discount</span>
                  <span>-${getDiscount().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="mt-6">
              <button
                id="checkout-btn"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-medium"
                onClick={onCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
