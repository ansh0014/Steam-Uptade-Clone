
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  status: string;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Get transactions from localStorage
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
      <div className="grid gap-4">
        {transactions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-400">No transactions yet</p>
            </CardContent>
          </Card>
        ) : (
          transactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Transaction ID: {transaction.id}</span>
                  <span className="text-green-500">₹{transaction.amount.toFixed(2)}</span>
                </CardTitle>
                <CardDescription>
                  <div className="flex justify-between">
                    <span>{transaction.date}</span>
                    <span className="text-green-500">{transaction.status}</span>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
