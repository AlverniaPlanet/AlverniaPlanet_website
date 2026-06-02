"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { mountBookeroInstance, unmountBookeroInstance } from "@/app/components/bookeroRuntime";

type Props = {
  pluginId: string;
  containerId?: string;
  type?: "inline" | "sticky" | "weekly" | "calendar" | "standard" | string;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right" | string;
  lang?: string;
  pluginCss?: boolean;
  forceLightText?: boolean;
  className?: string;
  preselectCategory?: string;
  preselectService?: string;
  preselectQuantity?: number;
  autoPickEarliestSlot?: boolean;
};

const PRESELECT_POLL_INTERVAL_MS = 250;
const PRESELECT_MAX_ATTEMPTS = 160;
const PRESELECT_STABLE_ATTEMPTS = 12;
const PRESELECT_MAX_RUNTIME_MS = 20000;
const EMBED_READY_POLL_INTERVAL_MS = 250;
const EMBED_LOADING_SLOW_MS = 4500;
const EMBED_LOADING_ERROR_MS = 14000;

type BookingFieldKind = "category" | "service" | "quantity";

const BOOKING_FIELD_LABEL_PATTERNS: Record<BookingFieldKind, string[]> = {
  category: [
    "wybierz kategorie uslug",
    "choose service category",
    "escolha a categoria",
  ],
  service: [
    "wybierz usluge",
    "choose service",
    "escolha o servico",
  ],
  quantity: [
    "liczba osob",
    "number of people",
    "numero de pessoas",
  ],
};

function normalizeText(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[°º˚]/g, "°")
    .replace(/\*/g, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "l")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const legacyBookingText = (...parts: string[]) => parts.join("");

const LEGACY_BOOKING_TEXT_ALIASES: Array<[string, string]> = [
  [legacyBookingText("promocja: ", "ki", "no", " + ", "sciezka"), "promocja: k360 + sciezka"],
  [legacyBookingText("ki", "no", " sferyczne 3d 360°"), "k360"],
  [legacyBookingText("ki", "no", " sferyczne 360°"), "k360"],
  [legacyBookingText("ki", "no", " 360°"), "k360"],
  [legacyBookingText("spherical 3d 360° ", "ci", "ne", "ma"), "k360"],
  [legacyBookingText("spherical 360° ", "ci", "ne", "ma"), "k360"],
  [legacyBookingText("360° ", "ci", "ne", "ma"), "k360"],
  [legacyBookingText("ci", "ne", "ma", " esferico 3d 360°"), "k360"],
  [legacyBookingText("ci", "ne", "ma", " esferico 360°"), "k360"],
];

// Bookero option labels carry a trailing price, e.g. "(od 79,00 zł)" or
// "(49,00 zł)". Drop it so our category/service strings still match.
function stripBookingPriceSuffix(value: string) {
  return value
    .replace(/\((?:od\s+)?[\d.,\s]+z[łl]\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeComparableBookingText(value: string | null | undefined) {
  const aliased = LEGACY_BOOKING_TEXT_ALIASES.reduce(
    (normalizedValue, [legacyValue, replacement]) => normalizedValue.split(legacyValue).join(replacement),
    normalizeText(value),
  );
  return stripBookingPriceSuffix(aliased);
}

function isVisibleSelect(select: HTMLSelectElement) {
  const style = window.getComputedStyle(select);
  if (style.display === "none" || style.visibility === "hidden") {
    return false;
  }

  const rect = select.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function isVisibleElement(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden") {
    return false;
  }

  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function getMatchingOption(select: HTMLSelectElement, targetText: string) {
  const normalizedTarget = normalizeComparableBookingText(targetText);

  return Array.from(select.options).find((option) => {
    const normalizedOption = normalizeComparableBookingText(option.textContent ?? option.label);
    return normalizedOption === normalizedTarget;
  });
}

function getOrderedSelects(root: ParentNode) {
  const allSelects = Array.from(root.querySelectorAll("select")).filter(
    (select): select is HTMLSelectElement => select instanceof HTMLSelectElement,
  );

  return [
    ...allSelects.filter(
      (select) => !select.disabled && !select.closest(".field.is-inactive") && isVisibleSelect(select),
    ),
    ...allSelects.filter(
      (select) => !select.disabled && !select.closest(".field.is-inactive") && !isVisibleSelect(select),
    ),
    ...allSelects.filter(
      (select) => !select.disabled && !!select.closest(".field.is-inactive") && isVisibleSelect(select),
    ),
    ...allSelects.filter((select) => !select.disabled && !!select.closest(".field.is-inactive")),
    ...allSelects.filter((select) => select.disabled),
  ];
}

function findSelectForOptionText(root: ParentNode, targetText: string) {
  return getOrderedSelects(root).find((select) => getMatchingOption(select, targetText));
}

function getCurrentMultiselectText(multiselect: HTMLElement) {
  return normalizeComparableBookingText(
    multiselect.querySelector<HTMLElement>(".multiselect__single, .multiselect__placeholder")?.textContent ??
      "",
  );
}

function getMatchingMultiselectOption(multiselect: HTMLElement, targetText: string) {
  const normalizedTarget = normalizeComparableBookingText(targetText);

  return Array.from(multiselect.querySelectorAll<HTMLElement>(".multiselect__option")).find((option) => {
    if (option.classList.contains("multiselect__option--disabled")) {
      return false;
    }

    return normalizeComparableBookingText(option.textContent) === normalizedTarget;
  });
}

function getOrderedMultiselects(root: ParentNode) {
  const allMultiselects = Array.from(root.querySelectorAll(".multiselect")).filter(
    (multiselect): multiselect is HTMLElement => multiselect instanceof HTMLElement,
  );

  return [
    ...allMultiselects.filter(
      (multiselect) =>
        !multiselect.closest(".field.is-inactive") &&
        !multiselect.classList.contains("multiselect--disabled") &&
        isVisibleElement(multiselect),
    ),
    ...allMultiselects.filter(
      (multiselect) =>
        !multiselect.closest(".field.is-inactive") &&
        !multiselect.classList.contains("multiselect--disabled") &&
        !isVisibleElement(multiselect),
    ),
  ];
}

function findMultiselectForOptionText(root: ParentNode, targetText: string) {
  const orderedMultiselects = getOrderedMultiselects(root);

  return orderedMultiselects.find((multiselect) => getMatchingMultiselectOption(multiselect, targetText));
}

function getBookingFieldCandidates(root: ParentNode) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(".field, fieldset, .multiselect, select, input, [role='spinbutton'], button"),
  ).filter(
    (element) => element instanceof HTMLElement,
  );
}

function matchesBookingFieldLabel(element: HTMLElement, kind: BookingFieldKind) {
  const textCandidates = [
    element.querySelector("label")?.textContent,
    element.querySelector("legend")?.textContent,
    element.closest(".field")?.querySelector("label")?.textContent,
    element.closest("fieldset")?.querySelector("legend")?.textContent,
    element.getAttribute("aria-label"),
    element.getAttribute("data-label"),
  ];

  const normalizedCandidates = textCandidates.map((value) => normalizeText(value));
  return BOOKING_FIELD_LABEL_PATTERNS[kind].some((pattern) =>
    normalizedCandidates.some((candidate) => candidate.includes(pattern)),
  );
}

function findBookingFieldRoot(root: ParentNode, kind: BookingFieldKind) {
  const candidates = getBookingFieldCandidates(root);
  const orderedCandidates = [
    ...candidates.filter(
      (candidate) =>
        matchesBookingFieldLabel(candidate, kind) &&
        !candidate.closest(".field.is-inactive") &&
        isVisibleElement(candidate),
    ),
    ...candidates.filter(
      (candidate) =>
        matchesBookingFieldLabel(candidate, kind) &&
        !candidate.closest(".field.is-inactive") &&
        !isVisibleElement(candidate),
    ),
    ...candidates.filter((candidate) => matchesBookingFieldLabel(candidate, kind)),
  ];

  const matchedCandidate = orderedCandidates[0];
  if (!matchedCandidate) {
    return null;
  }

  const closestField = matchedCandidate.closest(".field");
  return closestField instanceof HTMLElement ? closestField : matchedCandidate;
}

function applySelectOptionByText(root: ParentNode, targetText: string) {
  const select = findSelectForOptionText(root, targetText);
  if (!select || select.disabled) {
    return false;
  }

  const option = getMatchingOption(select, targetText);
  if (!option) {
    return false;
  }

  const normalizedTarget = normalizeComparableBookingText(option.textContent ?? option.label);
  const normalizedCurrent = normalizeComparableBookingText(select.selectedOptions[0]?.textContent);

  if (normalizedCurrent !== normalizedTarget || select.value !== option.value) {
    select.value = option.value;

    for (const currentOption of Array.from(select.options)) {
      currentOption.selected = currentOption.value === option.value;
    }

    select.dispatchEvent(new Event("input", { bubbles: true }));
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  return normalizeComparableBookingText(select.selectedOptions[0]?.textContent) === normalizedTarget;
}

function isMultiselectOpen(multiselect: HTMLElement) {
  if (multiselect.classList.contains("multiselect--active")) {
    return true;
  }

  const contentWrapper = multiselect.querySelector<HTMLElement>(".multiselect__content-wrapper");
  if (!contentWrapper) {
    return false;
  }

  return isVisibleElement(contentWrapper);
}

function getMatchingOpenMultiselectOption(targetText: string) {
  const normalizedTarget = normalizeText(targetText);

  return Array.from(document.querySelectorAll<HTMLElement>(".multiselect__option")).find((option) => {
    if (!isVisibleElement(option)) {
      return false;
    }

    if (option.classList.contains("multiselect__option--disabled")) {
      return false;
    }

    return normalizeText(option.textContent) === normalizedTarget;
  });
}

function applyMultiselectOptionByText(root: ParentNode, targetText: string) {
  const multiselect = findMultiselectForOptionText(root, targetText);
  if (!multiselect) {
    return false;
  }

  const normalizedTarget = normalizeText(targetText);
  if (getCurrentMultiselectText(multiselect) === normalizedTarget) {
    return true;
  }

  if (!isMultiselectOpen(multiselect)) {
    const toggle =
      multiselect.querySelector<HTMLElement>(".multiselect__select") ??
      multiselect.querySelector<HTMLElement>(".multiselect__tags") ??
      multiselect;

    toggle.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    toggle.click();
    return false;
  }

  const option = getMatchingMultiselectOption(multiselect, targetText) ?? getMatchingOpenMultiselectOption(targetText);
  if (!option) {
    return false;
  }

  option.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  option.click();

  return getCurrentMultiselectText(multiselect) === normalizedTarget;
}

function applyBookingFieldValue(root: ParentNode, targetText: string, kind?: BookingFieldKind) {
  const fieldRoot = kind ? findBookingFieldRoot(root, kind) : null;
  const searchRoot = fieldRoot ?? root;

  return applySelectOptionByText(searchRoot, targetText) || applyMultiselectOptionByText(searchRoot, targetText);
}

function getOrderedQuantityInputs(root: ParentNode) {
  const allInputs = Array.from(root.querySelectorAll("input")).filter(
    (input): input is HTMLInputElement => input instanceof HTMLInputElement,
  );

  const isCandidate = (input: HTMLInputElement) =>
    !input.disabled &&
    !input.closest(".field.is-inactive") &&
    (input.type === "number" ||
      input.inputMode === "numeric" ||
      input.inputMode === "decimal" ||
      /\d/.test(input.value) ||
      input.getAttribute("role") === "spinbutton");

  return [
    ...allInputs.filter((input) => isCandidate(input) && isVisibleElement(input)),
    ...allInputs.filter((input) => isCandidate(input) && !isVisibleElement(input)),
  ];
}

function getOrderedQuantityValueElements(root: ParentNode) {
  const allElements = Array.from(
    root.querySelectorAll<HTMLElement>("[role='spinbutton'], [aria-valuenow], span, div, p, strong"),
  ).filter((element) => element instanceof HTMLElement);

  const isCandidate = (element: HTMLElement) => {
    const ariaValue = element.getAttribute("aria-valuenow");
    const text = (element.textContent ?? "").trim();
    return !!ariaValue || /^\d+$/.test(text);
  };

  return [
    ...allElements.filter(
      (element) => isCandidate(element) && !element.closest(".field.is-inactive") && isVisibleElement(element),
    ),
    ...allElements.filter((element) => isCandidate(element) && !element.closest(".field.is-inactive")),
  ];
}

function parseNumericValue(value: string | null | undefined) {
  const digits = (value ?? "").replace(/[^\d-]/g, "");
  if (!digits) {
    return null;
  }

  const parsed = Number.parseInt(digits, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function findQuantityInput(fieldRoot: HTMLElement) {
  return getOrderedQuantityInputs(fieldRoot.shadowRoot ?? fieldRoot)[0];
}

function findVisibleQuantityInput(fieldRoot: HTMLElement) {
  return getOrderedQuantityInputs(fieldRoot.shadowRoot ?? fieldRoot).find((input) => isVisibleElement(input));
}

function findHiddenQuantityInput(fieldRoot: HTMLElement) {
  return getOrderedQuantityInputs(fieldRoot.shadowRoot ?? fieldRoot).find((input) => !isVisibleElement(input));
}

function findQuantityValueElement(fieldRoot: HTMLElement) {
  return getOrderedQuantityValueElements(fieldRoot.shadowRoot ?? fieldRoot).find((element) => {
    if (element instanceof HTMLInputElement) {
      return false;
    }

    const text = (element.textContent ?? "").trim();
    const ariaValue = element.getAttribute("aria-valuenow");
    return /^\d+$/.test(text) || /^\d+$/.test(ariaValue ?? "");
  });
}

function getNativeInputValueSetter() {
  return Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
}

function dispatchInputEvents(element: HTMLElement) {
  element.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  element.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  element.dispatchEvent(new Event("blur", { bubbles: true, composed: true }));
}

function getStepperButtons(fieldRoot: HTMLElement) {
  const buttons = Array.from((fieldRoot.shadowRoot ?? fieldRoot).querySelectorAll("button")).filter(
    (button): button is HTMLButtonElement => button instanceof HTMLButtonElement && !button.disabled,
  );

  const matchButton = (patterns: string[], fallbackText: string) =>
    buttons.find((button) => {
      const text = normalizeText(button.textContent);
      const label = normalizeText(button.getAttribute("aria-label"));
      return text === fallbackText || patterns.some((pattern) => label.includes(pattern));
    });

  return {
    decrement: matchButton(["minus", "decrease", "decrement", "less", "mniej"], "-"),
    increment: matchButton(["plus", "increase", "increment", "more", "wiecej"], "+"),
  };
}

function readQuantityValue(fieldRoot: HTMLElement) {
  const visibleInput = findVisibleQuantityInput(fieldRoot);
  if (visibleInput) {
    return parseNumericValue(visibleInput.value);
  }

  const valueElement = findQuantityValueElement(fieldRoot);
  if (valueElement) {
    return parseNumericValue(valueElement.getAttribute("aria-valuenow") ?? valueElement.textContent);
  }

  const hiddenInput = findHiddenQuantityInput(fieldRoot);
  if (hiddenInput) {
    return parseNumericValue(hiddenInput.value);
  }

  return null;
}

function applyQuantityValue(root: ParentNode, targetValue: number) {
  const fieldRoot = findBookingFieldRoot(root, "quantity");
  if (!fieldRoot) {
    return false;
  }

  const input = findVisibleQuantityInput(fieldRoot);
  if (input) {
    const setValue = getNativeInputValueSetter();
    const nextValue = String(targetValue);
    const currentValue = parseNumericValue(input.value);

    if (currentValue !== targetValue) {
      input.focus();
      if (setValue) {
        setValue.call(input, nextValue);
      } else {
        input.value = nextValue;
      }
      input.setAttribute("value", nextValue);
      dispatchInputEvents(input);
    }

    return parseNumericValue(input.value) === targetValue;
  }

  const { increment, decrement } = getStepperButtons(fieldRoot);
  const currentValue = readQuantityValue(fieldRoot);

  if (currentValue !== null && (increment || decrement)) {
    const button = targetValue > currentValue ? increment : decrement;
    if (!button) {
      return currentValue === targetValue;
    }

    const maxSteps = Math.min(Math.abs(targetValue - currentValue), 60);
    let latestValue: number | null = currentValue;

    for (let step = 0; step < maxSteps && latestValue !== targetValue; step += 1) {
      button.click();
      latestValue = readQuantityValue(fieldRoot);
    }

    return latestValue === targetValue;
  }

  const hiddenInput = findHiddenQuantityInput(fieldRoot) ?? findQuantityInput(fieldRoot);
  if (!hiddenInput) {
    return false;
  }

  const setValue = getNativeInputValueSetter();
  const nextValue = String(targetValue);
  const currentValueFromHidden = parseNumericValue(hiddenInput.value);

  if (currentValueFromHidden !== targetValue) {
    if (setValue) {
      setValue.call(hiddenInput, nextValue);
    } else {
      hiddenInput.value = nextValue;
    }
    hiddenInput.setAttribute("value", nextValue);
    dispatchInputEvents(hiddenInput);
  }

  return parseNumericValue(hiddenInput.value) === targetValue;
}

const CALENDAR_DAY_DISABLED_CLASSES = [
  "is-disabled",
  "is-past",
  "is-unavailable",
  "is-blocked",
  "is-empty",
  "is-inactive",
  "is-off",
  "no-availability",
];

const HOUR_DISABLED_CLASSES = [
  "is-disabled",
  "is-past",
  "is-unavailable",
  "is-blocked",
  "is-empty",
  "is-inactive",
  "no-availability",
];

function isCalendarDayBookable(cell: HTMLElement) {
  if (cell.hasAttribute("disabled") || cell.getAttribute("aria-disabled") === "true") {
    return false;
  }
  if (CALENDAR_DAY_DISABLED_CLASSES.some((cls) => cell.classList.contains(cls))) {
    return false;
  }
  if (!isVisibleElement(cell)) {
    return false;
  }
  const text = (cell.textContent ?? "").trim();
  if (!/\d/.test(text)) {
    return false;
  }
  return true;
}

function isHourSlotBookable(cell: HTMLElement) {
  if (cell.hasAttribute("disabled") || cell.getAttribute("aria-disabled") === "true") {
    return false;
  }
  if (HOUR_DISABLED_CLASSES.some((cls) => cell.classList.contains(cls))) {
    return false;
  }
  return isVisibleElement(cell);
}

function isCalendarDaySelected(cell: HTMLElement) {
  return cell.classList.contains("is-selected") || cell.classList.contains("is-sub-selected");
}

function isHourSlotSelected(cell: HTMLElement) {
  return cell.classList.contains("is-selected") || cell.classList.contains("is-sub-selected");
}

function pickEarliestCalendarDay(root: ParentNode): "selected" | "clicked" | "none" {
  const dayCells = Array.from(root.querySelectorAll<HTMLElement>(".calendar-days-list-cell"));
  if (dayCells.length === 0) {
    return "none";
  }

  if (dayCells.some(isCalendarDaySelected)) {
    return "selected";
  }

  const today = new Date();
  const todayDay = today.getDate();
  const candidates = dayCells.filter(isCalendarDayBookable);
  if (candidates.length === 0) {
    return "none";
  }

  const todayCandidate = candidates.find((cell) => {
    const text = (cell.textContent ?? "").trim();
    const dayNum = Number.parseInt(text, 10);
    return Number.isFinite(dayNum) && dayNum === todayDay;
  });

  const target = todayCandidate ?? candidates[0];
  target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  target.click();
  return "clicked";
}

function pickEarliestHourSlot(root: ParentNode): "selected" | "clicked" | "none" {
  const hourCells = Array.from(root.querySelectorAll<HTMLElement>(".week-days-hour"));
  if (hourCells.length === 0) {
    return "none";
  }

  if (hourCells.some(isHourSlotSelected)) {
    return "selected";
  }

  const target = hourCells.find(isHourSlotBookable);
  if (!target) {
    return "none";
  }

  target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  target.click();
  return "clicked";
}

function findElementsByText(root: ParentNode, selector: string, text: string) {
  const normalizedText = normalizeText(text);
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) =>
    normalizeText(element.textContent).includes(normalizedText),
  );
}

function findPaymentLink(root: ParentNode) {
  const targetText = normalizeText("zapłać teraz");

  const clickableElements = Array.from(
    root.querySelectorAll<HTMLElement>(
      "a[href], button, [role='button'], input[type='submit'], input[type='button']",
    ),
  ).filter((element): element is HTMLElement => element instanceof HTMLElement);

  return clickableElements.find((element) => {
    const content = normalizeText(element.textContent);
    const href = element instanceof HTMLAnchorElement ? element.href.toLowerCase() : "";
    return (
      content.includes(targetText) ||
      content.includes("zaplac teraz") ||
      content.includes("platnosci") ||
      content.includes("platnosc") ||
      content.includes("p24") ||
      /platnosci|platnosc|p24|payment|pay/.test(href)
    );
  });
}

function adjustActionButtons(root: ParentNode) {
  const actionElements = Array.from(root.querySelectorAll<HTMLElement>("button, a, [role='button']")).filter(
    (element) => {
      const text = normalizeText(element.textContent);
      return text.includes("zapłać") || text.includes("zaplac") || text.includes("wróc") || text.includes("wroc");
    },
  );

  if (actionElements.length > 1) {
    const parent = actionElements[0]?.parentElement;
    if (parent) {
      parent.style.display = "flex";
      parent.style.gap = "1rem";
      parent.style.flexWrap = "wrap";
      parent.style.alignItems = "center";
    }
  }

  const paymentLink = findPaymentLink(root);

  if (!paymentLink) {
    return;
  }

  const payButton = actionElements.find((element) => normalizeText(element.textContent).includes("zapłać") || normalizeText(element.textContent).includes("zaplac"));
  if (!payButton || payButton === paymentLink) {
    return;
  }

  if ((payButton as HTMLElement).dataset.bookeroPayFixed === "true") {
    return;
  }

  payButton.style.cursor = "pointer";
  payButton.style.flex = "0 0 auto";
  payButton.dataset.bookeroPayFixed = "true";
  payButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (paymentLink instanceof HTMLAnchorElement && paymentLink.href) {
      window.location.assign(paymentLink.href);
      return;
    }

    paymentLink.click();
  });
}

function getBookeroSearchRoot(container: HTMLDivElement | null, type: string) {
  const modeSelector = type ? `#bookero-plugin[data-mode="${type}"]` : "#bookero-plugin";
  const pluginRoot =
    document.querySelector<HTMLElement>(`#bookero-form ${modeSelector}`) ??
    document.querySelector<HTMLElement>(modeSelector);

  if (pluginRoot) {
    return pluginRoot;
  }

  return container ?? document;
}

function hasRenderedBookeroContent(container: HTMLDivElement | null, type: string) {
  const root = getBookeroSearchRoot(container, type);
  if (!(root instanceof HTMLElement || root instanceof HTMLDivElement || root instanceof Document)) {
    return false;
  }

  const contentMarkers = [
    ".bookero-plugin-form",
    ".bookero-plugin-form-wrapper",
    ".services-section",
    ".submit-section",
    ".calendar-days-list-cell",
    ".week-days-hour",
    ".multiselect",
    ".field",
    "form",
    "input",
    "select",
    "textarea",
  ];

  const hasMarker = contentMarkers.some((selector) => {
    if (root instanceof Document) {
      return !!root.querySelector(selector);
    }

    return !!root.querySelector(selector);
  });

  if (hasMarker) {
    return true;
  }

  if (root instanceof Document) {
    return false;
  }

  return root.childElementCount > 0 && (root.textContent ?? "").trim().length > 40;
}

function getBookeroStatusCopy(lang: string, status: "loading" | "slow" | "error") {
  const locale = lang === "en" ? "en" : lang === "pt" ? "pt" : "pl";

  const copy = {
    pl: {
      loading: {
        title: "Ładowanie rezerwacji...",
        description: "Pobieramy kalendarz i dostępne terminy.",
      },
      slow: {
        title: "Jeszcze ładujemy...",
        description: "To może potrwać chwilę przy wolniejszym połączeniu.",
      },
      error: {
        title: "Ładowanie trwa dłużej niż zwykle",
        description: "Jeśli formularz się nie pojawi, odśwież stronę i spróbuj ponownie.",
      },
    },
    en: {
      loading: {
        title: "Loading booking...",
        description: "Fetching the calendar and available slots.",
      },
      slow: {
        title: "Still loading...",
        description: "This can take a moment on a slower connection.",
      },
      error: {
        title: "Loading is taking longer than usual",
        description: "If the form does not appear, refresh the page and try again.",
      },
    },
    pt: {
      loading: {
        title: "A carregar reserva...",
        description: "Estamos a obter o calendário e os horários disponíveis.",
      },
      slow: {
        title: "Ainda a carregar...",
        description: "Isto pode demorar um pouco numa ligação mais lenta.",
      },
      error: {
        title: "O carregamento está a demorar mais do que o normal",
        description: "Se o formulário não aparecer, atualiza a página e tenta novamente.",
      },
    },
  } as const;

  return copy[locale][status];
}

export default function BookeroEmbed({
  pluginId,
  containerId = "bookero",
  type = "inline",
  position,
  lang = "pl",
  pluginCss = true,
  forceLightText = false,
  className,
  preselectCategory,
  preselectService,
  preselectQuantity,
  autoPickEarliestSlot = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [embedStatus, setEmbedStatus] = useState<"loading" | "slow" | "error" | "ready">("loading");

  const cleanupStaleInlineMounts = () => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    // Remove any old duplicated #bookero nodes left after route transitions.
    document.querySelectorAll<HTMLElement>(`#${containerId}`).forEach((node) => {
      if (node !== currentContainer) {
        node.remove();
      }
    });

    // Remove leaked inline plugin roots mounted outside the booking section.
    const leakedSelectors = [
      '#bookero-plugin:not([data-mode="sticky"])',
      '#bookero-plugin[data-mode="standard"]',
      '#bookero-plugin[data-mode="inline"]',
      '#bookero-plugin[data-mode="calendar"]',
      '#bookero-plugin[data-mode="weekly"]',
    ];

    leakedSelectors.forEach((selector) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((node) => {
        if (!currentContainer.contains(node) && !node.closest(`#${containerId}`)) {
          node.remove();
        }
      });
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    setEmbedStatus("loading");

    const syncReadyState = () => {
      if (cancelled) {
        return;
      }

      if (hasRenderedBookeroContent(containerRef.current, type)) {
        setEmbedStatus("ready");
        return true;
      }

      return false;
    };

    const loadingSlowTimeout = window.setTimeout(() => {
      setEmbedStatus((current) => (current === "loading" ? "slow" : current));
    }, EMBED_LOADING_SLOW_MS);
    const loadingErrorTimeout = window.setTimeout(() => {
      setEmbedStatus((current) => (current === "ready" ? current : "error"));
    }, EMBED_LOADING_ERROR_MS);
    const readinessInterval = window.setInterval(() => {
      syncReadyState();
    }, EMBED_READY_POLL_INTERVAL_MS);
    const observer = new MutationObserver(() => {
      if (syncReadyState()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Mount (or re-mount) the Bookero instance into a fresh, single mount point.
    // The Bookero compiled script can intermittently boot before the DOM is
    // settled and abort its own init; re-dispatching the instance recovers it.
    const attemptMount = () => {
      if (cancelled) {
        return;
      }

      cleanupStaleInlineMounts();
      if (containerRef.current && !hasRenderedBookeroContent(containerRef.current, type)) {
        containerRef.current.innerHTML = "";
      }

      void mountBookeroInstance(
        {
          id: pluginId,
          container: containerId,
          type,
          position: position ?? "",
          plugin_css: pluginCss,
          lang,
        },
        pluginCss,
        { persist: type === "sticky" },
      )
        .then(() => {
          syncReadyState();
        })
        .catch(() => {
          if (!cancelled) {
            setEmbedStatus("error");
          }
        });
    };

    attemptMount();

    // Safety retries: if the form has not rendered yet, dispatch the instance
    // again. Each retry is a no-op once the form is on screen.
    const retryDelays = [5000, 9500];
    const retryTimeouts = retryDelays.map((delay) =>
      window.setTimeout(() => {
        if (!cancelled && !syncReadyState()) {
          attemptMount();
        }
      }, delay),
    );

    return () => {
      cancelled = true;
      window.clearTimeout(loadingSlowTimeout);
      window.clearTimeout(loadingErrorTimeout);
      window.clearInterval(readinessInterval);
      retryTimeouts.forEach((id) => window.clearTimeout(id));
      observer.disconnect();
      unmountBookeroInstance({ container: containerId, type });
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      cleanupStaleInlineMounts();
    };
  }, [pluginId, containerId, type, position, lang, pluginCss]);

  useEffect(() => {
    if (!forceLightText) return;
    if (typeof window === "undefined") return;
    const root = containerRef.current;
    if (!root) return;

    const applyReadabilityOverrides = () => {
      const setColor = (el: HTMLElement, color: string) => {
        el.style.setProperty("color", color, "important");
        el.style.setProperty("-webkit-text-fill-color", color, "important");
        el.style.setProperty("opacity", "1", "important");
      };

      root.querySelectorAll<HTMLElement>(
        ".bookero-plugin-form-heading, .bookero-plugin-form .field label, .bookero-plugin-form .field-note, .bookero-plugin-form .field .note, .bookero-plugin-form-wrapper p, .bookero-plugin-form-wrapper span, .bookero-plugin-form-wrapper small, .bookero-plugin-form-wrapper legend, .bookero-plugin-form-wrapper li, .bookero-plugin-form-wrapper dt, .bookero-plugin-form-wrapper dd, .bookero-plugin-form-wrapper a, .bookero-plugin-form-wrapper strong, .bookero-plugin-form-wrapper em, .bookero-plugin-form-wrapper b, .calendar-nav-month, .calendar-days-heading-cell, .week-days-heading-day, .week-days-heading-date, .week-days-hour-info, .switcher-label"
      ).forEach((el) => setColor(el, "rgba(255, 255, 255, 0.96)"));

      root.querySelectorAll<HTMLElement>(
        ".bookero-plugin-header, .bookero-plugin-header *, .bookero-sticky-plugin-toggle, .add-to-cart-section .add-button, .bookero-plugin-error-btn, .calendar-days-list-cell.is-selected, .calendar-days-list-cell.is-sub-selected, .week-days-hour.is-selected, .week-days-hour.is-sub-selected"
      ).forEach((el) => setColor(el, "#ffffff"));

      root.querySelectorAll<HTMLElement>(
        "input, select, textarea, option, .multiselect, .multiselect *, .multiselect__single, .multiselect__single *, .multiselect__input, .multiselect__input *, .multiselect__option, .multiselect__option *, .multiselect__placeholder, .multiselect__placeholder *, .vti__input, .vti__input *, .vti__dropdown-item, .vti__dropdown-item *, .vti__dropdown-list, .vti__dropdown-list *"
      ).forEach((el) => setColor(el, "#0f172a"));

      // Calendar day tiles and time-slot pills have light backgrounds, so their
      // text must be dark. Selected tiles (handled above) stay white.
      root.querySelectorAll<HTMLElement>(
        ".calendar-days-list-cell:not(.is-selected):not(.is-sub-selected), .calendar-days-list-cell:not(.is-selected):not(.is-sub-selected) *, .week-days-hour:not(.is-selected):not(.is-sub-selected), .week-days-hour:not(.is-selected):not(.is-sub-selected) *"
      ).forEach((el) => setColor(el, "#0f172a"));

      root.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        "input, select, textarea, .multiselect__single, .multiselect__input"
      ).forEach((el) => {
        el.style.setProperty("color", "#0f172a", "important");
        el.style.setProperty("-webkit-text-fill-color", "#0f172a", "important");
        el.style.setProperty("background-color", "rgba(255, 255, 255, 0.98)", "important");
        el.style.setProperty("border-color", "rgba(255, 255, 255, 0.35)", "important");
        el.style.setProperty("opacity", "1", "important");
      });

      // Dark panel controls that should keep light text (people counters + additional info fields).
      root.querySelectorAll<HTMLElement>(
        ".people-section #bookero-plugin-people-number, .people-section #bookero-plugin-children-number, .people-section .people-number-minus, .people-section .people-number-plus, .people-section .children-number-minus, .people-section .children-number-plus, .days-section #bookero-plugin-days-number, .days-section .days-number-minus, .days-section .days-number-plus, .params-section .field input, .params-section .field textarea"
      ).forEach((el) => {
        setColor(el, "rgba(248, 250, 252, 0.96)");
        if (el.matches("input, textarea")) {
          el.style.setProperty("background-color", "transparent", "important");
          el.style.setProperty("border-color", "rgba(248, 250, 252, 0.72)", "important");
        }
      });

      // Price area on the dark panel.
      root.querySelectorAll<HTMLElement>(
        ".temporary-price-section .temporary-price-quote, .temporary-price-section .temporary-price-method, .temporary-price-section .temporary-price-price, .temporary-price-section .temporary-price-payment-method, .payment-summary-section .payment-summary-quote, .payment-summary-section .payment-summary-price, .inquiry-price, .product-price"
      ).forEach((el) => setColor(el, "rgba(248, 250, 252, 0.96)"));

      root.querySelectorAll<HTMLElement>(
        ".bookero-plugin-form-heading.is-inactive, .services-section .field.is-inactive, .params-section:not(.is-active), .add-to-cart-section:not(.is-active), .submit-section:not(.is-active)"
      ).forEach((el) => {
        el.style.setProperty("opacity", "0.8", "important");
      });
    };

    applyReadabilityOverrides();

    const observer = new MutationObserver(() => {
      applyReadabilityOverrides();
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, [forceLightText, containerId, type, lang]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (embedStatus !== "ready") return;

    const root = getBookeroSearchRoot(containerRef.current, type);
    if (!(root instanceof HTMLElement || root instanceof HTMLDivElement)) return;

    const applyEmbedFixes = () => {
      adjustActionButtons(root);

      root.querySelectorAll("iframe").forEach((iframe) => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            adjustActionButtons(iframeDoc);
          }
        } catch {
          // Ignore cross-origin frames.
        }
      });
    };

    const observer = new MutationObserver(() => {
      applyEmbedFixes();
    });

    applyEmbedFixes();
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [containerId, type, embedStatus]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const quantityTarget =
      typeof preselectQuantity === "number" && Number.isFinite(preselectQuantity) ? preselectQuantity : null;
    const hasQuantityTarget = quantityTarget !== null;
    if (!preselectCategory && !preselectService && !hasQuantityTarget) return;
    if (type === "sticky") return;

    let attempts = 0;
    let stableAttempts = 0;
    const startedAt = Date.now();

    const syncSelection = () => {
      const root = getBookeroSearchRoot(containerRef.current, type);
      if (!root) {
        attempts += 1;
        if (attempts >= PRESELECT_MAX_ATTEMPTS) {
          window.clearInterval(intervalId);
        }
        return;
      }

      const categoryReady = preselectCategory ? applyBookingFieldValue(root, preselectCategory, "category") : true;
      const quantityReady = categoryReady && hasQuantityTarget ? applyQuantityValue(root, quantityTarget) : true;
      const serviceReady =
        categoryReady && quantityReady && preselectService
          ? applyBookingFieldValue(root, preselectService, "service")
          : !preselectService;
      const quantityConfirmed =
        categoryReady && serviceReady && hasQuantityTarget ? applyQuantityValue(root, quantityTarget) : true;

      attempts += 1;
      const selectionReady = categoryReady && quantityReady && serviceReady && quantityConfirmed;
      stableAttempts = selectionReady ? stableAttempts + 1 : 0;

      if (
        stableAttempts >= PRESELECT_STABLE_ATTEMPTS ||
        attempts >= PRESELECT_MAX_ATTEMPTS ||
        Date.now() - startedAt >= PRESELECT_MAX_RUNTIME_MS
      ) {
        window.clearInterval(intervalId);
        observer.disconnect();
      }
    };

    const intervalId = window.setInterval(syncSelection, PRESELECT_POLL_INTERVAL_MS);
    const observer = new MutationObserver(() => {
      stableAttempts = 0;
      syncSelection();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    syncSelection();

    return () => {
      window.clearInterval(intervalId);
      observer.disconnect();
    };
  }, [preselectCategory, preselectQuantity, preselectService, type]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!autoPickEarliestSlot) return;
    if (type === "sticky") return;

    let dayClicked = false;
    let hourClicked = false;
    let attempts = 0;
    let stableAttempts = 0;
    const startedAt = Date.now();

    const trySync = () => {
      const root = getBookeroSearchRoot(containerRef.current, type);
      if (!(root instanceof HTMLElement || root instanceof HTMLDivElement || root instanceof Document)) {
        return false;
      }

      attempts += 1;

      const dayResult = pickEarliestCalendarDay(root);
      if (dayResult === "clicked") {
        dayClicked = true;
        stableAttempts = 0;
        return false;
      }
      if (dayResult === "none" && !dayClicked) {
        return false;
      }

      const hourResult = pickEarliestHourSlot(root);
      if (hourResult === "clicked") {
        hourClicked = true;
        stableAttempts = 0;
        return false;
      }
      if (hourResult === "none") {
        return false;
      }

      if (hourResult === "selected") {
        stableAttempts += 1;
      }

      return hourClicked && stableAttempts >= 4;
    };

    const intervalId = window.setInterval(() => {
      const done = trySync();
      if (
        done ||
        attempts >= PRESELECT_MAX_ATTEMPTS ||
        Date.now() - startedAt >= PRESELECT_MAX_RUNTIME_MS
      ) {
        window.clearInterval(intervalId);
        observer.disconnect();
      }
    }, PRESELECT_POLL_INTERVAL_MS);

    const observer = new MutationObserver(() => {
      trySync();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    trySync();

    return () => {
      window.clearInterval(intervalId);
      observer.disconnect();
    };
  }, [autoPickEarliestSlot, preselectCategory, preselectService, type]);

  const isLoading = embedStatus !== "ready";
  const statusCopy = getBookeroStatusCopy(lang, embedStatus === "ready" ? "loading" : embedStatus);

  return (
    <div className="relative overflow-hidden" aria-busy={isLoading}>
      <div
        ref={containerRef}
        id={containerId}
        className={className ?? "w-full min-h-[640px] rounded-2xl bg-white/5 ring-1 ring-white/10"}
      />

      {isLoading ? (
        <div
          className={clsx(
            "pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300",
            embedStatus === "error" ? "bg-white/92" : "bg-white/84 backdrop-blur-[2px]",
          )}
          aria-live="polite"
        >
          <div className="flex max-w-sm flex-col items-center gap-4 px-6 text-center text-slate-900">
            <div
              className={clsx(
                "h-3 w-3 rounded-full bg-slate-900/75",
                embedStatus === "error" ? "opacity-70" : "animate-pulse",
              )}
            />
            <div className="space-y-1.5">
              <p className="text-base font-semibold tracking-[0.18em] uppercase text-slate-900/92">
                {statusCopy.title}
              </p>
              <p className="text-sm leading-relaxed text-slate-700">{statusCopy.description}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
