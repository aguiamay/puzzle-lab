import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Puzzle Lab — Laboratório de encaixes', description: 'Uma demonstração experimental de quebra-cabeça geométrico.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
