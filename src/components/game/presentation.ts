// Identidade visual por tipo; IDs continuam sendo apenas identidade de instância.
const typeColors: Readonly<Record<string, string>> = {
  A: '#1c756f',
  B: '#8c4973',
  C: '#986019',
  D: '#a14c39',
};

export function pieceColor(code: string): string {
  return typeColors[code] ?? '#52645b';
}
