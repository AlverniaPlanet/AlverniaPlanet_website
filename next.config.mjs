/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",           // <-- mówimy Nextowi: generuj statyczny /out
  images: {
    unoptimized: true,        // <-- bo hostujesz statycznie, bez image-optim w Node
    qualities: [60, 70, 75],  // <-- jawnie dozwolone quality używane w komponentach <Image>
  },
  eslint: {
    ignoreDuringBuilds: true, // <-- żeby build nie wywalał przez pierdoły z ESLinta
  },
};

export default nextConfig;
