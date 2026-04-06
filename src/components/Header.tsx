import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/use-site-content";

interface HeaderProps {
  onOpenQuote: () => void;
}

const Header = ({ onOpenQuote }: HeaderProps) => {
  const {
    content: { brand, navigation },
  } = useSiteContent();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navLinks = [
    { to: "/", label: navigation.home },
    { to: "/services", label: navigation.services },
    { to: "/gallery", label: navigation.gallery },
    { to: "/contact", label: navigation.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // On non-home pages, always use solid header style
  const useSolidHeader = !isHome || scrolled;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${useSolidHeader ? "bg-card/95 backdrop-blur-xl shadow-lg shadow-foreground/5 border-b border-border/50" : "bg-transparent"}`}>
      <div className="container-custom flex items-center justify-between h-20 md:h-24 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={brand.logo} alt={brand.logoAlt} className="h-14 w-auto md:h-16 drop-shadow-md" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                location.pathname === link.to
                  ? "bg-primary/15 text-primary"
                  : useSolidHeader
                    ? "text-foreground hover:bg-muted hover:text-primary"
                    : "text-industrial-foreground/90 hover:text-industrial-foreground hover:bg-industrial-foreground/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href={`tel:${brand.phoneLink}`} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${useSolidHeader ? "text-muted-foreground hover:text-primary" : "text-industrial-foreground/80 hover:text-industrial-foreground"}`}>
            <Phone className="h-4 w-4" />
            {brand.phoneDisplay}
          </a>
          <Button onClick={onOpenQuote} size="sm" className="rounded-full gradient-primary border-0 shadow-md shadow-primary/25 hover:opacity-90 hover:scale-105 transition-all duration-300">
            {navigation.quoteButton}
          </Button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 ${useSolidHeader ? "text-foreground" : "text-industrial-foreground"}`}
          aria-label="Меню"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl rounded-b-2xl mx-2 mb-2 overflow-hidden border border-border/50 shadow-xl">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === link.to ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button onClick={() => { onOpenQuote(); setMobileOpen(false); }} className="mt-3 rounded-full gradient-primary border-0">
              {navigation.quoteButton}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
