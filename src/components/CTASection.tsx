import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/hooks/use-site-content";

interface CTASectionProps {
  onOpenQuote: () => void;
}

const CTASection = ({ onOpenQuote }: CTASectionProps) => {
  const {
    content: { home },
  } = useSiteContent();

  const cta = home.ctaSection;

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="relative rounded-3xl gradient-primary overflow-hidden px-8 py-16 md:py-20 text-center">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary-foreground/10" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary-foreground/10" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              {cta.title}
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              {cta.description}
            </p>
            <Button size="lg" onClick={onOpenQuote} className="text-base px-8 rounded-full bg-primary-foreground text-foreground hover:bg-primary-foreground/90 shadow-xl hover:scale-105 transition-all duration-300">
              {cta.buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
