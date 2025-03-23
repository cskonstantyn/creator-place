import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Save, Download, Share2 } from 'lucide-react';

export interface QRCodeProps {
  value: string;
  title?: string;
  size?: number;
  description?: string;
  logo?: string;
  bgColor?: string;
  fgColor?: string;
}

export function QRCode({
  value,
  title = 'Discount Code',
  size = 200,
  description,
  logo,
  bgColor = '#ffffff',
  fgColor = '#000000'
}: QRCodeProps) {
  // Function to download QR code as PNG
  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-qrcode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  // Function to share QR code (if Web Share API is available)
  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
        if (canvas) {
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
              resolve(blob as Blob);
            }, 'image/png');
          });
          
          const file = new File([blob], `${title}-qrcode.png`, { type: 'image/png' });
          
          await navigator.share({
            title: title,
            text: description || 'My discount QR code',
            files: [file]
          });
        }
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Web Share API not supported in your browser');
    }
  };
  
  return (
    <Card className="w-full max-w-sm mx-auto bg-white text-black">
      <CardHeader className="p-4 pb-2 border-b">
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center">
        <div className="relative flex justify-center items-center">
          <QRCodeSVG 
            id="qr-code"
            value={value}
            size={size}
            bgColor={bgColor}
            fgColor={fgColor}
            level="H"
            includeMargin={true}
            imageSettings={
              logo ? {
                src: logo,
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              } : undefined
            }
          />
          <canvas 
            id="qr-code-canvas" 
            style={{ display: 'none' }}
            width={size}
            height={size}
          />
        </div>
        
        {description && (
          <p className="mt-4 text-sm text-center text-gray-700">{description}</p>
        )}
        
        <div className="flex gap-2 mt-4 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={downloadQRCode}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={shareQRCode}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 