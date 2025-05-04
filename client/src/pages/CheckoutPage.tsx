import { useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Payment form schema
const paymentFormSchema = z.object({
  paymentMethod: z.enum(["credit_card", "paypal", "steam_wallet"]),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  expiry: z.string().optional(),
  cvv: z.string().optional(),
}).refine((data) => {
  // Only validate card details if credit_card is selected
  if (data.paymentMethod === "credit_card") {
    return !!data.cardNumber && !!data.cardName && !!data.expiry && !!data.cvv;
  }
  return true;
}, {
  message: "All card details are required for credit card payment",
  path: ["cardNumber"],
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if user is logged in and cart is not empty
  if (!user) {
    toast({
      title: "Login Required",
      description: "Please log in to checkout",
      variant: "destructive",
    });
    navigate("/auth");
    return null;
  }

  if (cart.length === 0) {
    toast({
      title: "Empty Cart",
      description: "Your cart is empty",
      variant: "destructive",
    });
    navigate("/");
    return null;
  }

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "credit_card",
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvv: "",
    },
  });
  
  const paymentMethod = form.watch("paymentMethod");
  
  const onSubmit = async (values: PaymentFormValues) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Process the payment using our API
      await apiRequest("POST", "/api/payment/process", {
        amount: getTotalPrice(),
        method: values.paymentMethod
      });
      
      // Show success notification
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase!",
      });
      
      // Clear the cart and navigate to success page
      clearCart();
      navigate("/payment-success");
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Choose your preferred payment method</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="credit_card" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Credit Card
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="paypal" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                PayPal
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="steam_wallet" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Steam Wallet
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {paymentMethod === "credit_card" && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="cardName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name on Card</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="4242 4242 4242 4242" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="expiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === "paypal" && (
                    <div className="rounded-md border border-gray-700 p-4 text-center space-y-3">
                      <p>You will be redirected to PayPal to complete your purchase.</p>
                      <div className="bg-[#0070ba] text-white font-bold inline-block py-2 px-4 rounded">
                        PayPal
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === "steam_wallet" && (
                    <div className="rounded-md border border-gray-700 p-4 text-center">
                      <p>Your Steam Wallet Balance: <span className="font-bold text-green-500">$100.00</span></p>
                      <p className="text-sm text-gray-400 mt-1">
                        (This is a demo wallet balance)
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-steam-blue hover:bg-opacity-80"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Pay $${getTotalPrice().toFixed(2)}`}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {cart.map((game) => (
                  <div key={game.id} className="flex items-center space-x-3">
                    <img src={game.headerImage} alt={game.title} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <p className="font-medium">{game.title}</p>
                      <p className="text-gray-400">${game.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-700 pt-4 flex flex-col">
              <div className="flex justify-between w-full py-2">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full py-2">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between w-full py-2 font-bold">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}