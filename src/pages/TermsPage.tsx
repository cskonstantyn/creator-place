import { useEffect } from "react";
import Layout from "@/components/Layout";

const TermsPage = () => {
  useEffect(() => {
    document.title = "Terms of Service - CreatorDeals";
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Terms of Service
          </h1>
          
          <div className="content-card mb-8 p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
              By accessing or using CreatorDeals, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you must not access or use our services.
            </p>
            <p className="text-gray-300 mb-4">
              We reserve the right to modify these terms at any time. Your continued use of CreatorDeals following the posting of changes constitutes your acceptance of such changes.
            </p>
          </div>
          
          <div className="content-card mb-8 p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
            <p className="text-gray-300 mb-4">
              To access certain features of CreatorDeals, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p className="text-gray-300 mb-4">
              You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </div>
          
          <div className="content-card mb-8 p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">3. User Content</h2>
            <p className="text-gray-300 mb-4">
              You retain ownership of any content you submit, post, or display on or through CreatorDeals. By submitting, posting, or displaying content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute your content.
            </p>
            <p className="text-gray-300 mb-4">
              You represent and warrant that you own or have the necessary rights to the content you submit, and that the content does not violate the rights of any third party.
            </p>
          </div>
          
          <div className="content-card mb-8 p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">4. Prohibited Activities</h2>
            <p className="text-gray-300 mb-4">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
              <li>Using the service for any illegal purpose or in violation of any local, state, national, or international law</li>
              <li>Harassing, threatening, or intimidating other users</li>
              <li>Posting or transmitting content that is harmful, offensive, obscene, abusive, invasive of privacy, defamatory, or otherwise objectionable</li>
              <li>Impersonating any person or entity or falsely stating or misrepresenting your affiliation with a person or entity</li>
              <li>Interfering with or disrupting the service or servers or networks connected to the service</li>
              <li>Attempting to gain unauthorized access to any portion of the service or any other systems or networks connected to the service</li>
            </ul>
          </div>
          
          <div className="content-card mb-8 p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="text-gray-300 mb-4">
              The service and its original content, features, and functionality are and will remain the exclusive property of CreatorDeals and its licensors. The service is protected by copyright, trademark, and other laws.
            </p>
            <p className="text-gray-300 mb-4">
              Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of CreatorDeals.
            </p>
          </div>
          
          <div className="content-card mb-8 p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
            <p className="text-gray-300 mb-4">
              We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
            <p className="text-gray-300 mb-4">
              If you wish to terminate your account, you may simply discontinue using the service or contact us to request account deletion.
            </p>
          </div>
          
          <div className="content-card mb-8 p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              In no event shall CreatorDeals, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
          </div>
          
          <div className="content-card p-8 bg-afghan-background-dark rounded-xl border border-white/5">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-300">
              <a href="mailto:legal@creatordeals.af" className="text-purple-400 hover:text-purple-300">legal@creatordeals.af</a>
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

export default TermsPage; 