import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, Camera, RefreshCw } from "lucide-react";
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { Badge } from "@/components/ui/badge";

// Types for redemption responses
interface RedemptionSuccess {
  type: 'success';
  message: string;
  dealDetails: {
    id: string;
    title: string;
    discount_value: string;
    coupon_code: string;
    customer_name?: string;
    redemption_date: string;
  };
}

interface RedemptionError {
  type: 'error';
  error_code: 'already-redeemed' | 'expired' | 'invalid' | 'not-found';
  message: string;
  dealDetails?: {
    title?: string;
    discount_value?: string;
    coupon_code?: string;
    expiry_date?: string;
    redemption_date?: string;
  };
}

type RedemptionResponse = RedemptionSuccess | RedemptionError;

// Add transaction history type
interface RedemptionTransaction {
  id: string;
  code: string;
  title: string;
  discount: string;
  customerName?: string;
  timestamp: string;
  status: 'success' | 'already-redeemed' | 'expired' | 'invalid';
}

export function QrCodeScanner() {
  const [scanning, setScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [lastResult, setLastResult] = useState<RedemptionResponse | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<RedemptionTransaction[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scannerIntervalRef = useRef<number | null>(null);

  // Get mock data flag
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

  // Load transaction history on component mount
  useEffect(() => {
    // Load previous transactions from localStorage in mock mode
    if (useMockData) {
      const storedTransactions = localStorage.getItem('scannerTransactions');
      if (storedTransactions) {
        try {
          setTransactions(JSON.parse(storedTransactions));
        } catch (error) {
          console.error('Error parsing stored transactions:', error);
        }
      }
    } else {
      // In real mode, would fetch from Supabase or API
      // This would be implemented based on your backend structure
    }
  }, [useMockData]);

  // Start camera and QR code scanning
  const startScanning = async () => {
    try {
      setScanning(true);
      setCameraError(null);
      setLastResult(null);
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraPermission(true);
      
      // Set up QR code scanning using jsQR
      // We're using dynamic import
      try {
        const jsQRModule = await import('jsqr');
        const jsQR = jsQRModule.default;
        
        // Start scanning loop
        scannerIntervalRef.current = window.setInterval(() => {
          if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
              // Draw video frame to canvas for processing
              const ctx = canvas.getContext('2d');
              if (!ctx) return;
              
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              
              // Get image data for QR code detection
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              
              // Try to detect QR code
              const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
              });
              
              // If QR code found, process it
              if (code) {
                handleQrCode(code.data);
              }
            }
          }
        }, 500); // Scan every 500ms
      } catch (error) {
        console.error('Error loading jsQR:', error);
        setCameraError('Failed to load QR scanner library. Please refresh the page.');
        setScanning(false);
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      setCameraPermission(false);
      setCameraError(error instanceof Error ? error.message : 'Failed to access camera');
      setScanning(false);
    }
  };

  // Stop scanning and release camera
  const stopScanning = () => {
    setScanning(false);
    
    // Clear scanning interval
    if (scannerIntervalRef.current) {
      clearInterval(scannerIntervalRef.current);
      scannerIntervalRef.current = null;
    }
    
    // Release camera
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  // Handle QR code data
  const handleQrCode = async (data: string) => {
    // Stop scanning once we have a result
    stopScanning();
    
    try {
      // Try to parse the QR code data
      // The QR should contain the coupon code
      const couponCode = data.trim();
      
      if (useMockData) {
        // In mock mode, simulate verifying the QR code
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get stored purchased deals
        const storedPurchases = localStorage.getItem('purchasedDeals');
        if (!storedPurchases) {
          setLastResult({
            type: 'error',
            error_code: 'not-found',
            message: 'No purchase records found with this code.'
          });
          return;
        }
        
        const purchases = JSON.parse(storedPurchases);
        const matchingDeal = purchases.find((deal: any) => deal.coupon_code === couponCode);
        
        if (!matchingDeal) {
          setLastResult({
            type: 'error',
            error_code: 'invalid',
            message: 'Invalid discount code. This code does not exist in our system.'
          });
          return;
        }
        
        const now = new Date();
        const expiryDate = new Date(matchingDeal.expiry_date);
        
        // Check if already redeemed
        if (matchingDeal.status === 'redeemed') {
          setLastResult({
            type: 'error',
            error_code: 'already-redeemed',
            message: 'This discount code has already been redeemed.',
            dealDetails: {
              title: matchingDeal.title,
              discount_value: matchingDeal.discount_value,
              coupon_code: matchingDeal.coupon_code,
              redemption_date: matchingDeal.redemption_date
            }
          });
          return;
        }
        
        // Check if expired
        if (expiryDate < now) {
          setLastResult({
            type: 'error',
            error_code: 'expired',
            message: 'This discount code has expired.',
            dealDetails: {
              title: matchingDeal.title,
              discount_value: matchingDeal.discount_value,
              coupon_code: matchingDeal.coupon_code,
              expiry_date: matchingDeal.expiry_date
            }
          });
          return;
        }
        
        // Valid redemption!
        const redemptionDate = new Date().toISOString();
        
        // Update the deal in localStorage
        matchingDeal.status = 'redeemed';
        matchingDeal.redemption_date = redemptionDate;
        localStorage.setItem('purchasedDeals', JSON.stringify(purchases));
        
        // Create success result
        const successResult: RedemptionSuccess = {
          type: 'success',
          message: 'Discount code successfully redeemed!',
          dealDetails: {
            id: matchingDeal.id,
            title: matchingDeal.title,
            discount_value: matchingDeal.discount_value,
            coupon_code: matchingDeal.coupon_code,
            customer_name: 'John Doe', // Mock customer name
            redemption_date: redemptionDate
          }
        };
        
        setLastResult(successResult);
        
        // Add to transaction history
        const newTransaction: RedemptionTransaction = {
          id: Math.random().toString(36).substring(2, 9),
          code: matchingDeal.coupon_code,
          title: matchingDeal.title,
          discount: matchingDeal.discount_value,
          customerName: 'John Doe',
          timestamp: redemptionDate,
          status: 'success'
        };
        
        const updatedTransactions = [newTransaction, ...transactions];
        setTransactions(updatedTransactions);
        
        // Store transactions in localStorage
        localStorage.setItem('scannerTransactions', JSON.stringify(updatedTransactions));
        
        toast.success('Discount code successfully redeemed!');
      } else {
        // For real implementation with Supabase
        const { data: purchaseData, error: purchaseError } = await supabase
          .from('purchased_deals')
          .select(`
            *,
            discount_deals:discount_deal_id (
              title,
              discount_value,
              coupon_code
            ),
            users:user_id (
              name,
              email
            )
          `)
          .eq('coupon_code', couponCode)
          .single();
        
        if (purchaseError || !purchaseData) {
          setLastResult({
            type: 'error',
            error_code: 'not-found',
            message: 'No purchase records found with this code.'
          });
          return;
        }
        
        // Check if already redeemed
        if (purchaseData.status === 'redeemed') {
          setLastResult({
            type: 'error',
            error_code: 'already-redeemed',
            message: 'This discount code has already been redeemed.',
            dealDetails: {
              title: purchaseData.discount_deals.title,
              discount_value: purchaseData.discount_deals.discount_value,
              coupon_code: purchaseData.discount_deals.coupon_code,
              redemption_date: purchaseData.redemption_date
            }
          });
          return;
        }
        
        // Check if expired
        const now = new Date();
        const expiryDate = new Date(purchaseData.expiry_date);
        
        if (expiryDate < now) {
          setLastResult({
            type: 'error',
            error_code: 'expired',
            message: 'This discount code has expired.',
            dealDetails: {
              title: purchaseData.discount_deals.title,
              discount_value: purchaseData.discount_deals.discount_value,
              coupon_code: purchaseData.discount_deals.coupon_code,
              expiry_date: purchaseData.expiry_date
            }
          });
          return;
        }
        
        // Valid redemption! Mark as redeemed in the database
        const redemptionDate = new Date().toISOString();
        
        const { error: updateError } = await supabase
          .from('purchased_deals')
          .update({
            status: 'redeemed',
            redemption_date: redemptionDate
          })
          .eq('id', purchaseData.id);
        
        if (updateError) {
          setLastResult({
            type: 'error',
            error_code: 'invalid',
            message: 'Failed to redeem discount code. Please try again.'
          });
          return;
        }
        
        // Create success result
        const successResult: RedemptionSuccess = {
          type: 'success',
          message: 'Discount code successfully redeemed!',
          dealDetails: {
            id: purchaseData.id,
            title: purchaseData.discount_deals.title,
            discount_value: purchaseData.discount_deals.discount_value,
            coupon_code: purchaseData.discount_deals.coupon_code,
            customer_name: purchaseData.users.name,
            redemption_date: redemptionDate
          }
        };
        
        setLastResult(successResult);
        
        // Add to transaction history
        const newTransaction: RedemptionTransaction = {
          id: purchaseData.id,
          code: purchaseData.discount_deals.coupon_code,
          title: purchaseData.discount_deals.title,
          discount: purchaseData.discount_deals.discount_value,
          customerName: purchaseData.users.name,
          timestamp: redemptionDate,
          status: 'success'
        };
        
        const updatedTransactions = [newTransaction, ...transactions];
        setTransactions(updatedTransactions);
        
        toast.success('Discount code successfully redeemed!');
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      setLastResult({
        type: 'error',
        error_code: 'invalid',
        message: 'Failed to process QR code. Please try scanning again.'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Scan Discount QR Codes</h2>
        <p className="text-muted-foreground">
          Scan customer QR codes to verify and redeem discount deals
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Camera/Scanner section */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>
              {scanning ? 'Point camera at a QR code' : 'Start scanner to redeem a discount code'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative bg-black aspect-square w-full flex items-center justify-center">
              {scanning ? (
                <>
                  <video 
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  <canvas 
                    ref={canvasRef}
                    className="hidden"
                  />
                  <div className="absolute inset-0 border-[3px] border-white/30 rounded-lg m-12 z-10 pointer-events-none"></div>
                </>
              ) : (
                <div className="text-center p-8">
                  {cameraError ? (
                    <div className="text-red-500">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                      <p>{cameraError}</p>
                    </div>
                  ) : (
                    <>
                      <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">Camera inactive</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4">
            <Button 
              className="w-full"
              variant={scanning ? "destructive" : "default"}
              onClick={scanning ? stopScanning : startScanning}
            >
              {scanning ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Stop Scanner
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Start Scanner
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Results section */}
        <Card>
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
            <CardDescription>
              Verification results will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lastResult ? (
              <div className="space-y-4">
                {lastResult.type === 'success' ? (
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-green-500">{lastResult.message}</h3>
                        <div className="mt-3 space-y-2">
                          <p><span className="font-medium">Deal:</span> {lastResult.dealDetails.title}</p>
                          <p><span className="font-medium">Discount:</span> {lastResult.dealDetails.discount_value}</p>
                          <p><span className="font-medium">Code:</span> {lastResult.dealDetails.coupon_code}</p>
                          {lastResult.dealDetails.customer_name && (
                            <p><span className="font-medium">Customer:</span> {lastResult.dealDetails.customer_name}</p>
                          )}
                          <p><span className="font-medium">Redeemed:</span> {format(new Date(lastResult.dealDetails.redemption_date), 'PPp')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`
                    ${lastResult.error_code === 'already-redeemed' ? 'bg-blue-500/10 border-blue-500/20' : 
                      lastResult.error_code === 'expired' ? 'bg-amber-500/10 border-amber-500/20' : 
                      'bg-red-500/10 border-red-500/20'} 
                    border p-4 rounded-lg
                  `}>
                    <div className="flex items-start gap-3">
                      {lastResult.error_code === 'already-redeemed' ? (
                        <AlertCircle className="h-6 w-6 text-blue-500 mt-0.5" />
                      ) : lastResult.error_code === 'expired' ? (
                        <AlertCircle className="h-6 w-6 text-amber-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <h3 className={`font-semibold
                          ${lastResult.error_code === 'already-redeemed' ? 'text-blue-500' : 
                            lastResult.error_code === 'expired' ? 'text-amber-500' : 
                            'text-red-500'}
                        `}>
                          {lastResult.message}
                        </h3>
                        
                        {lastResult.dealDetails && (
                          <div className="mt-3 space-y-2">
                            {lastResult.dealDetails.title && (
                              <p><span className="font-medium">Deal:</span> {lastResult.dealDetails.title}</p>
                            )}
                            {lastResult.dealDetails.discount_value && (
                              <p><span className="font-medium">Discount:</span> {lastResult.dealDetails.discount_value}</p>
                            )}
                            {lastResult.dealDetails.coupon_code && (
                              <p><span className="font-medium">Code:</span> {lastResult.dealDetails.coupon_code}</p>
                            )}
                            {lastResult.dealDetails.expiry_date && (
                              <p><span className="font-medium">Expired on:</span> {format(new Date(lastResult.dealDetails.expiry_date), 'PP')}</p>
                            )}
                            {lastResult.dealDetails.redemption_date && (
                              <p><span className="font-medium">Previously redeemed:</span> {format(new Date(lastResult.dealDetails.redemption_date), 'PPp')}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-primary/5 inline-flex p-3 rounded-full mb-4">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No codes scanned yet</h3>
                <p className="text-muted-foreground">
                  Scan a QR code to verify and redeem a discount
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {
                setLastResult(null);
                startScanning();
              }}
              disabled={scanning}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Scan Another Code
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Transaction History */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Recent Redemptions</h3>
        </div>
        
        {transactions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No redemption history yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium">Code</th>
                    <th className="text-left p-3 font-medium">Deal</th>
                    <th className="text-left p-3 font-medium">Customer</th>
                    <th className="text-left p-3 font-medium">Discount</th>
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-left p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transactions.slice(0, 10).map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-muted/30">
                      <td className="p-3 font-mono text-sm">{transaction.code}</td>
                      <td className="p-3">{transaction.title}</td>
                      <td className="p-3">{transaction.customerName || '-'}</td>
                      <td className="p-3">{transaction.discount}</td>
                      <td className="p-3 text-sm">{format(new Date(transaction.timestamp), 'PP')}</td>
                      <td className="p-3">
                        <Badge
                          variant={
                            transaction.status === 'success' ? 'default' :
                            transaction.status === 'already-redeemed' ? 'secondary' :
                            transaction.status === 'expired' ? 'outline' : 'destructive'
                          }
                          className={transaction.status === 'success' ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                          {transaction.status === 'success' ? 'Redeemed' :
                           transaction.status === 'already-redeemed' ? 'Already Used' :
                           transaction.status === 'expired' ? 'Expired' : 'Invalid'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Testing Help Section */}
      {useMockData && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Testing Help</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <div>
                <p className="mb-2">For testing purposes, you can generate a QR code with one of these codes:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-muted rounded-md">
                    <p className="font-medium">Valid code:</p>
                    <code className="text-xs font-mono bg-background p-1 rounded">NIKE50RUN</code>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="font-medium">Already redeemed:</p>
                    <code className="text-xs font-mono bg-background p-1 rounded">ADIDAS20OFF</code>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="font-medium">Expired code:</p>
                    <code className="text-xs font-mono bg-background p-1 rounded">AIRPODS30</code>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="font-medium">Another valid code:</p>
                    <code className="text-xs font-mono bg-background p-1 rounded">SBUXBOGO50</code>
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-2">To generate a QR code for testing:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Visit a <a href="https://www.qr-code-generator.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">QR code generator</a></li>
                  <li>Enter one of the codes above</li>
                  <li>Download or display the QR code on another device</li>
                  <li>Scan it with the scanner above</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Missing QrCode icon
function QrCode(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </svg>
  );
} 