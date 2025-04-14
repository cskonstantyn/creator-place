import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { ArrowRight, Check, Globe, Users, Building, Star, Shield, Zap, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Connect Creators With Brands That Matter
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10">
              The platform where content creators and brands build authentic partnerships and share exclusive deals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/browse')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Browse Deals <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => navigate('/register')}
                size="lg"
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
              >
                Create Account
              </Button>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8">
              <div className="flex items-center">
                <Star className="text-yellow-400 h-5 w-5 mr-2" />
                <span className="text-gray-300">1000+ Active Deals</span>
              </div>
              <div className="flex items-center">
                <Users className="text-blue-400 h-5 w-5 mr-2" />
                <span className="text-gray-300">500+ Content Creators</span>
              </div>
              <div className="flex items-center">
                <Building className="text-green-400 h-5 w-5 mr-2" />
                <span className="text-gray-300">200+ Trusted Brands</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              CreatorDeals connects three types of users with unique benefits for each
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Regular Users */}
            <div className="bg-gray-800/50 rounded-xl p-8 hover:bg-gray-800/80 transition-all border border-gray-700 hover:border-purple-500/30 shadow-lg">
              <Globe className="h-12 w-12 text-purple-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4">For Daily Users</h3>
              <p className="text-gray-400 mb-6">
                Discover exclusive discount codes and deals from your favorite brands and creators.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Access to exclusive discounts</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Find deals from favorite creators</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Save money on trusted products</span>
                </li>
              </ul>
              <Button 
                onClick={() => navigate('/browse')}
                className="w-full"
              >
                Browse Deals <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {/* Content Creators */}
            <div className="bg-gray-800/50 rounded-xl p-8 hover:bg-gray-800/80 transition-all border border-gray-700 hover:border-purple-500/30 shadow-lg">
              <Users className="h-12 w-12 text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4">For Content Creators</h3>
              <p className="text-gray-400 mb-6">
                Find brand deals to partner with and monetize your audience with authentic collaborations.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Apply for brand partnerships</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Get exclusive discount codes</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Monetize your audience</span>
                </li>
              </ul>
              <Button 
                onClick={() => navigate('/browse?type=brand-deal')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Find Brand Deals <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {/* Brands */}
            <div className="bg-gray-800/50 rounded-xl p-8 hover:bg-gray-800/80 transition-all border border-gray-700 hover:border-purple-500/30 shadow-lg">
              <Building className="h-12 w-12 text-green-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4">For Brands</h3>
              <p className="text-gray-400 mb-6">
                Post brand deals to attract creators or advertise discount codes to reach more customers.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Connect with relevant creators</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Post discount deals</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Increase brand visibility</span>
                </li>
              </ul>
              <Button 
                onClick={() => navigate('/post-ad')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Post a Deal <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pain Points Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-900/80">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Tired of The Same Old Problems?</h2>
            <p className="text-xl text-gray-400">
              The creator economy is growing, but connecting creators with brands remains challenging
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-red-400">For Creators</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mr-3 mt-0.5">!</span>
                  <p>Struggling to find genuine brand partnerships that align with your values</p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mr-3 mt-0.5">!</span>
                  <p>Wasting time on communication back-and-forth with brands</p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mr-3 mt-0.5">!</span>
                  <p>Difficult to monetize your audience effectively</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-red-400">For Brands</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mr-3 mt-0.5">!</span>
                  <p>Difficult to find the right creators who truly represent your brand values</p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mr-3 mt-0.5">!</span>
                  <p>High costs and uncertain ROI with traditional influencer marketing</p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mr-3 mt-0.5">!</span>
                  <p>Lack of transparency and inefficient communication channels</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Solution</h2>
            <p className="text-xl text-gray-400">
              CreatorDeals provides a streamlined platform that connects creators and brands through a transparent marketplace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-purple-900/20 to-purple-900/5 p-8 rounded-xl border border-purple-500/20">
              <Zap className="h-10 w-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Simplified Connections</h3>
              <p className="text-gray-400">
                Our platform eliminates the friction in creator-brand partnerships with a streamlined application process.
              </p>
            </div>
            
            <div className="bg-gradient-to-b from-purple-900/20 to-purple-900/5 p-8 rounded-xl border border-purple-500/20">
              <Shield className="h-10 w-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Verified Partners</h3>
              <p className="text-gray-400">
                All creators and brands are verified to ensure authenticity and build trust within our community.
              </p>
            </div>
            
            <div className="bg-gradient-to-b from-purple-900/20 to-purple-900/5 p-8 rounded-xl border border-purple-500/20">
              <Sparkles className="h-10 w-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Transparent Marketplace</h3>
              <p className="text-gray-400">
                Clear terms, expectations, and pricing make it easy to find the right partnerships.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of creators and brands already using CreatorDeals to grow their businesses
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/register')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Create Free Account
              </Button>
              <Button
                onClick={() => navigate('/browse')}
                size="lg"
                variant="outline"
                className="border-white/20 hover:bg-white/5"
              >
                Browse Deals
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage; 