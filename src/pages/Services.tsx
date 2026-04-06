import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/use-site-content";
import { serviceIcons } from "@/lib/icon-map";
import SeoHead from "@/components/SeoHead";

interface ServicesProps {
  onOpenQuote: () => void;
}

const Services = ({ onOpenQuote }: ServicesProps) => {
  const {
    content: { servicesPage, services, seo },
  } = useSiteContent();

  return (
    <div className="pt-20">
      <SeoHead
        title={seo.services.title}
        description={seo.services.description}
        keywords={seo.services.keywords}
        path="/services"
        image={seo.defaultImage}
      />

      {/* Hero */}
      <section className="section-padding gradient-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
        <div className="container-custom text-center relative z-10">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">{servicesPage.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-industrial-foreground mb-5">
            {servicesPage.titlePrefix} <span className="text-gradient">{servicesPage.titleHighlight}</span>
          </h1>
          <p className="text-steel text-lg max-w-2xl mx-auto leading-relaxed">
            {servicesPage.description}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-background">
        <div className="container-custom space-y-28">
          {services.map((service, i) => {
            const Icon = serviceIcons[service.icon];

            return (
            <article
              key={service.title}
              className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 lg:gap-16 items-center`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute -inset-4 rounded-3xl gradient-primary opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500 blur-xl" />
                <img
                  src={service.image}
                  alt={service.imageAlt}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="relative rounded-3xl shadow-2xl w-full h-72 md:h-96 object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 p-4 glass rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <div className="flex flex-wrap gap-2">
                    {service.keywords.map((kw) => (
                      <span key={kw} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                  <Icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-foreground mb-4">{service.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6 text-base">{service.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {service.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={onOpenQuote} 
                  className="rounded-full gradient-primary border-0 shadow-md shadow-primary/20 hover:opacity-90 hover:scale-105 transition-all duration-300 px-8"
                >
                  {servicesPage.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Services;
