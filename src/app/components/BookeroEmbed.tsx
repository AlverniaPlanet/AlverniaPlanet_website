"use client";

import { useEffect, useRef } from "react";
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
};

export default function BookeroEmbed({
  pluginId,
  containerId = "bookero",
  type = "inline",
  position,
  lang = "pl",
  pluginCss = true,
  forceLightText = false,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

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
        if (!node.closest("#bookero-form")) {
          node.remove();
        }
      });
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ensure a single valid mount point before each Bookero init.
    if (containerRef.current) {
      containerRef.current.id = containerId;
    }
    cleanupStaleInlineMounts();
    if (containerRef.current) {
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
    );

    return () => {
      unmountBookeroInstance({ container: containerId, type });
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      cleanupStaleInlineMounts();
    };
  }, [pluginId, containerId, type, position, lang, pluginCss]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (type === "sticky") return;
    if (!containerRef.current) return;

    const observer = new MutationObserver(() => {
      cleanupStaleInlineMounts();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [containerId, type]);

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

  return (
    <div
      ref={containerRef}
      id={containerId}
      className={className ?? "w-full min-h-[640px] rounded-2xl bg-white/5 ring-1 ring-white/10"}
    />
  );
}
