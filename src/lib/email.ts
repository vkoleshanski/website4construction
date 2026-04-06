interface SendLeadEmailParams {
  accessKey: string;
  mailerSendApiToken?: string;
  mailerSendFromEmail?: string;
  mailerSendFromName?: string;
  recipientEmail: string;
  fromName: string;
  subject: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  extraFields?: Record<string, string>;
}

interface SendAdminSnapshotEmailParams {
  accessKey: string;
  mailerSendApiToken?: string;
  mailerSendFromEmail?: string;
  mailerSendFromName?: string;
  recipientEmail: string;
  fromName: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  jsonFileName: string;
  jsonContent: string;
}

export interface SendLeadEmailResult {
  ok: boolean;
  delivery:
    | "api"
    | "mailersend"
    | "formsubmit"
    | "mailto"
    | "download-mailto"
    | "failed";
  message: string;
}

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const MAILERSEND_ENDPOINT = "https://api.mailersend.com/v1/email";
const MAILERSEND_FALLBACK_API_TOKEN = "mlsn.c9778c548236f8a3ac1d989744b8e236bf1bc590707376f55a1c8a0dfd58d140";
const MAILERSEND_FALLBACK_FROM_EMAIL = "MS_2mfFvf@test-68zxl276qy54j905.mlsender.net";
const MAILERSEND_FALLBACK_FROM_NAME = "Формат 4 (SMTP)";
const formSubmitEndpoint = (recipientEmail: string) =>
  `https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`;

const toBase64Utf8 = (value: string) =>
  btoa(unescape(encodeURIComponent(value)));

const resolveMailerSendConfig = (params: {
  mailerSendApiToken?: string;
  mailerSendFromEmail?: string;
  mailerSendFromName?: string;
  fromName: string;
}) => {
  const apiToken = params.mailerSendApiToken?.trim() || MAILERSEND_FALLBACK_API_TOKEN;
  const fromEmail = params.mailerSendFromEmail?.trim() || MAILERSEND_FALLBACK_FROM_EMAIL;

  if (!apiToken || !fromEmail) {
    return null;
  }

  return {
    apiToken,
    fromEmail,
    fromName: params.mailerSendFromName?.trim() || MAILERSEND_FALLBACK_FROM_NAME || params.fromName,
  };
};

const downloadJsonFile = (fileName: string, content: string) => {
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

const openMailTo = (options: {
  recipientEmail: string;
  subject: string;
  body: string;
  downloadFileName?: string;
  downloadContent?: string;
}): SendLeadEmailResult => {
  if (options.downloadFileName && options.downloadContent) {
    downloadJsonFile(options.downloadFileName, options.downloadContent);
  }

  const mailto = `mailto:${encodeURIComponent(options.recipientEmail)}?subject=${encodeURIComponent(
    options.subject,
  )}&body=${encodeURIComponent(options.body)}`;

  const popup = window.open(mailto, "_blank", "noopener,noreferrer");
  if (!popup) {
    window.location.href = mailto;
  }

  return {
    ok: true,
    delivery:
      options.downloadFileName && options.downloadContent ? "download-mailto" : "mailto",
    message: "MAILTO_FALLBACK",
  };
};

const buildLeadBody = (params: SendLeadEmailParams) => {
  const lines = [
    `Име: ${params.name}`,
    `Телефон: ${params.phone}`,
    `Имейл: ${params.email}`,
    ...Object.entries(params.extraFields ?? {}).map(([key, value]) => `${key}: ${value}`),
    "",
    "Съобщение:",
    params.message,
  ];

  return lines.join("\n");
};

const tryMailerSendLead = async (params: SendLeadEmailParams): Promise<SendLeadEmailResult> => {
  const mailerSendConfig = resolveMailerSendConfig(params);
  if (!mailerSendConfig) {
    return {
      ok: false,
      delivery: "failed",
      message: "MAILERSEND_CONFIG_MISSING",
    };
  }

  try {
    const payload = {
      from: {
        email: mailerSendConfig.fromEmail,
        name: mailerSendConfig.fromName,
      },
      to: [{ email: params.recipientEmail }],
      reply_to: {
        email: params.email,
        name: params.name,
      },
      subject: params.subject,
      text: buildLeadBody(params),
    };

    const response = await fetch(MAILERSEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mailerSendConfig.apiToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        ok: false,
        delivery: "failed",
        message: "MAILERSEND_HTTP_ERROR",
      };
    }

    return {
      ok: true,
      delivery: "mailersend",
      message: "SUCCESS",
    };
  } catch {
    return {
      ok: false,
      delivery: "failed",
      message: "MAILERSEND_NETWORK_ERROR",
    };
  }
};

const tryWeb3FormsLead = async (params: SendLeadEmailParams): Promise<SendLeadEmailResult> => {
  if (!params.accessKey.trim()) {
    return {
      ok: false,
      delivery: "failed",
      message: "WEB3FORMS_KEY_MISSING",
    };
  }

  try {
    const payload = {
      access_key: params.accessKey,
      subject: params.subject,
      from_name: params.fromName,
      email: params.email,
      name: params.name,
      phone: params.phone,
      message: params.message,
      replyto: params.email,
      to: params.recipientEmail,
      botcheck: "",
      ...params.extraFields,
    };

    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        ok: false,
        delivery: "failed",
        message: "WEB3FORMS_HTTP_ERROR",
      };
    }

    const result = (await response.json()) as { success?: boolean; message?: string };

    if (result.success) {
      return {
        ok: true,
        delivery: "api",
        message: result.message ?? "SUCCESS",
      };
    }

    return {
      ok: false,
      delivery: "failed",
      message: result.message ?? "WEB3FORMS_FAILED",
    };
  } catch {
    return {
      ok: false,
      delivery: "failed",
      message: "WEB3FORMS_NETWORK_ERROR",
    };
  }
};

const tryFormSubmitLead = async (params: SendLeadEmailParams): Promise<SendLeadEmailResult> => {
  try {
    const payload = {
      name: params.name,
      email: params.email,
      phone: params.phone,
      _subject: params.subject,
      _captcha: "false",
      _template: "table",
      message: buildLeadBody(params),
      ...params.extraFields,
    };

    const response = await fetch(formSubmitEndpoint(params.recipientEmail), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        ok: false,
        delivery: "failed",
        message: "FORMSUBMIT_HTTP_ERROR",
      };
    }

    const result = (await response.json()) as { success?: string; message?: string };

    return {
      ok: true,
      delivery: "formsubmit",
      message: result.message ?? result.success ?? "SUCCESS",
    };
  } catch {
    return {
      ok: false,
      delivery: "failed",
      message: "FORMSUBMIT_NETWORK_ERROR",
    };
  }
};

const tryWeb3FormsSnapshot = async (
  params: SendAdminSnapshotEmailParams,
): Promise<SendLeadEmailResult> => {
  if (!params.accessKey.trim()) {
    return {
      ok: false,
      delivery: "failed",
      message: "WEB3FORMS_KEY_MISSING",
    };
  }

  try {
    const data = new FormData();
    data.append("access_key", params.accessKey);
    data.append("subject", params.subject);
    data.append("from_name", params.fromName);
    data.append("name", params.senderName);
    data.append("email", params.senderEmail);
    data.append("replyto", params.senderEmail);
    data.append("to", params.recipientEmail);
    data.append("message", "Прикачен е JSON файл със съдържанието от админ панела.");
    data.append("botcheck", "");
    data.append(
      "attachment",
      new File([params.jsonContent], params.jsonFileName, { type: "application/json" }),
    );

    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      body: data,
    });

    if (!response.ok) {
      return {
        ok: false,
        delivery: "failed",
        message: "WEB3FORMS_HTTP_ERROR",
      };
    }

    const result = (await response.json()) as { success?: boolean; message?: string };

    if (result.success) {
      return {
        ok: true,
        delivery: "api",
        message: result.message ?? "SUCCESS",
      };
    }

    return {
      ok: false,
      delivery: "failed",
      message: result.message ?? "WEB3FORMS_FAILED",
    };
  } catch {
    return {
      ok: false,
      delivery: "failed",
      message: "WEB3FORMS_NETWORK_ERROR",
    };
  }
};

const tryFormSubmitSnapshot = async (
  params: SendAdminSnapshotEmailParams,
): Promise<SendLeadEmailResult> => {
  try {
    const data = new FormData();
    data.append("name", params.senderName);
    data.append("email", params.senderEmail);
    data.append("_subject", params.subject);
    data.append("_captcha", "false");
    data.append("_template", "table");
    data.append("message", "Прикачен е JSON файл със съдържанието от админ панела.");
    data.append(
      "attachment",
      new File([params.jsonContent], params.jsonFileName, { type: "application/json" }),
    );

    const response = await fetch(formSubmitEndpoint(params.recipientEmail), {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return {
        ok: false,
        delivery: "failed",
        message: "FORMSUBMIT_HTTP_ERROR",
      };
    }

    const result = (await response.json()) as { success?: string; message?: string };

    return {
      ok: true,
      delivery: "formsubmit",
      message: result.message ?? result.success ?? "SUCCESS",
    };
  } catch {
    return {
      ok: false,
      delivery: "failed",
      message: "FORMSUBMIT_NETWORK_ERROR",
    };
  }
};

const tryMailerSendSnapshot = async (
  params: SendAdminSnapshotEmailParams,
): Promise<SendLeadEmailResult> => {
  const mailerSendConfig = resolveMailerSendConfig(params);
  if (!mailerSendConfig) {
    return {
      ok: false,
      delivery: "failed",
      message: "MAILERSEND_CONFIG_MISSING",
    };
  }

  try {
    const payload = {
      from: {
        email: mailerSendConfig.fromEmail,
        name: mailerSendConfig.fromName,
      },
      to: [{ email: params.recipientEmail }],
      reply_to: {
        email: params.senderEmail,
        name: params.senderName,
      },
      subject: params.subject,
      text: "Прикачен е JSON файл със съдържанието от админ панела.",
      attachments: [
        {
          filename: params.jsonFileName,
          content: toBase64Utf8(params.jsonContent),
          disposition: "attachment",
        },
      ],
    };

    const response = await fetch(MAILERSEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mailerSendConfig.apiToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        ok: false,
        delivery: "failed",
        message: "MAILERSEND_HTTP_ERROR",
      };
    }

    return {
      ok: true,
      delivery: "mailersend",
      message: "SUCCESS",
    };
  } catch {
    return {
      ok: false,
      delivery: "failed",
      message: "MAILERSEND_NETWORK_ERROR",
    };
  }
};

export const sendLeadEmail = async (params: SendLeadEmailParams): Promise<SendLeadEmailResult> => {
  const mailerSendResult = await tryMailerSendLead(params);
  if (mailerSendResult.ok) {
    return mailerSendResult;
  }

  const web3formsResult = await tryWeb3FormsLead(params);
  if (web3formsResult.ok) {
    return web3formsResult;
  }

  const formSubmitResult = await tryFormSubmitLead(params);
  if (formSubmitResult.ok) {
    return formSubmitResult;
  }

  return openMailTo({
    recipientEmail: params.recipientEmail,
    subject: params.subject,
    body: buildLeadBody(params),
  });
};

export const sendAdminSnapshotEmail = async (
  params: SendAdminSnapshotEmailParams,
): Promise<SendLeadEmailResult> => {
  const mailerSendResult = await tryMailerSendSnapshot(params);
  if (mailerSendResult.ok) {
    return mailerSendResult;
  }

  const web3formsResult = await tryWeb3FormsSnapshot(params);
  if (web3formsResult.ok) {
    return web3formsResult;
  }

  const formSubmitResult = await tryFormSubmitSnapshot(params);
  if (formSubmitResult.ok) {
    return formSubmitResult;
  }

  return openMailTo({
    recipientEmail: params.recipientEmail,
    subject: params.subject,
    body:
      "Автоматичното изпращане не успя. JSON файлът е свален на устройството. Прикачете го към този имейл и изпратете.",
    downloadFileName: params.jsonFileName,
    downloadContent: params.jsonContent,
  });
};
