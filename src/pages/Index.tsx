import HeroSection from "@/components/HeroSection";
import ServicesPreview from "@/components/ServicesPreview";
import WhyUs from "@/components/WhyUs";
import CTASection from "@/components/CTASection";
import SeoHead from "@/components/SeoHead";
import { useSiteContent } from "@/hooks/use-site-content";

interface IndexProps {
  onOpenQuote: () => void;
}

const Index = ({ onOpenQuote }: IndexProps) => {
  const {
    content: { seo },
  } = useSiteContent();

  return (
    <>
      <SeoHead
        title={seo.home.title}
        description={seo.home.description}
        keywords={seo.home.keywords}
        path="/"
        image={seo.defaultImage}
      />
      <HeroSection onOpenQuote={onOpenQuote} />
      <ServicesPreview />
      <WhyUs />
      <CTASection onOpenQuote={onOpenQuote} />
    </>
  );
};

export default Index;
