# Формат 4 - Нов сайт (React + Vite)

Този проект е новата версия на сайта и е подготвен да замени стария `website4construction-main`.

## Основни подобрения

- Централизиран content модел за всички текстове и изображения.
- Админ панел на `/admin` за редакция на всяко поле (текст/снимка), import/export JSON и изпращане на JSON по имейл.
- Формите за контакт и оферта изпращат реално имейли през Web3Forms API.
- SEO подобрения: динамични meta/OG/canonical, JSON-LD, sitemap, robots, OG image.
- Подобрена достъпност и мобилна употреба (labels, touch targets, lightbox клавиатура).
- Премахната визуална нумерация `01-02-03-...` от секцията с услуги.

## Инсталация и старт

```bash
npm install
npm run dev
```

## Админ панел

- URL: `/admin`
- Парола по подразбиране: `format4-admin`
- Може да се override-не с env променлива:

```bash
VITE_ADMIN_PASSWORD=your-password
```

### Как работи редакцията

- Всички промени се запазват в `localStorage` на текущия браузър.
- За прехвърляне между машини/браузъри: използвайте `Експорт JSON` и после `Импорт JSON`.
- В админ панела има бутон `Изпрати JSON по имейл`.
- Получател по подразбиране: `v.koleshanski@abv.bg` (поле `admin.exportRecipientEmail`).

## Имейли (контакт и оферта)

Формите ползват Web3Forms. Нужен е access key:

```bash
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_key
```

Ако ключът липсва или API е недостъпно, има автоматичен fallback към `mailto:`.

### Безплатни услуги за изпращане

- Вградена поддръжка: Web3Forms (free tier) + FormSubmit (free tier).
- Ако Web3Forms не е настроен, системата опитва през FormSubmit.
- Ако и двете не отговорят, отваря `mailto` fallback.

## GitHub Pages деплой

Проектът е готов за GitHub Pages и custom domain.

### 1) Настрой base path при repo deployment

Ако сайтът е на поддиректория (`https://user.github.io/repo-name/`), build-вайте с:

```bash
VITE_PUBLIC_BASE_PATH=/repo-name/ npm run build
```

Ако е custom domain на root (`https://metal-4construction.com/`), ползвайте:

```bash
npm run build
```

### 2) Build

```bash
npm run build
```

### 3) Публикуване

- в `Settings -> Pages` избери `Source: GitHub Actions`.
- push към `main` ще стартира workflow файла `.github/workflows/deploy-pages.yml`.
- workflow-ът билдва и публикува `dist` автоматично.

## SEO файлове

- `index.html` - базови meta + LocalBusiness schema
- `public/robots.txt`
- `public/sitemap.xml`
- `public/og-image.jpg`
- `public/404.html` + `src/main.tsx` - fallback за SPA routing в GitHub Pages

## Полезни команди

```bash
npm run lint
npm run test
npm run build
```
