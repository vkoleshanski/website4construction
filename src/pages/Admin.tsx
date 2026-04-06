import { useMemo, useRef, useState } from "react";
import { Eye, EyeOff, LogOut, Save, Upload, Download, RotateCcw, Plus, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/use-site-content";
import { defaultSiteContent, type SiteContent } from "@/content/defaultContent";
import SeoHead from "@/components/SeoHead";
import { sendAdminSnapshotEmail } from "@/lib/email";

const ADMIN_SESSION_KEY = "format4-admin-session";

type PathToken = string | number;

const deepClone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const mergeWithDefaults = <T,>(defaults: T, override: unknown): T => {
  if (Array.isArray(defaults)) {
    return (Array.isArray(override) ? override : defaults) as T;
  }

  if (isObject(defaults)) {
    if (!isObject(override)) return defaults;

    const next = { ...defaults } as Record<string, unknown>;
    for (const key of Object.keys(defaults)) {
      next[key] = mergeWithDefaults(
        (defaults as Record<string, unknown>)[key],
        (override as Record<string, unknown>)[key],
      );
    }
    return next as T;
  }

  return (override ?? defaults) as T;
};

const toReadableLabel = (value: string): string =>
  value
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (first) => first.toUpperCase());

const isImagePath = (path: PathToken[]) => {
  const last = String(path[path.length - 1] ?? "").toLowerCase();
  return ["image", "logo", "src", "url"].some((token) => last.includes(token));
};

const readByToken = (container: unknown, token: PathToken): unknown => {
  if (Array.isArray(container) && typeof token === "number") {
    return container[token];
  }

  if (isObject(container) && typeof token === "string") {
    return container[token];
  }

  return undefined;
};

const writeByToken = (container: unknown, token: PathToken, value: unknown): boolean => {
  if (Array.isArray(container) && typeof token === "number") {
    container[token] = value;
    return true;
  }

  if (isObject(container) && typeof token === "string") {
    container[token] = value;
    return true;
  }

  return false;
};

const setValueAtPath = (root: unknown, path: PathToken[], nextValue: unknown): unknown => {
  const copy = deepClone(root);

  let current: unknown = copy;
  for (let i = 0; i < path.length - 1; i += 1) {
    current = readByToken(current, path[i]);
  }

  writeByToken(current, path[path.length - 1], nextValue);
  return copy;
};

const removeFromArrayAtPath = (root: unknown, path: PathToken[], index: number): unknown => {
  const copy = deepClone(root);
  let current: unknown = copy;

  for (let i = 0; i < path.length; i += 1) {
    current = readByToken(current, path[i]);
  }

  if (Array.isArray(current)) {
    current.splice(index, 1);
  }

  return copy;
};

const appendToArrayAtPath = (root: unknown, path: PathToken[], value: unknown): unknown => {
  const copy = deepClone(root);
  let current: unknown = copy;

  for (let i = 0; i < path.length; i += 1) {
    current = readByToken(current, path[i]);
  }

  if (Array.isArray(current)) {
    current.push(value);
  }

  return copy;
};

const renderPath = (path: PathToken[]) =>
  path
    .map((item) => (typeof item === "number" ? `[${item + 1}]` : toReadableLabel(item)))
    .join(" / ");

const Admin = () => {
  const { content, saveContent, resetContent, exportContent, importContent } = useSiteContent();
  const { toast } = useToast();

  const [draft, setDraft] = useState<SiteContent>(() => deepClone(content));
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sendingToEmail, setSendingToEmail] = useState(false);
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === "true",
  );

  const importRef = useRef<HTMLInputElement>(null);

  const adminPassword = useMemo(
    () => import.meta.env.VITE_ADMIN_PASSWORD ?? content.admin.password,
    [content.admin.password],
  );

  const onValueChange = (path: PathToken[], value: unknown) => {
    setDraft((prev) => setValueAtPath(prev, path, value) as SiteContent);
  };

  const onImageUpload = async (path: PathToken[], file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onValueChange(path, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveContent(draft);
    toast({
      title: "Промените са записани",
      description: "Съдържанието е обновено и запазено в браузъра.",
    });
  };

  const handleReset = () => {
    resetContent();
    setDraft(deepClone(defaultSiteContent));
    toast({
      title: "Съдържанието е възстановено",
      description: "Върнахме фабричните стойности.",
    });
  };

  const handleExport = () => {
    const blob = new Blob([exportContent()], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-content.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEmailExport = async () => {
    const recipient = draft.admin.exportRecipientEmail?.trim();
    if (!recipient) {
      toast({
        title: "Липсва имейл получател",
        description: "Попълнете admin.exportRecipientEmail, за да изпратите JSON файла.",
        variant: "destructive",
      });
      return;
    }

    const jsonContent = JSON.stringify(draft, null, 2);
    const now = new Date();
    const fileName = `site-content-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate(),
    ).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}.json`;

    setSendingToEmail(true);

    const result = await sendAdminSnapshotEmail({
      accessKey: draft.mail.web3formsAccessKey,
      recipientEmail: recipient,
      fromName: draft.mail.fromName,
      senderName: draft.admin.exportSenderName || "Формат 4 Админ",
      senderEmail: draft.admin.exportSenderEmail || draft.brand.email,
      subject: `Админ export - ${draft.brand.companyName}`,
      jsonFileName: fileName,
      jsonContent,
    });

    setSendingToEmail(false);

    if (!result.ok) {
      toast({
        title: "Грешка при изпращане",
        description: "Не успяхме да изпратим JSON файла. Проверете имейл настройките.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Файлът е изпратен",
      description:
        result.delivery === "download-mailto"
          ? "Свалихме JSON файла и отворихме имейл клиент за ръчно изпращане."
          : `JSON е изпратен към ${recipient}.`,
    });
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;

    const raw = await file.text();
    const result = importContent(raw);

    if (result.ok) {
      const parsed = JSON.parse(raw) as SiteContent;
      setDraft(deepClone(mergeWithDefaults(defaultSiteContent, parsed)));
    }

    toast({
      title: result.ok ? "Импортът е успешен" : "Импортът е неуспешен",
      description: result.message,
      variant: result.ok ? "default" : "destructive",
    });
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    if (password.trim() === adminPassword) {
      setAuthenticated(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      setPassword("");
      return;
    }

    toast({
      title: "Невалидна парола",
      description: "Проверете паролата за админ панела и опитайте отново.",
      variant: "destructive",
    });
  };

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  };

  const renderEditor = (value: unknown, path: PathToken[] = []): React.ReactNode => {
    if (typeof value === "string") {
      const key = path.join(".");
      const imageField = isImagePath(path);
      const longText = value.length > 120 || value.includes("\n");

      return (
        <div key={key} className="rounded-2xl border border-border/70 bg-card p-4 space-y-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{renderPath(path)}</p>

          {longText ? (
            <Textarea
              value={value}
              onChange={(event) => onValueChange(path, event.target.value)}
              className="min-h-24"
            />
          ) : (
            <Input value={value} onChange={(event) => onValueChange(path, event.target.value)} />
          )}

          {imageField && (
            <div className="space-y-3">
              {value ? (
                <img
                  src={value}
                  alt={String(path[path.length - 1])}
                  className="w-full max-w-md rounded-xl border border-border object-cover"
                />
              ) : null}
              <label className="inline-flex items-center gap-2 text-sm text-primary cursor-pointer">
                <Upload className="h-4 w-4" />
                Качи изображение
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => onImageUpload(path, event.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          )}
        </div>
      );
    }

    if (Array.isArray(value)) {
      const key = path.join(".") || "root-array";
      const isStringArray = value.every((entry) => typeof entry === "string");

      return (
        <div key={key} className="rounded-2xl border border-border/70 bg-card p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{renderPath(path)}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const template = isStringArray ? "" : deepClone(value[0] ?? {});
                setDraft((prev) => appendToArrayAtPath(prev, path, template) as SiteContent);
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Добави
            </Button>
          </div>

          <div className="space-y-4">
            {value.map((entry, index) => (
              <div key={`${key}-${index}`} className="rounded-xl border border-border/70 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">Елемент {index + 1}</p>
                  {value.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDraft((prev) => removeFromArrayAtPath(prev, path, index) as SiteContent)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  ) : null}
                </div>
                {renderEditor(entry, [...path, index])}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (typeof value === "object" && value !== null) {
      const key = path.join(".") || "root-object";
      const entries = Object.entries(value as Record<string, unknown>);

      return (
        <section key={key} className="space-y-4">
          {path.length ? (
            <h2 className="text-xl font-semibold text-foreground border-b border-border/70 pb-2">
              {renderPath(path)}
            </h2>
          ) : null}
          <div className="space-y-4">
            {entries.map(([entryKey, entryValue]) => renderEditor(entryValue, [...path, entryKey]))}
          </div>
        </section>
      );
    }

    return null;
  };

  if (!authenticated) {
    return (
      <div className="pt-24 pb-16 px-4 md:px-8 min-h-screen bg-background">
        <SeoHead
          title={`Админ панел | ${content.brand.companyName}`}
          description="Административен панел за редакция на съдържание на сайта."
          keywords="админ панел, редакция съдържание"
          path="/admin"
          image={content.seo.defaultImage}
          noIndex
        />
        <div className="max-w-md mx-auto rounded-3xl border border-border bg-card p-6 md:p-8 shadow-xl">
          <h1 className="text-2xl font-bold mb-3">Админ панел</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Влезте с админ паролата, за да редактирате текстовете и снимките на сайта.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium">Парола</span>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <Button type="submit" className="w-full gradient-primary border-0 rounded-full">
              Вход
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 bg-background min-h-screen">
      <SeoHead
        title={`Админ панел | ${content.brand.companyName}`}
        description="Административен панел за редакция на съдържание на сайта."
        keywords="админ панел, редакция съдържание"
        path="/admin"
        image={content.seo.defaultImage}
        noIndex
      />

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="rounded-3xl border border-border bg-card p-5 md:p-7 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Админ панел</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                Редактирате всички текстове и изображения на сайта. Промените се пазят в браузъра.
                Може да изпратите JSON файла директно по имейл или да го експортирате за commit към репото.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={handleSave} className="rounded-full gradient-primary border-0">
                <Save className="h-4 w-4 mr-2" /> Запази
              </Button>
              <Button type="button" variant="outline" onClick={handleExport} className="rounded-full">
                <Download className="h-4 w-4 mr-2" /> Експорт JSON
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleEmailExport}
                className="rounded-full"
                disabled={sendingToEmail}
              >
                <Mail className="h-4 w-4 mr-2" />
                {sendingToEmail ? "Изпращане..." : "Изпрати JSON по имейл"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => importRef.current?.click()}
                className="rounded-full"
              >
                <Upload className="h-4 w-4 mr-2" /> Импорт JSON
              </Button>
              <Button type="button" variant="outline" onClick={handleReset} className="rounded-full">
                <RotateCcw className="h-4 w-4 mr-2" /> Нулирай
              </Button>
              <Button type="button" variant="ghost" onClick={handleLogout} className="rounded-full">
                <LogOut className="h-4 w-4 mr-2" /> Изход
              </Button>
            </div>
          </div>

          <input
            ref={importRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => handleImport(event.target.files?.[0] ?? null)}
          />
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 md:p-6">
          {renderEditor(draft)}
        </div>
      </div>
    </div>
  );
};

export default Admin;
