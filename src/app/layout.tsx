import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import AppBar from "@/app/appbar";
import Footer from "@/app/components/Footer";
import FloatingDemoPromo from "@/app/components/FloatingDemoPromo";
import SummerPromoBumper from "@/app/components/SummerPromoBumper";
import ConsentTrackers from "@/app/components/ConsentTrackers";
import CookieConsent from "@/app/components/CookieConsent";
// Import z modułu bez "use client" — inaczej w statycznym HTML zamiast liczby
// ląduje proxy klienckie i warunek zgody jest zawsze fałszywy.
import { CONSENT_VERSION } from "@/lib/consentVersion";
import { I18nProvider } from "./i18n-provider";
import SygnalHydracji from "./components/SygnalHydracji";

const AnalyticsTracker = dynamic(
  () => import("./components/AnalyticsTracker").then((mod) => mod.AnalyticsTracker),
);
const MetaPixelPageViewTracker = dynamic(
  () =>
    import("./components/MetaPixelPageViewTracker").then(
      (mod) => mod.MetaPixelPageViewTracker,
    ),
);
const GaPageViewTracker = dynamic(
  () =>
    import("./components/GaPageViewTracker").then((mod) => mod.GaPageViewTracker),
);
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-ap-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alverniaplanet.com";
const orgSameAs = [
  "https://www.facebook.com/alverniaplanet/",
  "https://www.instagram.com/alverniaplanet/",
  "https://www.tiktok.com/@alverniaplanetedu",
];
const brandLogoPath = "/wspolne/logotypy/logo-alvernia-planet-negatyw.png";
const brandLogoUrl = `${siteUrl}${brandLogoPath}`;
const schemaGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: "Alvernia Planet",
      url: siteUrl,
      logo: brandLogoUrl,
      sameAs: orgSameAs,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      name: "Alvernia Planet",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}#organization` },
    },
    {
      // NAP spójne z Footer.tsx — bez współrzędnych/godzin, których nie ma w źródle.
      "@type": ["TouristAttraction", "MovieTheater", "LocalBusiness"],
      "@id": `${siteUrl}#place`,
      name: "Alvernia Planet",
      url: siteUrl,
      image: brandLogoUrl,
      logo: brandLogoUrl,
      telephone: "+48 510 831 277",
      priceRange: "49-79 PLN",
      address: {
        "@type": "PostalAddress",
        streetAddress: "ul. Ferdynanda Wspaniałego 1",
        postalCode: "32-566",
        addressLocality: "Nieporaz",
        addressCountry: "PL",
      },
      sameAs: orgSameAs,
      parentOrganization: { "@id": `${siteUrl}#organization` },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Alvernia Planet: Film World - Poznaj świat filmu!",
  description:
    "Największe kino 360° w Europie (kopuła 48 m), Projekt MARS i FILMWORLD pod Krakowem. Cztery filmy fulldome, warsztaty i eventy dla całej rodziny. Rezerwuj bilety online.",
  icons: {
    icon: [
      { url: "/wspolne/favicony/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/wspolne/favicony/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/wspolne/favicony/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/wspolne/favicony/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Alvernia Planet: Film World - Poznaj świat filmu!",
    description:
      "Największe kino 360° w Europie (kopuła 48 m), Projekt MARS i FILMWORLD pod Krakowem. Cztery filmy fulldome, warsztaty i eventy dla całej rodziny. Rezerwuj bilety online.",
    url: siteUrl,
    siteName: "Alvernia Planet",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/wspolne/logotypy/logo-alvernia-planet-negatyw.png",
        width: 1920,
        height: 1080,
        type: "image/png",
        alt: "Alvernia Planet logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alvernia Planet: Film World - Poznaj świat filmu!",
    description:
      "Największe kino 360° w Europie (kopuła 48 m), Projekt MARS i FILMWORLD pod Krakowem. Cztery filmy fulldome, warsztaty i eventy dla całej rodziny. Rezerwuj bilety online.",
    images: ["/wspolne/logotypy/logo-alvernia-planet-negatyw.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLocale: "pl" | "en" | "pt" = "pl";
  const gaMeasurementId = "G-WGCVPPB9KW";
  const gtmId = "GTM-TM3MNLWS";
  const metaPixelId = "1952585985650150";

  return (
    <html
      lang={initialLocale}
      suppressHydrationWarning
      className={`${poppins.variable} theme-dark`}
    >
      <head>
        {/* ------------------------------------------------------------------
            Placeholder pod zdjęciami — wyłączanie animacji po wczytaniu.

            Poświata pod fotografiami (globals.css, „Placeholder pod zdjęciami")
            ma pokazywać, że zdjęcie się ładuje. Animowana jest background-position,
            której żadna przeglądarka nie liczy na kompozytorze — dopóki trwa,
            KAŻDE pasujące zdjęcie (także poza ekranem) jest przemalowywane
            i rasteryzowane w każdej klatce. Zmierzone na /wydarzenia (telefon
            390×844, CPU 6×, jeden gest): 2406 ms malowania i 1138 ms rasteryzacji,
            38% klatek hero bez aktualizacji i 17,5 porzuconej klatki karuzeli.
            Po zatrzymaniu animacji: 4 ms / 4 ms, 2% i 5,5.

            Poświata chodzi tylko pod zdjęciem, które JESZCZE się ładuje i jest
            blisko ekranu (300 px zapasu). Zdjęcia daleko poza kadrem nie mają
            czego sygnalizować, a Chromium i tak je przemalowuje — zmierzone:
            po samym zatrzymaniu animacji po wczytaniu zostawało 8 animowanych
            zdjęć poza ekranem.

            Nasłuch wisi na KAŻDYM zdjęciu z osobna, a nie na oknie w fazie
            przechwytywania: przy tym drugim WebKit zgłaszał tylko część zdarzeń
            (zmierzone: 1 z 8 wczytanych zdjęć oznaczone). Zdjęcia wczytane
            wcześniej wyłapuje `complete`, a nowe (zmiana kopuły, przejście
            między podstronami) — obserwator mutacji spięty z rAF, więc przegląd
            listy zdarza się najwyżej raz na klatkę.
            -------------------------------------------------------------------- */}
        <script
          id="ap-img-loaded"
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  var SEL = 'img.object-cover[src*="/galeria/"],img.object-cover[src*="/atrakcje/kino-360/Seanse/"],img.object-cover[src*="/wydarzenia/"]';

  /* --- Bufor zapisów do DOM-u ---------------------------------------------
     Ten skrypt oznacza atrybutami węzły, które renderuje React. Robione od
     razu, psuło uwadnianie: React zastawał w HTML-u atrybuty, których sam nie
     wystawił, i porzucał całe poddrzewo („A tree hydrated but some attributes
     ... didn't match"). Dlatego przed uwodnieniem zapisy trafiają do kolejki,
     a wypisujemy je dopiero po zdarzeniu ap:hydrated (patrz
     components/SygnalHydracji.tsx). Nasłuchy i obserwatory działają od razu —
     zmiana dotyczy wyłącznie momentu DOTKNIĘCIA drzewa. */
  var poHydracji = false;
  var kolejka = [];
  /* Sekcje już podpięte pod obserwatora wejścia. */
  var widziane = typeof WeakSet === 'function' ? new WeakSet() : { has: function(){ return false; }, add: function(){} };
  function wykonaj(z){
    if (z.t === 'attr') z.el.setAttribute(z.n, '');
    else if (z.t === 'attr-') z.el.removeAttribute(z.n);
    else if (z.t === 'class') z.el.classList.add(z.n);
  }
  function zapisz(el, typ, nazwa){
    var z = { el: el, t: typ, n: nazwa };
    if (poHydracji) wykonaj(z); else kolejka.push(z);
  }
  function oproznij(){
    if (poHydracji) return;
    poHydracji = true;
    for (var i = 0; i < kolejka.length; i++) wykonaj(kolejka[i]);
    kolejka.length = 0;
  }
  /* Sygnał z SygnalHydracji pada, gdy uwodni się KORZEŃ. Wyspy odroczone
     (kafelki repertuaru, FAQ, aktualności) kończą chwilę później — zmierzone
     45 ms w trybie deweloperskim. Zapis w tym oknie trafiałby w węzeł, którego
     React jeszcze nie przejął, więc dokładamy krótką zwłokę. Kosztuje ona tyle,
     że poświata ładowania gaśnie o ćwierć sekundy później; zysk to brak
     przerwanego uwadniania całych gałęzi. */
  window.addEventListener('ap:hydrated', function(){ setTimeout(oproznij, 300); }, { once: true });
  /* Bezpiecznik: gdyby sygnał nie dotarł (błąd JS, trasa bez providera),
     po dwóch sekundach i tak wypisujemy — lepiej ostrzeżenie w konsoli niż
     zdjęcia, które na zawsze zostają pod poświatą ładowania. */
  setTimeout(oproznij, 2000);
  var near = window.IntersectionObserver ? new IntersectionObserver(function(entries){
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (e.isIntersecting) {
        zapisz(e.target, 'attr', 'data-ap-near');
        /* Zdjęcie z pamięci podręcznej jest gotowe, zanim ktokolwiek je zobaczy.
           Oznaczamy je DOPIERO, gdy zbliży się do kadru — patrz komentarz
           przy watch(). */
        if (e.target.complete && e.target.naturalWidth > 0) {
          zapisz(e.target, 'attr', 'data-ap-loaded');
          near.unobserve(e.target);
        }
      } else {
        zapisz(e.target, 'attr-', 'data-ap-near');
      }
    }
  }, { rootMargin: '300px' }) : null;
  function done(){
    zapisz(this, 'attr', 'data-ap-loaded');
    if (near) near.unobserve(this);
  }
  function watch(img){
    /* complete bez naturalWidth kłamie: obraz z loading="lazy", który jeszcze
       nie ruszył, bywa raportowany jako complete (tak robi WebKit) i tracił
       przez to zarówno obserwator, jak i placeholder pod spodem.

       Zdjęcia gotowe od razu (z pamięci podręcznej) NIE są oznaczane w tym
       miejscu, choć byłoby to najprostsze. Powód: skrypt dotyka wtedy węzłów,
       które React uwadnia dopiero później — kafelki repertuaru leżą pod
       zgięciem i należą do osobnej wyspy. Taka wyspa zastawała atrybut,
       którego nie ma w jej własnym renderze, i sypała ostrzeżeniem
       o niezgodności uwodnienia. Oznaczenie przejmuje obserwator zbliżenia:
       odpala się dopiero, gdy zdjęcie wchodzi w okolicę kadru, a wtedy jego
       wyspa jest już uwodniona. Poświata pod zdjęciem i tak jest widoczna
       wyłącznie w kadrze, więc gość nie zauważy różnicy. */
    if (img.complete && img.naturalWidth > 0 && !near) { zapisz(img, 'attr', 'data-ap-loaded'); return; }
    img.addEventListener('load', done);
    img.addEventListener('error', done);
    if (near) near.observe(img); else zapisz(img, 'attr', 'data-ap-near');
  }
  /* Wejście treści przy przewijaniu (ScrollMotionItem). Jeden obserwator na
     całą stronę: element, który wjedzie w kadr, dostaje klasę i przestaje być
     obserwowany. W trakcie przewijania nie liczy się tu nic co klatkę.
     Klasę na <html> ustawiamy od razu, jeszcze przed <body> — CSS ukrywa
     elementy dopiero, gdy JavaScript działa, więc bez niego wszystko jest
     widoczne, a nic nie mignie przy pierwszym malowaniu. */
  if (window.IntersectionObserver) document.documentElement.classList.add('ap-reveal');
  var reveal = window.IntersectionObserver ? new IntersectionObserver(function(entries){
    for (var i = 0; i < entries.length; i++) {
      if (!entries[i].isIntersecting) continue;
      zapisz(entries[i].target, 'class', 'is-visible');
      reveal.unobserve(entries[i].target);
    }
    /* -2%, nie -8%: przy -8% element, który kończy się w dolnych 72 px ekranu
       (przy 900 px wysokości), nie przecinał skurczonego korzenia i zostawał
       niewidoczny tak długo, jak długo użytkownik nie przewinął dalej. */
  }, { rootMargin: '0px 0px -2% 0px' }) : null;

  var pending = 0;
  function sweep(){
    pending = 0;
    var list = document.querySelectorAll(SEL);
    for (var i = 0; i < list.length; i++) watch(list[i]);
    if (!reveal) return;
    /* „Już obserwuję" trzymamy w pamięci skryptu, NIE w atrybucie na elemencie.
       Wcześniej każdy przebieg dopisywał data-ap-seen do wszystkich sekcji
       w dokumencie — także tych, które React uwadnia później (sekcje odroczone,
       FAQ, aktualności). Taka sekcja zastawała w HTML-u atrybut, którego nie ma
       w jej własnym renderze, i React porzucał uwadnianie całej gałęzi.
       WeakSet nie dotyka drzewa, więc problem znika u źródła. */
    var wejscia = document.querySelectorAll('[data-ap-reveal]:not(.is-visible)');
    for (var j = 0; j < wejscia.length; j++) {
      if (widziane.has(wejscia[j])) continue;
      widziane.add(wejscia[j]);
      reveal.observe(wejscia[j]);
    }
  }
  function schedule(){ if (!pending) pending = requestAnimationFrame(sweep); }
  function start(){
    sweep();
    new MutationObserver(schedule).observe(document.documentElement, {
      childList: true, subtree: true, attributes: true, attributeFilter: ['src']
    });
  }
  /* Start NATYCHMIAST, nie na DOMContentLoaded. Skrypty Next.js mają atrybut
     defer, więc DOMContentLoaded czeka na ich pobranie — przy wolnym łączu
     zmierzyliśmy 9,2 s. Przez ten czas klasa ap-reveal już ukrywała sekcje,
     a obserwator, który ma je pokazać, jeszcze nie istniał: użytkownik widział
     puste ekrany. MutationObserver na <html> łapie węzły w trakcie strumienia
     HTML-a, więc sekcje są obserwowane i odsłaniane od razu, gdy się pojawią.
     To samo dotyczy data-ap-near — bez tego nie pokazywał się nawet
     placeholder pod niedociągniętym zdjęciem. */
  start();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('load', schedule);

  /* Bezpiecznik: gdyby obserwator z jakiegokolwiek powodu nie zadziałał
     (błąd skryptu, wyjątkowo wolne urządzenie), po 4 s odsłaniamy wszystko,
     co jest w kadrze. Lepiej stracić animację wejścia niż pokazać pustkę. */
  var straznik = 0;
  function ratuj(){
    var poz = document.querySelectorAll('[data-ap-reveal]:not(.is-visible)');
    if (!poz.length) { clearInterval(straznik); return; }
    var h = window.innerHeight || 0;
    for (var i = 0; i < poz.length; i++) {
      var r = poz[i].getBoundingClientRect();
      if (r.bottom > 0 && r.top < h) poz[i].classList.add('is-visible');
    }
  }
  /* Bezpiecznik musi pilnować CAŁEJ strony, nie tylko pierwszego ekranu:
     w chwili t=4 s w kadrze zwykle nie ma jeszcze żadnej sekcji z animacją
     wejścia (pierwsza jest pod zgięciem), więc jednorazowy przebieg nie
     ratował niczego. Teraz sprawdzamy co 2 s przez pół minuty i dodatkowo
     przy przewijaniu — to kilka zapytań o siedem elementów, koszt pomijalny,
     a gwarancja, że nikt nigdy nie zobaczy pustego ekranu. */
  setTimeout(function(){
    ratuj();
    straznik = setInterval(ratuj, 2000);
    setTimeout(function(){ clearInterval(straznik); }, 30000);
    window.addEventListener('scroll', ratuj, { passive: true });
  }, 4000);
})();
`.trim(),
          }}
        />
        {/* ------------------------------------------------------------------
            Google tag (gtag.js) — GA4 (id w `gaMeasurementId` poniżej).

            ŚWIADOMIE surowe <script> w <head>, a NIE <Script strategy="beforeInteractive">.
            W App Routerze `beforeInteractive` NIE trafia do statycznego HTML — Next
            zamienia go na wpis w kolejce `self.__next_s`, którą odpala dopiero bundle
            `main-app` (patrz next/dist/client/app-bootstrap.js → loadScriptsInSequence).
            Skutki tamtej wersji:
              1) w wyeksportowanym HTML nie było ANI słowa o googletagmanager.com,
                 więc Google raportował „Nie wykryliśmy w Twojej witrynie tagu Google",
              2) `window.gtag` powstawało dopiero po pobraniu i wykonaniu JS Nexta.

            UWAGA: pierwotnym powodem ładowania gtag.js ZAWSZE (a nie po zgodzie)
            była potrzeba, by `window.gtag` istniało przed startem widżetu Bookero,
            który sam wysyłał zdarzenia e-commerce. Bookero zostało usunięte,
            a kasa biletowa jest na osobnej domenie, więc ten powód już nie
            obowiązuje — przeniesienie tagu za zgodę analityczną oszczędziłoby
            191 kB każdemu gościowi, który jej nie udziela.

            KOLEJNOŚĆ jest istotna: najpierw Consent Mode v2 `default` (inline, sync),
            dopiero potem async gtag/js. Dzięki temu tag zna stan zgody, zanim
            cokolwiek wyśle.

            Consent Mode v2 „advanced": tag ładuje się zawsze, ale przed zgodą
            `analytics_storage`/`ad_*` = 'denied', czyli ŻADNE cookie analityczne ani
            reklamowe nie jest zapisywane — GA4 wysyła wtedy jedynie bezcookie'owe
            pingi. Podniesienie do 'granted' robi <ConsentTrackers/> przez
            gtag('consent','update') natychmiast po kliknięciu w banerze, bez
            przeładowania strony.
            -------------------------------------------------------------------- */}
        <script
          id="ap-gtag-init"
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var an='denied', ad='denied';
try {
  var raw = window.localStorage.getItem('ap-cookie-consent');
  if (raw) {
    var c = JSON.parse(raw);
    if (c && c.v === ${CONSENT_VERSION}) {
      an = c.analytics ? 'granted' : 'denied';
      ad = c.marketing ? 'granted' : 'denied';
    }
  }
} catch (e) {}
gtag('consent','default',{
  ad_storage: ad,
  ad_user_data: ad,
  ad_personalization: ad,
  analytics_storage: an,
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', '${gaMeasurementId}');
`.trim(),
          }}
        />
        {/* gtag.js to 192 kB — NAJWIĘKSZY pojedynczy plik JavaScript serwisu,
            większy niż którakolwiek paczka samej aplikacji (zmierzone 2026-10-01:
            34% całego JS na desktopie, 44% na telefonie). Wcześniej szedł
            z `defer`: parsera nie blokował, ale pobierał się RAZEM z pierwszym
            kadrem i zabierał mu pasmo.

            Teraz dokładamy go, gdy strona jest już użyteczna: w bezczynności po
            `load`, a przy wcześniejszej interakcji — natychmiast. Bez zmian
            zostaje to, od czego zależy zgodność z RODO i wykrywanie tagu:
              * Consent Mode v2 `default` leci nadal INLINE i SYNCHRONICZNIE
                powyżej, więc stan zgody jest ustawiony, zanim tag cokolwiek
                wyśle,
              * `window.gtag` i `dataLayer` istnieją od pierwszej klatki, więc
                zdarzenia wypchnięte wcześniej czekają w kolejce,
              * tag jest na stronie, więc Google go wykrywa.
            Kosztem jest pomiar gościa, który wyjdzie w pierwszych sekundach.
            `requestIdleCallback` nie istnieje w Safari — stąd zapas na timer. */}
        <script
          id="ap-gtag-odlozony"
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  var zaladowany = false;
  function wczytaj(){
    if (zaladowany) return;
    zaladowany = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}';
    document.head.appendChild(s);
  }
  var zdarzenia = ['pointerdown','keydown','touchstart','scroll'];
  function naInterakcje(){
    zdarzenia.forEach(function(z){ window.removeEventListener(z, naInterakcje); });
    wczytaj();
  }
  zdarzenia.forEach(function(z){ window.addEventListener(z, naInterakcje, { once: true, passive: true }); });
  function poWczytaniu(){
    if (window.requestIdleCallback) window.requestIdleCallback(wczytaj, { timeout: 3500 });
    else setTimeout(wczytaj, 2500);
  }
  if (document.readyState === 'complete') poWczytaniu();
  else window.addEventListener('load', poWczytaniu, { once: true });
})();
`.trim(),
          }}
        />
        {/* Preconnect do Meta świadomie pominięty — z connect.facebook.net łączymy
            się dopiero po zgodzie „marketing" (patrz ConsentTrackers). */}
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
      </head>
      <body className="min-h-screen bg-[var(--ap-bg)] text-[color:var(--ap-text)] transition-colors duration-300">
        {/* Consent Mode v2 `default` siedzi w <head> (patrz komentarz tam) —
            musi być w statycznym HTML i wykonać się jako pierwszy, zanim
            doładowana później biblioteka gtag.js cokolwiek wyśle. */}
          <SygnalHydracji />
          <I18nProvider initialLocale={initialLocale}>
            <div className="relative z-10 min-h-screen flex flex-col">
              <AppBar />
              {children}
              <Footer />
            </div>
            <FloatingDemoPromo />
            {/* Letnie Promo Days zajmuje prawą stronę hero; zastępuje pływającą
                maskotkę „Rozpocznij przygodę" (FloatingMascotCta), którą tu wyłączono. */}
            <SummerPromoBumper />
            <CookieConsent />
          </I18nProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
        <AnalyticsTracker />
        <GaPageViewTracker />
        <MetaPixelPageViewTracker />
        <ConsentTrackers gtmId={gtmId} metaPixelId={metaPixelId} />
      </body>
    </html>
  );
}
