import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desativamos o compilador para evitar conflitos com injeção de scripts de terceiros (next-themes)
  reactCompiler: false,
};

export default withNextIntl(nextConfig);
