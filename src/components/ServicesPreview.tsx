import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useSiteContent } from "@/hooks/use-site-content";
import { serviceIcons } from "@/lib/icon-map";

const ServicesPreview = () => {
  const {
    content: { home, services },
  } = useSiteContent();

  const section = home.servicesSection;

  return (
    <section className="section-padding bg-background" id="services">
      <div className="container-custom">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">{section.eyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            {section.titlePrefix} <span className="text-gradient">{section.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">{section.description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = serviceIcons[service.icon];

            return (
            <Link
              key={service.title}
              to="/services"
              className="magnetic-card group p-8 flex flex-col relative overflow-hidden"
            >
              <span className="absolute top-6 right-6 text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full tracking-wide uppercase">
                {service.previewTag}
              </span>
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-primary/20">
                <Icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                {service.title}
                <ArrowUpRight className="h-4 w-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-primary" />
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.shortDescription}</p>
              <div className="mt-auto pt-5">
                <span className="text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                  {section.learnMoreText} <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
