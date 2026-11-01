import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Preserva as instruções do projeto: next dev não deve editar AGENTS.md.
  agentRules: false,
  // Evita que o indicador de desenvolvimento intercepte a bandeja mobile.
  devIndicators: false,
};

export default nextConfig;
