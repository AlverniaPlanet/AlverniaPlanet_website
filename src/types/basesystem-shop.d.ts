import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "basesystem-shop": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        token?: string;
        endpoint?: string;
      };
    }
  }
}

export {};
