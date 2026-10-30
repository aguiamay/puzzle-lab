'use client';
import { demo } from '@/game/data/demo';
import { useGame } from '@/game/state/useGame';
import { GameBoard } from './GameBoard';
import { PieceTray } from './PieceTray';
import { GameToolbar } from './GameToolbar';
import { GameStatus } from './GameStatus';
import styles from './Game.module.css';
export function Game() {
  const [state, dispatch] = useGame(demo);
  return <main className={styles.shell}>
    <header className={styles.header}><a href="#game" className={styles.brand}><span aria-hidden="true">▦</span> Puzzle Lab</a><span className={styles.badge}>Versão experimental · etapa 1.1</span></header>
    <section className={styles.intro}><p className={styles.eyebrow}>UM ESPAÇO PARA PENSAR</p><h1>Encontre o seu encaixe.</h1><p>Selecione, gire e preencha. Um pequeno desafio de formas, sem pressa.</p></section>
    <div className={styles.gameLayout} id="game">
      <section className={styles.boardPanel} aria-labelledby="challenge-heading">
        <div className={styles.sectionTitle}><div><p className={styles.eyebrow}>{demo.challenge.id} · DEMONSTRAÇÃO</p><h2 id="challenge-heading">Laboratório de encaixes</h2></div><span className={styles.dimensions}>4 × 3</span></div>
        <GameBoard puzzle={demo} state={state} dispatch={dispatch} />
        <p id="board-help" className={styles.boardHelp}>Toque na casa onde começa a caixa da peça. Combine ○ com ○ e □ com □. Casa ocupada seleciona a peça; casa vazia tenta posicionar. Use Remover peça para retirá-la.</p>
        <GameToolbar state={state} dispatch={dispatch} />
        <GameStatus puzzle={demo} state={state} />
      </section>
      <PieceTray puzzle={demo} state={state} dispatch={dispatch} />
    </div>
    <footer className={styles.footer}><strong>Geometria experimental, regras transparentes.</strong><p>Este cenário tem peças e solução próprias. Não representa um desafio oficial nem a geometria validada do jogo de referência. O progresso fica apenas nesta sessão; reiniciar limpa também o histórico.</p></footer>
  </main>;
}
