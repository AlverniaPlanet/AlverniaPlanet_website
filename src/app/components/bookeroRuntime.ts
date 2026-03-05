"use client";

export type BookeroInstanceConfig = {
  id: string;
  container: string;
  type: string;
  position?: string;
  plugin_css?: boolean;
  lang?: string;
};

const BOOKERO_SCRIPT_ID = "bookero-runtime-script";
const BOOKERO_SCRIPT_SRC = "https://cdn.bookero.pl/plugin/v2/js/bookero-compiled.js";
const BOOKERO_STYLE_ID = "bookero-runtime-style";
const BOOKERO_STYLE_SRC = "https://cdn.bookero.pl/plugin/v2/css/bookero-compiled-v-1-5-2-5.css";

declare global {
  interface Window {
    bookero_config?: BookeroInstanceConfig | BookeroInstanceConfig[];
    __bookeroRuntimeReady?: boolean;
    __bookeroRuntimeLoading?: Promise<void>;
  }
}

function getConfigArray(): BookeroInstanceConfig[] {
  if (typeof window === "undefined") return [];

  if (Array.isArray(window.bookero_config)) {
    return window.bookero_config as BookeroInstanceConfig[];
  }

  if (window.bookero_config && typeof window.bookero_config === "object") {
    const arr = [window.bookero_config as BookeroInstanceConfig];
    window.bookero_config = arr;
    return arr;
  }

  const arr: BookeroInstanceConfig[] = [];
  window.bookero_config = arr;
  return arr;
}

function upsertConfig(config: BookeroInstanceConfig) {
  const arr = getConfigArray();
  const index = arr.findIndex(
    (entry) => entry.container === config.container && entry.type === config.type,
  );
  if (index >= 0) {
    arr[index] = config;
    return;
  }
  arr.push(config);
}

function removeConfig(container: string, type: string) {
  const arr = getConfigArray();
  for (let i = arr.length - 1; i >= 0; i -= 1) {
    if (arr[i]?.container === container && arr[i]?.type === type) {
      arr.splice(i, 1);
    }
  }
}

function ensureContainer(containerId: string) {
  if (!containerId) return;
  if (document.getElementById(containerId)) return;
  const node = document.createElement("div");
  node.id = containerId;
  document.body.appendChild(node);
}

function ensureBookeroStyle() {
  const hasBookeroStyle =
    document.getElementById(BOOKERO_STYLE_ID) ??
    document.querySelector(`link[href="${BOOKERO_STYLE_SRC}"]`);
  if (hasBookeroStyle) return;
  const styleLink = document.createElement("link");
  styleLink.id = BOOKERO_STYLE_ID;
  styleLink.rel = "stylesheet";
  styleLink.type = "text/css";
  styleLink.href = BOOKERO_STYLE_SRC;
  document.head.appendChild(styleLink);
}

async function ensureBookeroScript(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.__bookeroRuntimeReady) return;
  if (window.__bookeroRuntimeLoading) {
    await window.__bookeroRuntimeLoading;
    return;
  }

  window.__bookeroRuntimeLoading = new Promise<void>((resolve, reject) => {
    const existing =
      (document.getElementById(BOOKERO_SCRIPT_ID) as HTMLScriptElement | null) ??
      (document.querySelector(`script[src="${BOOKERO_SCRIPT_SRC}"]`) as HTMLScriptElement | null);
    const onLoad = () => {
      existing?.setAttribute("data-bookero-ready", "1");
      window.__bookeroRuntimeReady = true;
      resolve();
    };
    const onError = () => {
      reject(new Error("Bookero runtime failed to load"));
    };

    if (existing) {
      if (window.__bookeroRuntimeReady || existing.getAttribute("data-bookero-ready") === "1") {
        window.__bookeroRuntimeReady = true;
        resolve();
        return;
      }
      existing.addEventListener("load", onLoad, { once: true });
      existing.addEventListener("error", onError, { once: true });
      if ((existing as HTMLScriptElement & { readyState?: string }).readyState === "complete") {
        onLoad();
      }
      return;
    }

    const script = document.createElement("script");
    script.id = BOOKERO_SCRIPT_ID;
    script.type = "text/javascript";
    script.src = BOOKERO_SCRIPT_SRC;
    script.async = true;
    script.addEventListener(
      "load",
      () => {
        script.setAttribute("data-bookero-ready", "1");
        onLoad();
      },
      { once: true },
    );
    script.addEventListener("error", onError, { once: true });
    document.body.appendChild(script);
  }).finally(() => {
    window.__bookeroRuntimeLoading = undefined;
  });

  await window.__bookeroRuntimeLoading;
}

export async function mountBookeroInstance(
  config: BookeroInstanceConfig,
  withCss = true,
  options?: { persist?: boolean },
) {
  if (typeof window === "undefined") return;

  const persist = options?.persist ?? true;

  if (withCss) {
    ensureBookeroStyle();
  }

  const runtimeReady = !!window.__bookeroRuntimeReady;

  if (runtimeReady) {
    if (config.container) {
      ensureContainer(config.container);
    }
    if (persist) {
      upsertConfig(config);
    }
    document.body.dispatchEvent(new CustomEvent("bookero-plugin:add-instance", { detail: config }));
    if (!persist) {
      removeConfig(config.container, config.type);
    }
    return;
  }

  // During first script boot sticky mode creates its own mount container.
  if (config.container && config.type !== "sticky") {
    ensureContainer(config.container);
  }

  upsertConfig(config);
  await ensureBookeroScript();
  if (!persist) {
    removeConfig(config.container, config.type);
  }
}

export function unmountBookeroInstance(config: Pick<BookeroInstanceConfig, "container" | "type">) {
  if (typeof window === "undefined") return;
  removeConfig(config.container, config.type);
}

export function removeBookeroInstancesByTypes(types: string[]) {
  if (typeof window === "undefined") return;
  const arr = getConfigArray();
  if (!Array.isArray(arr) || arr.length === 0) return;
  const blocked = new Set(types);
  for (let i = arr.length - 1; i >= 0; i -= 1) {
    if (blocked.has(arr[i]?.type ?? "")) {
      arr.splice(i, 1);
    }
  }
}

export function primeBookeroRuntime(withCss = true) {
  if (typeof window === "undefined") return;
  // Keep an array config from the start so runtime can attach add-instance listener.
  getConfigArray();
  if (withCss) {
    ensureBookeroStyle();
  }
  void ensureBookeroScript().catch(() => undefined);
}
