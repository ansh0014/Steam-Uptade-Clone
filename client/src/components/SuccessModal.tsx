type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="payment-success-modal"
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <div className="bg-steam-dark-blue rounded-lg p-6 max-w-md w-full text-center">
        <div className="text-green-500 mb-4">
          <i className="fas fa-check-circle text-6xl"></i>
        </div>

        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="mb-6">Your games have been added to your library.</p>

        <button
          id="close-success"
          className="bg-steam-blue hover:bg-opacity-80 text-white py-2 px-6 rounded font-medium"
          onClick={onClose}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
