import { Search, Bell, Menu, ChevronDown, User, LogOut, Settings, Heart, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser) as UserProfile;
        setUser(userData);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  return (
    <header className="sticky top-0 w-full bg-black/50 backdrop-blur-md border-b border-white/10 z-50">
      <div className="container-max mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="CreatorDeals Logo" className="h-8 w-8" />
            <span className="font-semibold text-lg hidden sm:inline-block">CreatorDeals</span>
          </Link>

          {/* Search */}
          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex items-center border border-white/10 rounded-lg bg-white/5 px-2 max-w-sm overflow-hidden"
          >
            <Search className="h-4 w-4 text-white/60" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 focus:outline-none focus:ring-0 text-sm text-white h-9 w-48 lg:w-64"
            />
          </form>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link 
            to="/browse" 
            className="text-white/70 hover:text-white px-3 py-2 text-sm transition-colors"
          >
            Browse
          </Link>
          <Link 
            to="/resources" 
            className="text-white/70 hover:text-white px-3 py-2 text-sm transition-colors"
          >
            Resources
          </Link>
          <Link 
            to="/contact" 
            className="text-white/70 hover:text-white px-3 py-2 text-sm transition-colors"
          >
            Contact
          </Link>
          <Link 
            to="/faq" 
            className="text-white/70 hover:text-white px-3 py-2 text-sm transition-colors"
          >
            FAQ
          </Link>
        </nav>

        {/* Right section: notification, profile */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link 
                to="/post-ad" 
                className="hidden md:flex bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium max-width-full"
              >
                Create Deal
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                asChild
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
              >
                <Link to="/notifications">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 hover:bg-white/10 p-2 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium">{user.name}</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-400 focus:text-red-400 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <ButtonLink 
                to="/login" 
                variant="outline"
                rounded="full"
                size="default"
                className="text-white font-medium"
              >
                Sign In
              </ButtonLink>
              <ButtonLink 
                to="/register" 
                variant="ghost"
                rounded="full"
                size="default"
                className="text-white font-medium hidden sm:flex"
              >
                Register
              </ButtonLink>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-black/95 md:hidden">
          <div className="flex flex-col p-4 space-y-4 overflow-y-auto h-full">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-bold text-white">CreatorDeals</div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search deals..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                    setMobileMenuOpen(false);
                  }
                }}
              />
            </div>
            
            {/* Mobile Nav Links */}
            <Link 
              to="/" 
              className="px-3 py-2 hover:bg-white/5 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className="px-3 py-2 hover:bg-white/5 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse All Deals
            </Link>
            <Link 
              to="/about" 
              className="px-3 py-2 hover:bg-white/5 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/partnerships" 
              className="px-3 py-2 hover:bg-white/5 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Partnerships
            </Link>
            <Link 
              to="/advertise" 
              className="px-3 py-2 hover:bg-white/5 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Advertise
            </Link>
            <Link 
              to="/contact" 
              className="px-3 py-2 hover:bg-white/5 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              to="/faq" 
              className="px-3 py-2 hover:bg-white/5 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link 
              to="/terms" 
              className="px-3 py-2 hover:bg-white/5 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Terms of Service
            </Link>
            <Link 
              to="/privacy" 
              className="px-3 py-2 hover:bg-white/5 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Privacy Policy
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="px-3 py-2 hover:bg-white/5 rounded-lg flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link 
                  to="/settings" 
                  className="px-3 py-2 hover:bg-white/5 rounded-lg flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button 
                  className="mt-2 px-3 py-2 text-left hover:bg-white/5 rounded-lg text-red-400 flex items-center gap-2"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="mt-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-3 py-2 border border-purple-600 text-purple-400 hover:bg-purple-600/10 rounded-lg text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
