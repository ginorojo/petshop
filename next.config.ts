/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <--- ESTA LÍNEA ES OBLIGATORIA
  images: {
    unoptimized: true, // Necesario para que las imágenes de Unsplash carguen en Cloudflare
  },
};

export default nextConfig;