import { useEffect } from "react";
import Layout from "@/components/Layout";

const PrivacyPage = () => {
  useEffect(() => {
    document.title = "Privacy Policy - CreatorDeals";
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Privacy Policy
          </h1>
          
          <div className="content-card mb-8 p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-300 mb-4">
              At CreatorDeals, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            <p className="text-gray-300 mb-4">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site or use our services.
            </p>
          </div>
          
          <div className="content-card mb-8 p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="text-gray-300 mb-4">
              We collect several types of information from and about users of our website, including:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
              <li><strong>Personal Data:</strong> Name, email address, telephone number, address, and other identifiers by which you may be contacted online or offline.</li>
              <li><strong>Profile Data:</strong> Your username, password, purchases, interests, preferences, feedback, and survey responses.</li>
              <li><strong>Usage Data:</strong> Information about how you use our website, products, and services.</li>
              <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            </ul>
          </div>
          
          <div className="content-card mb-8 p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">
              We may use the information we collect about you for various purposes, including:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features of our service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To provide you with news, special offers and general information about other goods, services and events which we offer</li>
            </ul>
          </div>
          
          <div className="content-card mb-8 p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">4. Disclosure of Your Information</h2>
            <p className="text-gray-300 mb-4">
              We may disclose personal information that we collect or you provide:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
              <li>To our subsidiaries and affiliates</li>
              <li>To contractors, service providers, and other third parties we use to support our business</li>
              <li>To fulfill the purpose for which you provide it</li>
              <li>For any other purpose disclosed by us when you provide the information</li>
              <li>With your consent</li>
              <li>To comply with any court order, law, or legal process, including to respond to any government or regulatory request</li>
              <li>To enforce our rights arising from any contracts entered into between you and us</li>
              <li>If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of CreatorDeals, our customers, or others</li>
            </ul>
          </div>
          
          <div className="content-card mb-8 p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-gray-300 mb-4">
              We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on secure servers behind firewalls.
            </p>
            <p className="text-gray-300 mb-4">
              Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our website. Any transmission of personal information is at your own risk.
            </p>
          </div>
          
          <div className="content-card mb-8 p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="text-gray-300 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
              <li>The right to access your personal information</li>
              <li>The right to rectify inaccurate personal information</li>
              <li>The right to request the deletion of your personal information</li>
              <li>The right to restrict the processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to object to the processing of your personal information</li>
            </ul>
            <p className="text-gray-300 mb-4">
              To exercise any of these rights, please contact us using the information provided below.
            </p>
          </div>
          
          <div className="content-card mb-8 p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
            <p className="text-gray-300 mb-4">
              Our service is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary actions.
            </p>
          </div>
          
          <div className="content-card p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-300">
              <a href="mailto:privacy@creatordeals.af" className="text-purple-400 hover:text-purple-300">privacy@creatordeals.af</a>
            </p>
          </div>
          
          <div className="text-gray-400 text-sm mt-8">
            Last updated: November 2023
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage; 