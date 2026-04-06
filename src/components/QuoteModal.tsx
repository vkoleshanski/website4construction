import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/use-site-content";
import { sendLeadEmail } from "@/lib/email";

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
}

const QuoteModal = ({ open, onClose }: QuoteModalProps) => {
  const { toast } = useToast();

  const {
    content: { forms, mail },
  } = useSiteContent();

  const quoteForm = forms.quote;
  const [loading, setLoading] = useState(false);
  const [projectType, setProjectType] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectType) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    if (String(formData.get("website") ?? "").trim()) {
      setLoading(false);
      return;
    }

    const data = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      area: String(formData.get("area") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const result = await sendLeadEmail({
      accessKey: mail.web3formsAccessKey,
      recipientEmail: mail.recipientEmail,
      fromName: mail.fromName,
      subject: `${mail.quoteSubjectPrefix} - ${projectType}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      message: data.message,
      extraFields: {
        "Тип проект": projectType,
        "Квадратура": data.area,
      },
    });

    if (!result.ok) {
      toast({
        title: quoteForm.errorTitle,
        description: quoteForm.errorDescription,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setLoading(false);
    setProjectType("");
    e.currentTarget.reset();

    toast({
      title: quoteForm.successTitle,
      description:
        result.delivery === "api" ? quoteForm.successDescription : quoteForm.fallbackDescription,
    });
    onClose();
  };

  const handleClose = () => {
    setProjectType("");
    setLoading(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative glass rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-fade-up bg-card">
        <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all" aria-label="Затвори формата за оферта">
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-2xl font-bold text-foreground mb-1">{quoteForm.title}</h2>
        <p className="text-muted-foreground text-sm mb-6">{quoteForm.description}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="website" autoComplete="off" className="hidden" tabIndex={-1} aria-hidden="true" />

          <label className="sr-only" htmlFor="quote-name">{quoteForm.nameLabel}</label>
          <Input id="quote-name" name="name" placeholder={quoteForm.namePlaceholder} required maxLength={100} className="rounded-xl h-12" />

          <label className="sr-only" htmlFor="quote-phone">{quoteForm.phoneLabel}</label>
          <Input
            id="quote-phone"
            name="phone"
            type="tel"
            placeholder={quoteForm.phonePlaceholder}
            required
            maxLength={20}
            className="rounded-xl h-12"
            pattern="^\+?[0-9\s-]{8,20}$"
            title="Въведете валиден телефонен номер"
          />

          <label className="sr-only" htmlFor="quote-email">{quoteForm.emailLabel}</label>
          <Input id="quote-email" name="email" type="email" placeholder={quoteForm.emailPlaceholder} required maxLength={255} className="rounded-xl h-12" />

          <div>
            <p className="text-sm text-muted-foreground mb-2">{quoteForm.projectTypeLabel} *</p>
            <div className="flex flex-wrap gap-2">
              {quoteForm.projectTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setProjectType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                    projectType === type
                      ? "gradient-primary text-primary-foreground border-transparent shadow-md shadow-primary/20"
                      : "bg-muted text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <label className="sr-only" htmlFor="quote-area">{quoteForm.areaLabel}</label>
          <Input id="quote-area" name="area" placeholder={quoteForm.areaPlaceholder} maxLength={20} className="rounded-xl h-12" />

          <label className="sr-only" htmlFor="quote-message">{quoteForm.messageLabel}</label>
          <Textarea id="quote-message" name="message" placeholder={quoteForm.messagePlaceholder} rows={4} maxLength={1000} className="rounded-xl" />

          <Button type="submit" className="w-full rounded-full gradient-primary border-0 shadow-lg shadow-primary/20 hover:opacity-90 hover:scale-[1.02] transition-all duration-300 h-12" disabled={loading || !projectType}>
            {loading ? quoteForm.buttonLoading : quoteForm.buttonText}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default QuoteModal;
