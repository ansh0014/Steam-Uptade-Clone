import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  status: string;
  upiId: string | null; // Added UPI ID to transaction
}

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
};

type PaymentMethod = "card" | "netbanking" | "upi";

export default function PaymentModal({ isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [activeTab, setActiveTab] = useState<PaymentMethod>("card");
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [upiId, setUpiId] = useState(""); // Added UPI ID state
  const { getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    // For demo purposes, using localStorage to persist transactions
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  const generateTransactionId = () => {
    return 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const isValidUpiId = (upiId: string) => upiId.includes('@'); // Basic UPI ID validation

  const handlePayment = async () => {
    setPaymentInProgress(true);

    try {
      // Simulate payment processing.  Add UPI ID to transaction if applicable.
      await new Promise(resolve => setTimeout(resolve, 2000));

      const transactionId = generateTransactionId();

      const newTransaction = {
        id: transactionId,
        amount: getTotalPrice() * 83,
        date: new Date().toLocaleString(),
        status: 'Successful',
        upiId: activeTab === "upi" ? upiId : null // Include UPI ID if UPI payment
      };

      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

      toast({
        title: "Payment Successful!",
        description: `Transaction ID: ${transactionId}`,
      });

      clearCart();
      onPaymentSuccess();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setPaymentInProgress(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-steam-dark-blue rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
          disabled={paymentInProgress}
        >
          <i className="fas fa-times"></i>
        </button>

        <h2 className="text-2xl font-bold mb-6">Secure Checkout</h2>

        <div className="mb-6">
          <div className="flex border-b border-gray-700">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "card" 
                  ? "text-white border-b-2 border-steam-blue" 
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("card")}
            >
              Credit/Debit Card
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "netbanking" 
                  ? "text-white border-b-2 border-steam-blue" 
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("netbanking")}
            >
              Net Banking
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "upi" 
                  ? "text-white border-b-2 border-steam-blue" 
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("upi")}
            >
              UPI
            </button>
          </div>
        </div>

        {/* Credit Card Form */}
        <div className={`${activeTab === "card" ? "" : "hidden"}`}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full bg-steam-dark-gray border border-gray-700 rounded p-2 text-white"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full bg-steam-dark-gray border border-gray-700 rounded p-2 text-white"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full bg-steam-dark-gray border border-gray-700 rounded p-2 text-white"
                  maxLength={3}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-steam-dark-gray border border-gray-700 rounded p-2 text-white"
              />
            </div>
          </form>
        </div>

        {/* Net Banking Form */}
        <div className={`${activeTab === "netbanking" ? "" : "hidden"}`}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Bank</label>
              <select className="w-full bg-steam-dark-gray border border-gray-700 rounded p-2 text-white">
                <option value="">Select your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
            </div>
          </form>
        </div>

        {/* UPI Form */}
        <div className={`${activeTab === "upi" ? "" : "hidden"}`}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">UPI ID</label>
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  placeholder="yourname@upi"
                  className={`w-full bg-steam-dark-gray border ${
                    upiId && !isValidUpiId(upiId) 
                      ? 'border-red-500' 
                      : 'border-gray-700'
                  } rounded p-2 text-white`}
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                {upiId && !isValidUpiId(upiId) && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter a valid UPI ID (e.g., name@upi, mobile@bank)
                  </p>
                )}
                <div className="flex justify-center space-x-4">
                  <button className="bg-steam-dark-gray hover:bg-gray-700 px-6 py-3 rounded-lg flex flex-col items-center transition-colors">
                    <span className="font-medium text-white">GOOGLE PAY</span>
                    <span className="text-xs text-gray-400 mt-1">(UPI)</span>
                  </button>
                  <button className="bg-steam-dark-gray hover:bg-gray-700 px-6 py-3 rounded-lg flex flex-col items-center transition-colors">
                    <span className="font-medium text-white">PHONE PE</span>
                    <span className="text-xs text-gray-400 mt-1">(UPI)</span>
                  </button>
                  <button className="bg-steam-dark-gray hover:bg-gray-700 px-6 py-3 rounded-lg flex flex-col items-center transition-colors">
                    <span className="font-medium text-white">PAYTM</span>
                    <span className="text-xs text-gray-400 mt-1">(UPI)</span>
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Enter your UPI ID (e.g., mobile@upi, name@bank)
              </p>

              <button
                type="button"
                className="mt-4 text-steam-blue hover:underline"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Hide Transaction History' : 'Show Transaction History'}
              </button>

              {showHistory && (
                <div className="mt-4 bg-steam-dark-gray rounded p-4">
                  <h3 className="text-white font-medium mb-3">Transaction History</h3>
                  <div className="space-y-2">
                    {transactions.length === 0 ? (
                      <p className="text-gray-400">No transactions yet</p>
                    ) : (
                      transactions.map((transaction) => (
                        <div key={transaction.id} className="border-b border-gray-700 pb-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">ID: {transaction.id}</span>
                            <span className="text-green-500">₹{transaction.amount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{transaction.date}</span>
                            <span>{transaction.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-medium"
          onClick={handlePayment}
          disabled={paymentInProgress}
        >
          {paymentInProgress ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-2"></i> Processing...
            </span>
          ) : (
            `Pay ₹${(getTotalPrice() * 83).toFixed(2)}`
          )}
        </button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          This is a demo payment system. No real transactions will be processed.
        </p>
      </div>
    </div>
  );
}