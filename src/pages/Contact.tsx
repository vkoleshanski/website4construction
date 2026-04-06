import { useState } from "react";
import { Phone, Mail, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/use-site-content";
import { sendLeadEmail } from "@/lib/email";
import SeoHead from "@/components/SeoHead";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    content: { brand, contactPage, forms, mail, seo },
  } = useSiteContent();

  const contactForm = forms.contact;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (String(formData.get("website") ?? "").trim()) {
      return;
    }

    const data = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    setLoading(true);

    const result = await sendLeadEmail({
      accessKey: mail.web3formsAccessKey,
      recipientEmail: mail.recipientEmail,
      fromName: mail.fromName,
      subject: `${mail.contactSubjectPrefix} - ${data.name}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      message: data.message,
    });

    setLoading(false);

    if (!result.ok) {
      toast({
        title: contactForm.errorTitle,
        description: contactForm.errorDescription,
        variant: "destructive",
      });
      return;
    }

    e.currentTarget.reset();

    toast({
      title: contactForm.successTitle,
      description:
        result.delivery === "api" ? contactForm.successDescription : contactForm.fallbackDescription,
    });
  };

  return (
    <div className="pt-20">
      <SeoHead
        title={seo.contact.title}
        description={seo.contact.description}
        keywords={seo.contact.keywords}
        path="/contact"
        image={seo.defaultImage}
      />

      <section className="section-padding gradient-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="container-custom text-center relative z-10">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">{contactPage.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-industrial-foreground mb-4">{contactPage.title}</h1>
          <p className="text-steel text-lg max-w-2xl mx-auto">
            {contactPage.description}
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">{contactPage.infoTitle}</h2>
              
              <div className="space-y-4 mb-10">
                {[
                  { icon: User, label: contactPage.contactPersonLabel, value: brand.contactPerson },
                  { icon: Phone, label: contactPage.phoneLabel, value: brand.phoneDisplay, href: `tel:${brand.phoneLink}` },
                  { icon: Mail, label: contactPage.emailLabel, value: brand.email, href: `mailto:${brand.email}` },
                  { icon: MapPin, label: contactPage.locationLabel, value: brand.location },
                ].map((item) => (
                  <div key={item.label} className="magnetic-card p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20">
                      <item.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-medium text-foreground hover:text-primary transition-colors">{item.value}</a>
                      ) : (
                        <p className="font-medium text-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl overflow-hidden shadow-lg h-64 md:h-80">
                <iframe
                  src={contactPage.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={contactPage.mapTitle}
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">{contactPage.formTitle}</h2>
              <form onSubmit={handleSubmit} className="space-y-4 magnetic-card p-6 md:p-8">
                <input type="text" name="website" autoComplete="off" className="hidden" tabIndex={-1} aria-hidden="true" />

                <label className="sr-only" htmlFor="contact-name">{contactForm.nameLabel}</label>
                <Input id="contact-name" name="name" placeholder={contactForm.namePlaceholder} required maxLength={100} className="rounded-xl h-12" />

                <label className="sr-only" htmlFor="contact-phone">{contactForm.phoneLabel}</label>
                <Input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  placeholder={contactForm.phonePlaceholder}
                  required
                  maxLength={20}
                  className="rounded-xl h-12"
                  pattern="^\+?[0-9\s-]{8,20}$"
                  title="Въведете валиден телефонен номер"
                />

                <label className="sr-only" htmlFor="contact-email">{contactForm.emailLabel}</label>
                <Input id="contact-email" name="email" type="email" placeholder={contactForm.emailPlaceholder} required maxLength={255} className="rounded-xl h-12" />

                <label className="sr-only" htmlFor="contact-message">{contactForm.messageLabel}</label>
                <Textarea id="contact-message" name="message" placeholder={contactForm.messagePlaceholder} required rows={6} maxLength={1000} className="rounded-xl" />

                <Button type="submit" disabled={loading} className="w-full rounded-full gradient-primary border-0 shadow-lg shadow-primary/20 hover:opacity-90 hover:scale-[1.02] transition-all duration-300 h-12">
                  {loading ? contactForm.buttonLoading : contactForm.buttonText}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
