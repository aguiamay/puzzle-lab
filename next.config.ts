import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Preserva as instruções do projeto: next dev não deve editar AGENTS.md.
  agentRules: false,
};

export default nextConfig;
