import { useSiteContent } from "@/hooks/use-site-content";
import { whyUsIcons } from "@/lib/icon-map";

const WhyUs = () => {
  const {
    content: { home },
  } = useSiteContent();

  const section = home.whyUsSection;

  return (
    <section className="section-padding gradient-dark relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">{section.eyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-industrial-foreground">
            {section.titlePrefix} <span className="text-gradient">{section.titleHighlight}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {section.items.map((item) => {
            const Icon = whyUsIcons[item.icon];

            return (
            <div key={item.title} className="text-center p-6 rounded-2xl bg-industrial-foreground/5 backdrop-blur-sm border border-industrial-foreground/10 hover:bg-industrial-foreground/10 transition-all duration-500">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary mb-5 shadow-lg shadow-primary/20">
                <Icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-industrial-foreground mb-2">{item.title}</h3>
              <p className="text-steel text-sm leading-relaxed">{item.description}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
