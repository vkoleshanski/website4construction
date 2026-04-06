import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { useSiteContent } from "@/hooks/use-site-content";

interface HeroSectionProps {
  onOpenQuote: () => void;
}

const HeroSection = ({ onOpenQuote }: HeroSectionProps) => {
  const {
    content: { hero, brand },
  } = useSiteContent();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={hero.image}
        alt={hero.imageAlt}
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-industrial/90 via-industrial/75 to-industrial/40" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/8 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-accent/8 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      
      <div className="relative z-10 container-custom px-4 md:px-8 py-20">
        <div className="max-w-2xl animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-industrial-foreground/10 border border-industrial-foreground/20 backdrop-blur-md text-sm text-industrial-foreground/90 mb-6">
            <span className="w-2 h-2 rounded-full gradient-primary" />
            {hero.badge}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-industrial-foreground">
            {hero.titlePrefix}{" "}
            <span className="text-gradient">{hero.titleHighlight}</span>
          </h1>
          <p className="text-lg md:text-xl text-industrial-foreground/70 leading-relaxed mb-10 max-w-xl">
            {hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={onOpenQuote} className="text-base px-8 rounded-full gradient-primary border-0 hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30">
              {hero.primaryButton}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" asChild className="text-base px-8 rounded-full bg-industrial-foreground/15 border border-industrial-foreground/30 text-industrial-foreground hover:bg-industrial-foreground/25 backdrop-blur-sm transition-all duration-300">
              <a href={`tel:${brand.phoneLink}`}>
                <Phone className="mr-2 h-4 w-4" />
                {hero.secondaryButton}
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
