import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useSiteContent } from "@/hooks/use-site-content";

const Footer = () => {
  const {
    content: { brand, footer, services },
  } = useSiteContent();

  return (
    <footer className="gradient-dark text-industrial-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={brand.logo} alt={brand.logoAlt} className="h-14 w-auto brightness-0 invert" />
            </div>
            <p className="text-steel text-sm leading-relaxed">
              {footer.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-industrial-foreground">{footer.servicesTitle}</h3>
            <ul className="space-y-2.5 text-sm text-steel">
              {services.map((service) => (
                <li key={service.title}>
                  <Link to="/services" className="hover:text-primary transition-colors">{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-industrial-foreground">{footer.contactsTitle}</h3>
            <ul className="space-y-3 text-sm text-steel">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                  <Phone className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <a href={`tel:${brand.phoneLink}`} className="hover:text-primary transition-colors">{brand.phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                  <Mail className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <a href={`mailto:${brand.email}`} className="hover:text-primary transition-colors">{brand.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span>{brand.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-steel/20 mt-10 pt-6 text-center text-sm text-steel/60">
          © {new Date().getFullYear()} {brand.companyName}. {footer.rightsSuffix}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
