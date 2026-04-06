import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo.png";

export type ServiceIconKey = "factory" | "building2" | "triangle" | "fuel" | "store" | "wrench";
export type WhyUsIconKey = "users" | "award" | "clock" | "shield" | "mapPin";

export interface ServiceItemContent {
  icon: ServiceIconKey;
  previewTag: string;
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
  keywords: string[];
  image: string;
  imageAlt: string;
}

export interface WhyUsItemContent {
  icon: WhyUsIconKey;
  title: string;
  description: string;
}

export interface SiteContent {
  brand: {
    companyName: string;
    logo: string;
    logoAlt: string;
    phoneDisplay: string;
    phoneLink: string;
    email: string;
    location: string;
    contactPerson: string;
  };
  navigation: {
    home: string;
    services: string;
    gallery: string;
    contact: string;
    quoteButton: string;
  };
  hero: {
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    image: string;
    imageAlt: string;
  };
  home: {
    servicesSection: {
      eyebrow: string;
      titlePrefix: string;
      titleHighlight: string;
      description: string;
      learnMoreText: string;
    };
    whyUsSection: {
      eyebrow: string;
      titlePrefix: string;
      titleHighlight: string;
      items: WhyUsItemContent[];
    };
    ctaSection: {
      title: string;
      description: string;
      buttonText: string;
    };
  };
  servicesPage: {
    eyebrow: string;
    titlePrefix: string;
    titleHighlight: string;
    description: string;
    buttonText: string;
  };
  services: ServiceItemContent[];
  galleryPage: {
    eyebrow: string;
    title: string;
    description: string;
  };
  gallery: Array<{
    src: string;
    alt: string;
    category: string;
  }>;
  contactPage: {
    eyebrow: string;
    title: string;
    description: string;
    infoTitle: string;
    formTitle: string;
    contactPersonLabel: string;
    phoneLabel: string;
    emailLabel: string;
    locationLabel: string;
    mapEmbedUrl: string;
    mapTitle: string;
  };
  forms: {
    quote: {
      title: string;
      description: string;
      nameLabel: string;
      namePlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      projectTypeLabel: string;
      projectTypes: string[];
      areaLabel: string;
      areaPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      buttonText: string;
      buttonLoading: string;
      successTitle: string;
      successDescription: string;
      fallbackDescription: string;
      errorTitle: string;
      errorDescription: string;
    };
    contact: {
      nameLabel: string;
      namePlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      buttonText: string;
      buttonLoading: string;
      successTitle: string;
      successDescription: string;
      fallbackDescription: string;
      errorTitle: string;
      errorDescription: string;
    };
  };
  footer: {
    servicesTitle: string;
    contactsTitle: string;
    description: string;
    rightsSuffix: string;
  };
  notFound: {
    code: string;
    title: string;
    description: string;
    buttonText: string;
  };
  seo: {
    siteUrl: string;
    siteName: string;
    defaultImage: string;
    home: {
      title: string;
      description: string;
      keywords: string;
    };
    services: {
      title: string;
      description: string;
      keywords: string;
    };
    gallery: {
      title: string;
      description: string;
      keywords: string;
    };
    contact: {
      title: string;
      description: string;
      keywords: string;
    };
    notFound: {
      title: string;
      description: string;
      keywords: string;
    };
  };
  mail: {
    web3formsAccessKey: string;
    recipientEmail: string;
    fromName: string;
    quoteSubjectPrefix: string;
    contactSubjectPrefix: string;
  };
  admin: {
    password: string;
    exportRecipientEmail: string;
    exportSenderName: string;
    exportSenderEmail: string;
  };
}

export const defaultSiteContent: SiteContent = {
  brand: {
    companyName: "Формат 4",
    logo,
    logoAlt: "Формат 4 лого",
    phoneDisplay: "+359 89 542 0929",
    phoneLink: "+359895420929",
    email: "format4@abv.bg",
    location: "гр. Кюстендил, България",
    contactPerson: "Михаил Илиев",
  },
  navigation: {
    home: "Начало",
    services: "Услуги",
    gallery: "Галерия",
    contact: "Контакти",
    quoteButton: "Поискайте оферта",
  },
  hero: {
    badge: "Метални конструкции • Халета • Ферми",
    titlePrefix: "Изграждаме бъдещето от",
    titleHighlight: "стомана",
    description:
      "Професионално изграждане на метални халета, конструкции и ферми в цяла България. Качество, надеждност и бързо изпълнение.",
    primaryButton: "Поискайте оферта",
    secondaryButton: "Обадете се",
    image: heroBg,
    imageAlt: "Изграждане на метално хале - индустриална конструкция",
  },
  home: {
    servicesSection: {
      eyebrow: "Какво изработваме",
      titlePrefix: "Нашите",
      titleHighlight: "решения",
      description: "Цялостни решения в областта на металните конструкции - от идея до реализация.",
      learnMoreText: "Научете повече",
    },
    whyUsSection: {
      eyebrow: "Нашите предимства",
      titlePrefix: "Защо да изберете",
      titleHighlight: "нас",
      items: [
        {
          icon: "users",
          title: "Професионален екип",
          description: "Опитни специалисти с дългогодишен стаж в металните конструкции.",
        },
        {
          icon: "award",
          title: "Качествена изработка",
          description: "Използваме висококачествени материали и съвременни технологии.",
        },
        {
          icon: "clock",
          title: "Бързо изпълнение",
          description: "Спазваме сроковете и гарантираме навременно завършване.",
        },
        {
          icon: "shield",
          title: "Гаранция за качество",
          description: "Всички наши проекти са с гаранция за качество и издръжливост.",
        },
        {
          icon: "mapPin",
          title: "Работа в цяла България",
          description: "Изпълняваме проекти на територията на цялата страна.",
        },
      ],
    },
    ctaSection: {
      title: "Готови ли сте да стартирате вашия проект?",
      description: "Свържете се с нас за безплатна консултация и оферта. Нашият екип е на ваше разположение.",
      buttonText: "Поискайте оферта",
    },
  },
  servicesPage: {
    eyebrow: "Какво изработваме",
    titlePrefix: "Нашите",
    titleHighlight: "решения",
    description: "Цялостни решения в областта на металните конструкции - от проектиране до завършен обект.",
    buttonText: "Поискайте оферта",
  },
  services: [
    {
      icon: "factory",
      previewTag: "Индустриално",
      title: "Метални халета",
      shortDescription: "Проектиране и изграждане на индустриални и складови халета.",
      description:
        "Проектиране и изграждане на промишлени и складови метални халета с цялостни решения от проектирането до въвеждането в експлоатация.",
      features: ["Индустриални халета", "Складови халета", "Селскостопански халета", "По индивидуален проект"],
      keywords: ["метални халета", "промишлени халета", "складови халета", "изграждане на халета"],
      image: gallery1,
      imageAlt: "Метално хале - индустриално строителство",
    },
    {
      icon: "building2",
      previewTag: "Стомана",
      title: "Метални конструкции",
      shortDescription: "Стоманени конструкции за промишлени и граждански обекти.",
      description:
        "Изработка и монтаж на стоманени конструкции за промишлени, търговски и граждански обекти с висококачествена стомана.",
      features: ["Носещи конструкции", "Фасадни системи", "Стълбища и площадки", "Модерно оборудване"],
      keywords: ["метални конструкции", "стоманени конструкции", "метални конструкции България"],
      image: gallery2,
      imageAlt: "Монтаж на метални конструкции",
    },
    {
      icon: "triangle",
      previewTag: "Покриви",
      title: "Метални ферми",
      shortDescription: "Покривни и носещи ферми за всякакъв тип сгради.",
      description:
        "Производство и монтаж на покривни и носещи метални ферми за всякакъв тип сгради с оптимални решения за устойчивост.",
      features: ["Покривни ферми", "Носещи ферми", "Решетъчни конструкции", "Големи отвори"],
      keywords: ["метални ферми", "покривни ферми", "носещи ферми"],
      image: gallery5,
      imageAlt: "Метални ферми - покривна конструкция",
    },
    {
      icon: "fuel",
      previewTag: "Търговско",
      title: "Конструкции за бензиностанции",
      shortDescription: "Метални конструкции и навеси за бензиностанции.",
      description:
        "Специализирани метални конструкции и навеси за бензиностанции - устойчиви и естетични решения по всички норми.",
      features: ["Навеси за колонки", "Метални козирки", "Осветителни конструкции", "По стандарт"],
      keywords: ["конструкции бензиностанции", "навеси бензиностанции"],
      image: gallery3,
      imageAlt: "Конструкция за бензиностанция",
    },
    {
      icon: "store",
      previewTag: "Бизнес",
      title: "Търговски обекти",
      shortDescription: "Стоманени конструкции за магазини и търговски центрове.",
      description:
        "Стоманени конструкции за магазини, търговски центрове и офис сгради с бързо изпълнение и високо качество.",
      features: ["Магазини", "Търговски центрове", "Офис сгради", "Бързо изпълнение"],
      keywords: ["търговски обекти", "метални конструкции за магазини"],
      image: gallery6,
      imageAlt: "Търговски обект с метална конструкция",
    },
    {
      icon: "wrench",
      previewTag: "Сервиз",
      title: "Ремонт и отстраняване на аварии",
      shortDescription: "Бързо отстраняване на аварии и ремонт на конструкции.",
      description:
        "Бързо реагиране при аварии и професионален ремонт на метални конструкции от нашия опитен екип.",
      features: ["Аварийни ремонти", "Укрепване", "Диагностика", "24/7 реакция"],
      keywords: ["ремонт метални конструкции", "аварийни ремонти"],
      image: gallery4,
      imageAlt: "Професионално заваряване на метал",
    },
  ],
  galleryPage: {
    eyebrow: "Наши проекти",
    title: "Галерия",
    description: "Разгледайте наши завършени проекти в областта на металните конструкции и индустриалното строителство.",
  },
  gallery: [
    { src: gallery1, alt: "Метално хале - индустриално строителство", category: "Халета" },
    { src: gallery2, alt: "Монтаж на метални конструкции", category: "Конструкции" },
    { src: gallery3, alt: "Конструкция за бензиностанция", category: "Бензиностанции" },
    { src: gallery4, alt: "Професионално заваряване на метал", category: "Заваряване" },
    { src: gallery5, alt: "Метални ферми - покривна конструкция", category: "Ферми" },
    { src: gallery6, alt: "Търговски обект с метална конструкция", category: "Търговски обекти" },
  ],
  contactPage: {
    eyebrow: "Свържете се с нас",
    title: "Контакти",
    description: "Имате въпроси или искате оферта? Свържете се с нас по удобен за вас начин.",
    infoTitle: "Информация за контакт",
    formTitle: "Изпратете съобщение",
    contactPersonLabel: "Лице за контакт",
    phoneLabel: "Телефон",
    emailLabel: "Имейл",
    locationLabel: "Локация",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1500!2d22.59380!3d42.26503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!1s0x0%3A0x0!5e0!3m2!1sbg!2sbg!4v1&ll=42.265028,22.593806&z=16",
    mapTitle: "Местоположение - Кюстендил",
  },
  forms: {
    quote: {
      title: "Поискайте оферта",
      description: "Попълнете формата и ще се свържем с вас.",
      nameLabel: "Вашето име",
      namePlaceholder: "Вашето име *",
      phoneLabel: "Телефон",
      phonePlaceholder: "Телефон *",
      emailLabel: "Имейл",
      emailPlaceholder: "Имейл *",
      projectTypeLabel: "Тип проект",
      projectTypes: [
        "Метално хале",
        "Метална конструкция",
        "Метална ферма",
        "Конструкция за бензиностанция",
        "Търговски обект",
        "Ремонт / Авария",
        "Друго",
      ],
      areaLabel: "Квадратура",
      areaPlaceholder: "Квадратура (кв.м.)",
      messageLabel: "Съобщение",
      messagePlaceholder: "Съобщение",
      buttonText: "Изпрати запитване",
      buttonLoading: "Изпращане...",
      successTitle: "Запитването е изпратено!",
      successDescription: "Ще се свържем с вас възможно най-скоро.",
      fallbackDescription: "Отворихме вашия имейл клиент. Изпратете съобщението, за да завършите запитването.",
      errorTitle: "Проблем при изпращане",
      errorDescription: "Моля, опитайте отново или се свържете с нас по телефон.",
    },
    contact: {
      nameLabel: "Вашето име",
      namePlaceholder: "Вашето име *",
      phoneLabel: "Телефон",
      phonePlaceholder: "Телефон *",
      emailLabel: "Имейл",
      emailPlaceholder: "Имейл *",
      messageLabel: "Вашето съобщение",
      messagePlaceholder: "Вашето съобщение *",
      buttonText: "Изпрати съобщение",
      buttonLoading: "Изпращане...",
      successTitle: "Съобщението е изпратено!",
      successDescription: "Ще се свържем с вас възможно най-скоро.",
      fallbackDescription: "Отворихме вашия имейл клиент. Изпратете съобщението, за да завършите заявката.",
      errorTitle: "Проблем при изпращане",
      errorDescription: "Моля, опитайте отново или се свържете с нас по телефон.",
    },
  },
  footer: {
    servicesTitle: "Услуги",
    contactsTitle: "Контакти",
    description:
      "Изграждане на метални халета, конструкции и ферми. Професионални решения за индустриално строителство в цяла България.",
    rightsSuffix: "Всички права запазени.",
  },
  notFound: {
    code: "404",
    title: "Страницата не е намерена",
    description: "Адресът, който търсите, не съществува или е преместен.",
    buttonText: "Към началото",
  },
  seo: {
    siteUrl: "https://metal-4construction.com",
    siteName: "Формат 4",
    defaultImage: heroBg,
    home: {
      title: "Формат 4 | Метални халета, конструкции и ферми в България",
      description:
        "Формат 4 – професионално изграждане на метални халета, метални конструкции и ферми. Бензиностанции, търговски обекти и ремонт в цяла България.",
      keywords:
        "метални халета, метални конструкции, метални ферми, изграждане на метални халета, стоманени конструкции, индустриално строителство",
    },
    services: {
      title: "Услуги | Формат 4",
      description:
        "Проектиране, изработка и монтаж на метални халета, конструкции, ферми и търговски обекти. Бързо изпълнение и гарантирано качество.",
      keywords: "услуги метални конструкции, проектиране и монтаж, халета, ферми, бензиностанции",
    },
    gallery: {
      title: "Галерия | Формат 4",
      description: "Реални изпълнени проекти на метални конструкции, халета и ферми от екипа на Формат 4.",
      keywords: "галерия метални конструкции, проекти халета, изпълнени обекти",
    },
    contact: {
      title: "Контакти | Формат 4",
      description: "Свържете се с Формат 4 за консултация, оглед и оферта за вашия проект с метална конструкция.",
      keywords: "контакти формат 4, оферта метални халета, метални конструкции кюстендил",
    },
    notFound: {
      title: "Страницата не е намерена | Формат 4",
      description: "Търсената страница не съществува. Върнете се към началото на сайта Формат 4.",
      keywords: "404, страница не е намерена",
    },
  },
  mail: {
    web3formsAccessKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? "",
    recipientEmail: "format4@abv.bg",
    fromName: "Уебсайт Формат 4",
    quoteSubjectPrefix: "Запитване за оферта",
    contactSubjectPrefix: "Съобщение от сайта",
  },
  admin: {
    password: import.meta.env.VITE_ADMIN_PASSWORD ?? "format4-admin",
    exportRecipientEmail: "v.koleshanski@abv.bg",
    exportSenderName: "Формат 4 Админ",
    exportSenderEmail: "format4@abv.bg",
  },
};
