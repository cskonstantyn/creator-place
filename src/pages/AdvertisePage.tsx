import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Check, Percent, Handshake, ArrowRight, Star, TrendingUp, Users, Shield } from "lucide-react";

const AdvertisePage = () => {
  useEffect(() => {
    document.title = "Advertise - CreatorDeals";
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-afghan-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Grow Your Business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Creator Marketing</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Connect with influential creators and reach your target audience through authentic partnerships and exclusive deals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonLink 
              to="/post-ad" 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium"
            >
              Start Advertising
            </ButtonLink>
            <ButtonLink 
              to="#pricing" 
              className="border border-white/20 bg-black/20 hover:bg-black/30 text-white px-8 py-3 rounded-full text-lg font-medium"
            >
              View Pricing
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Why Advertise Section */}
      <section className="py-20 bg-afghan-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Advertise on CreatorDeals?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform connects you with authentic creators who can amplify your brand message and drive real results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-afghan-background-dark p-8 rounded-xl border border-white/5 text-center">
              <div className="w-14 h-14 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Targeted Reach</h3>
              <p className="text-gray-400">
                Connect with creators who have already built trust with your target audience
              </p>
            </div>
            
            <div className="bg-afghan-background-dark p-8 rounded-xl border border-white/5 text-center">
              <div className="w-14 h-14 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Authentic Content</h3>
              <p className="text-gray-400">
                Get genuine endorsements that resonate more than traditional advertising
              </p>
            </div>
            
            <div className="bg-afghan-background-dark p-8 rounded-xl border border-white/5 text-center">
              <div className="w-14 h-14 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Measurable Results</h3>
              <p className="text-gray-400">
                Track performance metrics and see the real impact of your creator partnerships
              </p>
            </div>
            
            <div className="bg-afghan-background-dark p-8 rounded-xl border border-white/5 text-center">
              <div className="w-14 h-14 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Brand Safety</h3>
              <p className="text-gray-400">
                Work with vetted creators who align with your brand values and guidelines
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advertising Options Section */}
      <section className="py-20 bg-afghan-background-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Two Ways to Advertise</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the advertising model that works best for your business goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-afghan-background p-8 rounded-xl border border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center">
                  <Percent className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold">Discount Deals</h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                Offer exclusive discounts that creators can purchase and promote to their audience. Perfect for driving immediate sales and building brand awareness.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Drive direct sales with special creator-only discounts</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Generate buzz with limited-time offers</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Track redemptions with unique discount codes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Increase foot traffic to physical locations</span>
                </li>
              </ul>
              
              <ButtonLink 
                to="/post-ad?tab=discount" 
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-lg font-medium"
              >
                Create Discount Deal
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
            
            <div className="bg-afghan-background p-8 rounded-xl border border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Handshake className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold">Brand Deals</h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                Create partnership opportunities for creators to apply and collaborate with your brand. Ideal for long-term partnerships and content creation.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Receive applications from relevant creators</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Get authentic content created for your brand</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Build long-term relationships with influencers</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Control the narrative with detailed briefs</span>
                </li>
              </ul>
              
              <ButtonLink 
                to="/post-ad?tab=brand-deal" 
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-3 rounded-lg font-medium"
              >
                Create Brand Deal
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-afghan-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our streamlined process makes it easy to create and manage your advertising campaigns
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="bg-afghan-background-dark p-8 rounded-xl border border-white/5 h-full">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold mb-6">1</div>
                <h3 className="text-xl font-semibold mb-3">Create Your Campaign</h3>
                <p className="text-gray-400">
                  Choose between discount deals or brand partnerships. Set your budget, requirements, and campaign details.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-8 w-8 text-purple-500/50" />
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-afghan-background-dark p-8 rounded-xl border border-white/5 h-full">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold mb-6">2</div>
                <h3 className="text-xl font-semibold mb-3">Connect with Creators</h3>
                <p className="text-gray-400">
                  For brand deals, review applications and select the best creators. For discount deals, creators will discover and purchase your offers.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-8 w-8 text-purple-500/50" />
              </div>
            </div>
            
            <div className="bg-afghan-background-dark p-8 rounded-xl border border-white/5 h-full">
              <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold mb-6">3</div>
              <h3 className="text-xl font-semibold mb-3">Measure Results</h3>
              <p className="text-gray-400">
                Track performance metrics, redemptions, and content created. Use insights to optimize future campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-afghan-background-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the plan that works best for your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-afghan-background p-8 rounded-xl border border-white/5">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Basic</h3>
                <div className="text-3xl font-bold mb-1">$49<span className="text-sm font-normal text-gray-400">/month</span></div>
                <p className="text-gray-400">Perfect for small businesses</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Up to 5 active campaigns</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Basic analytics dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Email support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Standard listing visibility</span>
                </li>
              </ul>
              
              <Button className="w-full bg-afghan-background-dark hover:bg-afghan-background-light text-white border border-white/10">
                Get Started
              </Button>
            </div>
            
            <div className="bg-gradient-to-b from-purple-900/20 to-indigo-900/20 p-8 rounded-xl border border-purple-500/20 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold py-1 px-4 rounded-full">
                MOST POPULAR
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Professional</h3>
                <div className="text-3xl font-bold mb-1">$99<span className="text-sm font-normal text-gray-400">/month</span></div>
                <p className="text-gray-400">For growing businesses</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Up to 15 active campaigns</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Advanced analytics and reporting</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Priority email & chat support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Featured listings</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Creator matching assistance</span>
                </li>
              </ul>
              
              <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                Get Started
              </Button>
            </div>
            
            <div className="bg-afghan-background p-8 rounded-xl border border-white/5">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <div className="text-3xl font-bold mb-1">Custom</div>
                <p className="text-gray-400">For large organizations</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Unlimited campaigns</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Custom analytics & API access</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Premium placement</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Custom creator recruitment</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Content review & approval</span>
                </li>
              </ul>
              
              <Button className="w-full bg-afghan-background-dark hover:bg-afghan-background-light text-white border border-white/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-afghan-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Brand?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Join hundreds of businesses already connecting with creators on our platform
          </p>
          <ButtonLink 
            to="/post-ad" 
            className="bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 text-white px-8 py-3 rounded-full text-lg font-medium"
          >
            Start Advertising Now
          </ButtonLink>
        </div>
      </section>
    </Layout>
  );
};

export default AdvertisePage; 