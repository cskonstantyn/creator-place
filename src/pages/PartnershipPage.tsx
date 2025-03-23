import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Check, Handshake, ArrowRight, Building, Globe, Award, Zap } from "lucide-react";

const PartnershipPage = () => {
  useEffect(() => {
    document.title = "Partnerships - CreatorDeals";
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-afghan-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Partnerships</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Join forces with CreatorDeals to expand your reach, enhance your offerings, and create mutual value
          </p>
          <ButtonLink 
            to="#contact" 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium"
          >
            Become a Partner
          </ButtonLink>
        </div>
      </section>

      {/* Partnership Types Section */}
      <section className="py-20 bg-afghan-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Partnership Opportunities</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We offer various partnership models to suit different organizations and goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-afghan-background-dark p-8 rounded-xl border border-white/5 h-full">
              <div className="w-14 h-14 bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <Building className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Corporate Partners</h3>
              <p className="text-gray-400 mb-6">
                For businesses looking to offer exclusive benefits to their employees or customers through our platform.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Exclusive corporate discount packages</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Employee benefit programs</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Co-branded marketing opportunities</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-afghan-background-dark p-8 rounded-xl border border-white/5 h-full">
              <div className="w-14 h-14 bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Media & Content Partners</h3>
              <p className="text-gray-400 mb-6">
                For media outlets, publications, and content platforms looking to enhance their creator offerings.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Content syndication opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Integrated platform solutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Joint content creation initiatives</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-afghan-background-dark p-8 rounded-xl border border-white/5 h-full">
              <div className="w-14 h-14 bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <Award className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Creator Communities</h3>
              <p className="text-gray-400 mb-6">
                For creator networks, agencies, and communities looking to provide more value to their members.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Exclusive community deals</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Revenue sharing opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Custom integration solutions</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-afghan-background-dark p-8 rounded-xl border border-white/5 h-full">
              <div className="w-14 h-14 bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Technology Partners</h3>
              <p className="text-gray-400 mb-6">
                For tech platforms, SaaS companies, and tools that serve creators or brands in the digital space.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">API integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Co-developed features</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Joint go-to-market strategies</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-afghan-background-dark p-8 rounded-xl border border-white/5 h-full">
              <div className="w-14 h-14 bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <Handshake className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Strategic Alliances</h3>
              <p className="text-gray-400 mb-6">
                For organizations with complementary services looking to create long-term value through collaboration.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Joint venture opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Market expansion collaborations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Shared resource initiatives</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-afghan-background-dark p-8 rounded-xl border border-white/5 h-full">
              <div className="w-14 h-14 bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Educational Partners</h3>
              <p className="text-gray-400 mb-6">
                For educational institutions, online learning platforms, and creator education programs.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Student discount programs</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Curriculum integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Workshop and training collaborations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Process Section */}
      <section className="py-20 bg-afghan-background-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Partnership Process</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our streamlined approach to building successful partnerships
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="bg-afghan-background p-8 rounded-xl border border-white/5 h-full">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold mb-6">1</div>
                <h3 className="text-xl font-semibold mb-3">Initial Discussion</h3>
                <p className="text-gray-400">
                  We'll explore your goals, audience, and how a partnership could create mutual value.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-8 w-8 text-purple-500/50" />
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-afghan-background p-8 rounded-xl border border-white/5 h-full">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold mb-6">2</div>
                <h3 className="text-xl font-semibold mb-3">Proposal Development</h3>
                <p className="text-gray-400">
                  We'll craft a custom partnership proposal based on your specific needs and objectives.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-8 w-8 text-purple-500/50" />
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-afghan-background p-8 rounded-xl border border-white/5 h-full">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold mb-6">3</div>
                <h3 className="text-xl font-semibold mb-3">Agreement & Setup</h3>
                <p className="text-gray-400">
                  We'll finalize terms, sign agreements, and set up the technical aspects of our partnership.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-8 w-8 text-purple-500/50" />
              </div>
            </div>
            
            <div className="bg-afghan-background p-8 rounded-xl border border-white/5 h-full">
              <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold mb-6">4</div>
              <h3 className="text-xl font-semibold mb-3">Launch & Growth</h3>
              <p className="text-gray-400">
                We'll launch our partnership and continuously optimize for mutual success and growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-afghan-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Partnership Benefits</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Why partner with CreatorDeals?
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-afghan-background-dark p-8 rounded-xl border border-white/5">
              <h3 className="text-xl font-semibold mb-4">For Your Organization</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-300 font-medium">Expanded Reach</span>
                    <p className="text-gray-400 text-sm mt-1">Access our growing community of creators and brands</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-300 font-medium">Enhanced Offerings</span>
                    <p className="text-gray-400 text-sm mt-1">Add value to your existing products or services</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-300 font-medium">New Revenue Streams</span>
                    <p className="text-gray-400 text-sm mt-1">Unlock additional revenue opportunities through our platform</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-300 font-medium">Market Differentiation</span>
                    <p className="text-gray-400 text-sm mt-1">Stand out from competitors with unique creator-focused benefits</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-afghan-background-dark p-8 rounded-xl border border-white/5">
              <h3 className="text-xl font-semibold mb-4">For Your Audience</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-300 font-medium">Exclusive Access</span>
                    <p className="text-gray-400 text-sm mt-1">Provide special deals and opportunities not available elsewhere</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-300 font-medium">Added Value</span>
                    <p className="text-gray-400 text-sm mt-1">Enhance their experience with complementary benefits</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-300 font-medium">Streamlined Experience</span>
                    <p className="text-gray-400 text-sm mt-1">Integrated solutions that make their lives easier</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-300 font-medium">Growth Opportunities</span>
                    <p className="text-gray-400 text-sm mt-1">Help them expand their reach and success as creators</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-afghan-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-afghan-background-dark rounded-xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Become a Partner</h2>
              <p className="text-gray-300">
                Interested in exploring a partnership with CreatorDeals? Fill out the form below and our partnerships team will get in touch with you.
              </p>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-afghan-background border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-afghan-background border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
                <input
                  type="text"
                  id="company"
                  className="w-full px-4 py-3 bg-afghan-background border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your company name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="partnership-type" className="block text-sm font-medium text-gray-300 mb-1">Partnership Type</label>
                <select
                  id="partnership-type"
                  className="w-full px-4 py-3 bg-afghan-background border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select partnership type</option>
                  <option value="corporate">Corporate Partner</option>
                  <option value="media">Media & Content Partner</option>
                  <option value="creator">Creator Community</option>
                  <option value="technology">Technology Partner</option>
                  <option value="strategic">Strategic Alliance</option>
                  <option value="educational">Educational Partner</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Tell us about your goals</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-afghan-background border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Describe what you're looking to achieve with this partnership"
                  required
                ></textarea>
              </div>
              
              <div className="text-center">
                <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium">
                  Submit Partnership Inquiry
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PartnershipPage; 