import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getBrandDealById, incrementBrandDealViews } from "@/services/brandDealService";
import Layout from "@/components/Layout";
import { Heart, MapPin, Tag, Clock, Share2, QrCode, Copy, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { BrandDealContent } from "@/components/brand-deal/BrandDealContent";

const BrandDealPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  
  const { data: brandDeal, isLoading, error } = useQuery({
    queryKey: ["brandDeal", id],
    queryFn: () => getBrandDealById(id as string),
    enabled: !!id,
  });

  // Increment view count when the page loads
  useEffect(() => {
    if (id) {
      incrementBrandDealViews(id);
    }
  }, [id]);

  const handleToggleFavorite = () => {
    if (!brandDeal) return;
    
    const favoriteItem = {
      id: brandDeal.id,
      type: 'brand-deal' as const,
      title: brandDeal.title,
      imageUrl: brandDeal.image_url,
      createdAt: new Date().toISOString()
    };
    
    toggleFavorite(favoriteItem);
  };

  const handleShare = () => {
    setIsShareSheetOpen(true);
  };

  const handleApply = () => {
    toast("Application submitted!", {
      description: "Your application has been submitted successfully."
    });
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast("Link copied", {
        description: "Deal link has been copied to clipboard"
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast("Failed to copy", {
        description: "Could not copy the link to clipboard"
      });
    });
  };

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;
    
    const svg = qrCodeRef.current.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      // Download the PNG file
      const downloadLink = document.createElement('a');
      downloadLink.download = `brand-deal-${id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast("QR Code downloaded", {
        description: "QR Code has been downloaded successfully"
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <span className="ml-2">Loading brand deal...</span>
        </div>
      </Layout>
    );
  }

  if (error || !brandDeal) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error ? (error as Error).message : "Brand deal not found"}
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate("/browse")}>Browse Other Deals</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-400">
            <button onClick={() => navigate("/browse")} className="hover:text-white transition-colors">
              Browse
            </button>
            <span className="mx-2">/</span>
            <button 
              onClick={() => navigate(`/category/${brandDeal.category}`)} 
              className="hover:text-white transition-colors"
            >
              {brandDeal.category}
            </button>
            <span className="mx-2">/</span>
            <span className="text-white">{brandDeal.title}</span>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 gap-6">
            {/* Full width content */}
            <div className="col-span-1">
              <BrandDealContent 
                brandDeal={brandDeal}
                isFavorite={isFavorite(brandDeal.id, 'brand-deal')}
                toggleFavorite={handleToggleFavorite}
                onShare={handleShare}
                handleApply={handleApply}
              />
            </div>
          </div>
        </div>
        
        {/* Share Sheet */}
        <Sheet open={isShareSheetOpen} onOpenChange={setIsShareSheetOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Share this deal</SheetTitle>
              <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SheetClose>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div ref={qrCodeRef} className="bg-white p-4 rounded-lg">
                  <QRCodeSVG 
                    value={window.location.href} 
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-sm text-center text-gray-400">
                  Scan this QR code to share this deal
                </p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={copyToClipboard}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {isCopied ? "Copied!" : "Copy Link"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={downloadQRCode}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
};

export default BrandDealPage;
