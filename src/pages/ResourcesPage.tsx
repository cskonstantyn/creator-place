import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ExternalLink, BookOpen, Video, FileText, Lightbulb, Trophy, Users } from "lucide-react";

const ResourcesPage = () => {
  const resources = [
    {
      title: "Creator Marketing Guide",
      description: "Learn how to market yourself as a creator and attract brand deals.",
      icon: <BookOpen className="h-6 w-6 text-purple-500" />,
      link: "#",
      linkText: "Read Guide",
    },
    {
      title: "Negotiation Templates",
      description: "Download templates to help you negotiate better deals with brands.",
      icon: <FileText className="h-6 w-6 text-green-500" />,
      link: "#",
      linkText: "Download Templates",
    },
    {
      title: "Video Tutorials",
      description: "Watch tutorials on how to create high-quality content for brand partnerships.",
      icon: <Video className="h-6 w-6 text-blue-500" />,
      link: "#",
      linkText: "Watch Tutorials",
    },
    {
      title: "Rate Calculator",
      description: "Calculate how much to charge for sponsored content based on your audience.",
      icon: <Download className="h-6 w-6 text-amber-500" />,
      link: "#",
      linkText: "Use Calculator",
    },
    {
      title: "Success Stories",
      description: "Read success stories from creators who have secured lucrative brand deals.",
      icon: <Trophy className="h-6 w-6 text-orange-500" />,
      link: "#",
      linkText: "Read Stories",
    },
    {
      title: "Community Forum",
      description: "Join our community forum to connect with other creators and share tips.",
      icon: <Users className="h-6 w-6 text-indigo-500" />,
      link: "#",
      linkText: "Join Forum",
    },
  ];

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Creator Resources</h1>
            <p className="text-gray-400 text-lg">
              Access free tools, guides, and resources to help you succeed as a creator and secure better brand deals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="glassmorphism hover:border-purple-500/30 transition-all">
                <CardHeader className="pb-3">
                  <div className="mb-3">{resource.icon}</div>
                  <CardTitle className="text-xl">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    {resource.linkText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-8 rounded-xl border border-purple-500/20">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0">
                <Lightbulb className="h-12 w-12 text-yellow-400" />
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-2">Looking for personalized guidance?</h2>
                <p className="text-gray-300 mb-4">
                  Our team of experienced creator coaches can help you develop a personalized strategy for your content and brand partnerships.
                </p>
                <Button>
                  Schedule a Free Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResourcesPage; 