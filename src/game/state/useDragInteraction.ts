'use client';
import { useCallback, useEffect, useRef, useState, type Dispatch, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from 'react';
import type { Action, Cell, GameState, Orientation, PieceInstance, Point, Puzzle, Validation } from '../engine/types';
import { localCells } from '../engine/geometry';
import { validateMove } from '../engine/placement';
import { rotateContact, toLocal, toScreen } from '../interaction/coordinates';
import { snapOrigin } from '../interaction/snap';

export interface DragView {
  piece: PieceInstance;
  cells: readonly Cell[];
  screenOrigin: Point;
  scale: number;
  anchor: Point | null;
  validation: Validation;
  returning: boolean;
}
interface Session {
  pointerId: number;
  source: Element;
  piece: PieceInstance;
  contact: Point;
  start: Point;
  pointer: Point;
  scale: number;
  originScreen: Point;
  active: boolean;
  anchor: Point | null;
}

export function useDragInteraction(puzzle: Puzzle, state: GameState, dispatch: Dispatch<Action>) {
  const boardRef = useRef<SVGSVGElement>(null);
  const session = useRef<Session | null>(null);
  const frame = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClick = useRef(false);
  const [view, setView] = useState<DragView | null>(null);
  const [notice, setNotice] = useState('');

  const derive = useCallback((s: Session): DragView => {
    const logical = boardRef.current && toLocal(boardRef.current, s.pointer);
    const anchor = logical ? snapOrigin({ x: logical.x - s.contact.x, y: logical.y - s.contact.y }, logical, puzzle, s.anchor) : null;
    s.anchor = anchor;
    return {
      piece: s.piece, cells: localCells(puzzle, s.piece), scale: s.scale,
      screenOrigin: { x: s.pointer.x - s.contact.x * s.scale, y: s.pointer.y - s.contact.y * s.scale },
      anchor, validation: anchor ? validateMove(puzzle, state.present, s.piece, anchor) : { ok: false, reason: 'Fora do tabuleiro. Aproxime a peça para encaixar.' },
      returning: false,
    };
  }, [puzzle, state.present]);

  const finish = useCallback((text: string, animate: boolean) => {
    const s = session.current;
    session.current = null;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    if (s?.source.hasPointerCapture(s.pointerId)) s.source.releasePointerCapture(s.pointerId);
    if (s?.active) suppressClick.current = true;
    if (timer.current) clearTimeout(timer.current);
    if (s?.active && animate) {
      const original = state.present.pieces.find(p => p.id === s.piece.id)!;
      setView({ ...derive(s), piece: original, cells: localCells(puzzle, original), anchor: null, screenOrigin: s.originScreen, returning: true });
      timer.current = setTimeout(() => setView(null), 180);
    } else setView(null);
    if (text) setNotice(text);
  }, [derive, puzzle, state.present]);

  const cancel = useCallback(() => finish('Arraste cancelado. A posição e a orientação foram preservadas.', true), [finish]);

  function begin(event: ReactPointerEvent<Element>, id: string, sourceSvg: SVGSVGElement, fromBoard: boolean) {
    if (session.current || event.button !== 0 || !event.isPrimary) return;
    const piece = state.present.pieces.find(p => p.id === id);
    if (!piece || (!fromBoard && piece.position)) return;
    const pointer = { x: event.clientX, y: event.clientY };
    const local = toLocal(sourceSvg, pointer);
    const matrix = sourceSvg.getScreenCTM();
    if (!local || !matrix) return;
    const position = fromBoard ? piece.position! : { x: 0, y: 0 };
    const originScreen = toScreen(sourceSvg, position);
    if (!originScreen) return;
    if (timer.current) clearTimeout(timer.current);
    setView(null);
    setNotice('');
    suppressClick.current = false;
    session.current = {
      pointerId: event.pointerId, source: event.currentTarget, piece,
      contact: { x: local.x - position.x, y: local.y - position.y },
      pointer, start: pointer, scale: Math.hypot(matrix.a, matrix.b), originScreen,
      active: false, anchor: null,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    dispatch({ type: 'SELECT_PIECE', id });
  }

  function move(event: ReactPointerEvent<Element>) {
    const s = session.current;
    if (!s || s.pointerId !== event.pointerId) return;
    s.pointer = { x: event.clientX, y: event.clientY };
    if (!s.active && Math.hypot(s.pointer.x - s.start.x, s.pointer.y - s.start.y) < 6) return;
    s.active = true;
    event.preventDefault();
    if (frame.current === null) frame.current = requestAnimationFrame(() => {
      frame.current = null;
      if (session.current?.active) setView(derive(session.current));
    });
  }

  function end(event: ReactPointerEvent<Element>) {
    const s = session.current;
    if (!s || s.pointerId !== event.pointerId) return;
    if (!s.active) { finish('', false); return; }
    s.pointer = { x: event.clientX, y: event.clientY };
    const candidate = derive(s);
    if (candidate.anchor && candidate.validation.ok) {
      dispatch({ type: 'DROP_PIECE', id: s.piece.id, position: candidate.anchor, orientation: s.piece.orientation });
      finish('', false);
      setNotice('');
    } else finish(`Encaixe recusado. ${candidate.validation.ok ? '' : candidate.validation.reason}`, true);
  }

  const rotate = useCallback(() => {
    const s = session.current;
    if (!s?.active) { if (s) finish('', false); dispatch({ type: 'ROTATE_PIECE' }); return; }
    const height = Math.max(...localCells(puzzle, s.piece).map(c => c.y)) + 1;
    s.contact = rotateContact(s.contact, height);
    s.piece = { ...s.piece, orientation: ((s.piece.orientation + 1) % 4) as Orientation };
    s.anchor = null;
    setView(derive(s));
  }, [derive, dispatch, finish, puzzle]);

  function perform(action: Action) {
    if (action.type === 'ROTATE_PIECE') { rotate(); return; }
    if (session.current) finish('', false);
    setNotice('');
    dispatch(action);
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input,textarea,select,[role="textbox"]'))) return;
      if (!session.current && target instanceof Element && !target.closest('main')) return;
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
      if (event.key === 'Escape' && session.current) { event.preventDefault(); cancel(); }
      if (event.key.toLowerCase() === 'r' && (session.current || state.selectedId)) { event.preventDefault(); rotate(); }
    };
    const onResize = () => { if (session.current) finish('Arraste cancelado após mudança da tela.', false); };
    const onBlur = () => { if (session.current) finish('Arraste cancelado ao sair da janela.', false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      window.removeEventListener('blur', onBlur);
    };
  }, [cancel, finish, rotate, state.selectedId]);

  const dragging = Boolean(view && !view.returning);
  useEffect(() => {
    if (!dragging) return;
    const oldOverflow = document.body.style.overflow;
    const oldSelect = document.body.style.userSelect;
    document.body.style.overflow = 'hidden';
    document.body.style.userSelect = 'none';
    const prevent = (event: Event) => event.preventDefault();
    window.addEventListener('wheel', prevent, { passive: false });
    window.addEventListener('touchmove', prevent, { passive: false });
    return () => {
      document.body.style.overflow = oldOverflow;
      document.body.style.userSelect = oldSelect;
      window.removeEventListener('wheel', prevent);
      window.removeEventListener('touchmove', prevent);
    };
  }, [dragging]);

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    if (timer.current) clearTimeout(timer.current);
    const s = session.current;
    session.current = null;
    if (s?.source.hasPointerCapture(s.pointerId)) s.source.releasePointerCapture(s.pointerId);
  }, []);

  return {
    boardRef, view, notice, begin, rotate, cancel, perform,
    pointerHandlers: {
      onPointerMove: move, onPointerUp: end,
      onPointerCancel: (e: ReactPointerEvent<Element>) => { if (session.current?.pointerId === e.pointerId) cancel(); },
      onLostPointerCapture: (e: ReactPointerEvent<Element>) => { if (session.current?.pointerId === e.pointerId) cancel(); },
    },
    onPointerDownCapture: () => { if (!session.current) suppressClick.current = false; },
    onClickCapture: (e: ReactMouseEvent) => {
      if (suppressClick.current && e.detail !== 0) { e.preventDefault(); e.stopPropagation(); suppressClick.current = false; }
    },
  };
}
export type DragInteraction = ReturnType<typeof useDragInteraction>;
