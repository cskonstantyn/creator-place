
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Contact Us - CreatorDeals";
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon!",
      });
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-afghan-background">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Get In Touch
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="content-card flex flex-col items-center text-center p-8">
                <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Email Us</h3>
                <p className="text-gray-400 mb-4">Have a question? Reach out to our team.</p>
                <a href="mailto:contact@creatordeals.af" className="text-purple-400 hover:text-purple-300">
                  contact@creatordeals.af
                </a>
              </div>
              
              <div className="content-card flex flex-col items-center text-center p-8">
                <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Our Location</h3>
                <p className="text-gray-400 mb-4">Come visit our office.</p>
                <p className="text-gray-300">
                  Business Bay, Kabul <br />
                  Afghanistan
                </p>
              </div>
              
              <div className="content-card flex flex-col items-center text-center p-8">
                <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Call Us</h3>
                <p className="text-gray-400 mb-4">Mon-Fri from 9am to 5pm.</p>
                <a href="tel:+93700000000" className="text-purple-400 hover:text-purple-300">
                  +93 70 000 0000
                </a>
              </div>
            </div>
            
            <div className="content-card p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="form-label">Your Name</label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-afghan-background-dark border-white/10"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label">Your Email</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-afghan-background-dark border-white/10"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    placeholder="Enter your message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="form-input resize-none"
                  />
                </div>
                <div className="text-center">
                  <Button 
                    type="submit" 
                    variant="gradient"
                    size="lg"
                    rounded="lg"
                    disabled={isSubmitting}
                    className="px-8"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
