"use client";

export async function waitForImagesReady(sources: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  const uniqueSources = [...new Set(sources.filter(Boolean))];

  await Promise.all(
    uniqueSources.map(
      (source) =>
        new Promise<void>((resolve) => {
          const image = new window.Image();
          let settled = false;

          const finish = () => {
            if (settled) {
              return;
            }

            settled = true;
            image.onload = null;
            image.onerror = null;
            resolve();
          };

          image.decoding = "async";
          image.loading = "eager";
          image.onload = finish;
          image.onerror = finish;
          image.src = source;

          if (image.complete && image.naturalWidth > 0) {
            finish();
            return;
          }

          if (typeof image.decode === "function") {
            image.decode().then(finish).catch(() => undefined);
          }
        }),
    ),
  );
}
