import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/hooks/useCart";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import GameDetail from "@/pages/GameDetail";
import AuthPage from "@/pages/AuthPage";
import CheckoutPage from "@/pages/CheckoutPage";
import Layout from "@/components/Layout";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/game/:id" component={GameDetail} />
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/checkout" component={CheckoutPage} />
        <ProtectedRoute path="/library" component={() => <div>Your Library</div>} />
        <ProtectedRoute path="/profile" component={() => <div>Your Profile</div>} />
        <ProtectedRoute path="/payment-success" component={() => (
          <div className="py-20 text-center">
            <h1 className="text-3xl font-bold mb-4">Purchase Complete!</h1>
            <p className="mb-6">Thank you for your purchase. Your games have been added to your library.</p>
            <a href="/library" className="bg-steam-blue hover:bg-opacity-80 text-white py-2 px-6 rounded font-medium">
              Go to Library
            </a>
          </div>
        )} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
