import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSiteContent } from "@/hooks/use-site-content";
import SeoHead from "@/components/SeoHead";

const NotFound = () => {
  const location = useLocation();
  const {
    content: { notFound, seo },
  } = useSiteContent();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <SeoHead
        title={seo.notFound.title}
        description={seo.notFound.description}
        keywords={seo.notFound.keywords}
        path={location.pathname}
        image={seo.defaultImage}
        noIndex
      />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{notFound.code}</h1>
        <p className="mb-2 text-xl font-semibold">{notFound.title}</p>
        <p className="mb-4 text-muted-foreground">{notFound.description}</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          {notFound.buttonText}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
