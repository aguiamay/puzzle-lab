import type { Point } from '../engine/types';

// Apenas a camada de interação conhece DOM, SVG e coordenadas de tela.
export function toLocal(svg: SVGSVGElement, point: Point): Point | null {
  const matrix = svg.getScreenCTM();
  if (!matrix) return null;
  const local = new DOMPoint(point.x, point.y).matrixTransform(matrix.inverse());
  return { x: local.x, y: local.y };
}

export function toScreen(svg: SVGSVGElement, point: Point): Point | null {
  const matrix = svg.getScreenCTM();
  if (!matrix) return null;
  const screen = new DOMPoint(point.x, point.y).matrixTransform(matrix);
  return { x: screen.x, y: screen.y };
}

export function rotateContact(point: Point, height: number): Point {
  return { x: height - point.y, y: point.x };
}
