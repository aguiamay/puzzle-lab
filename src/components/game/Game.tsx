'use client';
import { useState } from 'react';
import { demo } from '@/game/data/demo';
import { useDragInteraction } from '@/game/state/useDragInteraction';
import { DragPreview } from './DragPreview';
import { useGame } from '@/game/state/useGame';
import { GameBoard } from './GameBoard';
import { PieceTray } from './PieceTray';
import { GameToolbar } from './GameToolbar';
import { GameStatus } from './GameStatus';
import styles from './Game.module.css';
export function Game() {
  const [state, dispatch] = useGame(demo);
  const [assistLastPlacement, setAssistLastPlacement] = useState(true);
  const drag = useDragInteraction(demo, state, dispatch, assistLastPlacement);
  return <main className={styles.shell} onClickCapture={drag.onClickCapture} onPointerDownCapture={drag.onPointerDownCapture}>
    <header className={styles.header}><a href="#game" className={styles.brand}><span aria-hidden="true">▦</span> Puzzle Lab</a><span className={styles.badge}>Versão experimental · etapa 2.1</span></header>
    <section className={styles.intro}><p className={styles.eyebrow}>UM ESPAÇO PARA PENSAR</p><h1>Encontre o seu encaixe.</h1><p>Selecione, gire e preencha. Um pequeno desafio de formas, sem pressa.</p></section>
    <div className={styles.gameLayout} id="game">
      <section className={styles.boardPanel} aria-labelledby="challenge-heading">
        <div className={styles.sectionTitle}><div><p className={styles.eyebrow}>{demo.challenge.id} · DEMONSTRAÇÃO</p><h2 id="challenge-heading">Laboratório de encaixes</h2></div><span className={styles.dimensions}>4 × 3</span></div>
        <GameBoard puzzle={demo} state={state} dispatch={drag.perform} drag={drag} boardRef={drag.boardRef} />
        <p id="board-help" className={styles.boardHelp}>Arraste pelo desenho da peça ou selecione e toque numa casa vazia. Combine ○ com ○ e □ com □. Durante o arraste, R ou botão direito gira; no toque, use um segundo toque breve. Escape cancela. Casa ocupada seleciona a peça.</p>
        <label className={styles.assistance}><input type="checkbox" checked={assistLastPlacement} disabled={Boolean(drag.view && !drag.view.returning)} onChange={event => setAssistLastPlacement(event.target.checked)} /> Ajudar no último encaixe próximo</label>
        <GameToolbar state={state} dispatch={drag.perform} />
        <GameStatus puzzle={demo} state={state} notice={drag.notice} />
      </section>
      <PieceTray puzzle={demo} state={state} dispatch={drag.perform} drag={drag} />
    </div>
    <DragPreview drag={drag} />
    <footer className={styles.footer}><strong>Geometria experimental, regras transparentes.</strong><p>Este cenário tem peças e solução próprias. Não representa um desafio oficial nem a geometria validada do jogo de referência. O progresso fica apenas nesta sessão; reiniciar limpa também o histórico.</p></footer>
  </main>;
}
