import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSiteContent } from "@/hooks/use-site-content";
import SeoHead from "@/components/SeoHead";

const Gallery = () => {
  const {
    content: { galleryPage, gallery, seo },
  } = useSiteContent();

  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(null);
      }

      if (event.key === "ArrowRight") {
        setLightbox((current) => {
          if (current === null) return current;
          return (current + 1) % gallery.length;
        });
      }

      if (event.key === "ArrowLeft") {
        setLightbox((current) => {
          if (current === null) return current;
          return current === 0 ? gallery.length - 1 : current - 1;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [gallery.length, lightbox]);

  const showPrevious = () => {
    setLightbox((current) => {
      if (current === null) return current;
      return current === 0 ? gallery.length - 1 : current - 1;
    });
  };

  const showNext = () => {
    setLightbox((current) => {
      if (current === null) return current;
      return (current + 1) % gallery.length;
    });
  };

  return (
    <div className="pt-20">
      <SeoHead
        title={seo.gallery.title}
        description={seo.gallery.description}
        keywords={seo.gallery.keywords}
        path="/gallery"
        image={seo.defaultImage}
      />

      <section className="section-padding gradient-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="container-custom text-center relative z-10">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">{galleryPage.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-industrial-foreground mb-4">{galleryPage.title}</h1>
          <p className="text-steel text-lg max-w-2xl mx-auto">
            {galleryPage.description}
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gallery.map((img, i) => (
              <button
                key={`${img.src}-${i}`}
                onClick={() => setLightbox(i)}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                aria-label={`Отвори изображение: ${img.alt}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-industrial/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                  <div className="p-5">
                    <span className="text-xs gradient-primary text-primary-foreground px-3 py-1 rounded-full">{img.category}</span>
                    <p className="text-industrial-foreground text-sm mt-2 font-medium">{img.alt}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/90 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/20 backdrop-blur-md flex items-center justify-center text-card hover:bg-card/30 transition-all" aria-label="Затвори галерията">
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-4 md:left-8 w-10 h-10 rounded-full bg-card/20 backdrop-blur-md flex items-center justify-center text-card hover:bg-card/30 transition-all"
            aria-label="Предишно изображение"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-4 md:right-8 w-10 h-10 rounded-full bg-card/20 backdrop-blur-md flex items-center justify-center text-card hover:bg-card/30 transition-all"
            aria-label="Следващо изображение"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <img
            src={gallery[lightbox].src}
            alt={gallery[lightbox].alt}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
