import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
  // Add a viewport meta tag to ensure proper mobile rendering
  useEffect(() => {
    // Check if the viewport meta tag exists
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    // If it doesn't exist, create it
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    
    // Set the content attribute for better responsive handling
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');
    
    return () => {
      // Reset the viewport meta tag when the component unmounts
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-afghan-background w-full">
      <div className="w-full max-w-[1920px] mx-auto">
        <Navbar />
      </div>
      <main className={`flex-grow pt-16 md:pt-20 w-full ${fullWidth ? '' : 'max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8'}`}>
        {children}
      </main>
      <div className="w-full max-w-[1920px] mx-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Layout; 