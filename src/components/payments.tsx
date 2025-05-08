
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCcVisa, FaCcPaypal, FaApple } from "react-icons/fa";


export default function PaymentPage({ className, searchParams, ...props }: React.ComponentProps<"div"> & { searchParams?: any }) {
    return (
        <div className={cn("flex flex-col gap-6 items-center justify-center p-6", className)} {...props}>
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Payment Method</CardTitle>
                    <CardDescription>Add a new payment method to your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid gap-6">
                            <div className="flex justify-center gap-4">
                                <Button variant="outline" className="w-20 h-20 flex flex-col items-center justify-center">
                                    <FaCcVisa className="w-6 h-6" />
                                    Card
                                </Button>
                                <Button variant="outline" className="w-20 h-20 flex flex-col items-center justify-center">
                                    <FaCcPaypal className="w-6 h-6" />
                                    Paypal
                                </Button>
                                <Button variant="outline" className="w-20 h-20 flex flex-col items-center justify-center">
                                    <FaApple className="w-6 h-6" />
                                    Apple
                                </Button>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" type="text" placeholder="First Last" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="card-number">Card Number</Label>
                                <Input id="card-number" type="text" placeholder="1234 5678 9101 1121" required />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="month">Expires</Label>
                                    <Input id="month" type="text" placeholder="Month" required />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="year">Year</Label>
                                    <Input id="year" type="text" placeholder="Year" required />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="cvc">CVC</Label>
                                    <Input id="cvc" type="text" placeholder="CVC" required />
                                </div>
                            </div>
                            <Button type="submit" className="w-full">Continue</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
