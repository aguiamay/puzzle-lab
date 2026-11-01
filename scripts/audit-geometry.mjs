import ts from 'typescript';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

// Compilação temporária apenas de módulos puros. Não altera a aplicação nem instala ferramentas.
const output = await mkdtemp(join(tmpdir(), 'puzzle-audit-'));
try {
  const program = ts.createProgram(['src/game/engine/audit.ts', 'src/game/engine/reducer.ts', 'src/game/data/demo.ts', 'src/game/data/research/puzzle.ts'], {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, strict: true,
    skipLibCheck: true, outDir: output, rootDir: 'src/game', types: [],
  });
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: f => f, getCurrentDirectory: () => process.cwd(), getNewLine: () => '\n',
  }));
  assert.equal(program.emit().emitSkipped, false);
  const require = createRequire(import.meta.url);
  const { auditGeometry } = require(join(output, 'engine/audit.js'));
  const { initialState, reduceGame } = require(join(output, 'engine/reducer.js'));
  const { validateMove, validAnchors } = require(join(output, 'engine/placement.js'));
  const { demo } = require(join(output, 'data/demo.js'));
  const { researchPuzzle, observedLayout } = require(join(output, 'data/research/puzzle.js'));
  const demoLayout = [['A-1',0,0,0], ['A-2',0,0,1], ['B-1',2,2,0], ['C-1',0,0,2], ['D-1',1,3,1]].map(([id, orientation, x, y]) => ({ type:'DROP_PIECE', id, orientation, position:{x,y} }));
  for (const [puzzle, layout] of [[demo, demoLayout], [researchPuzzle, observedLayout]]) {
    let state = initialState(puzzle);
    const original = JSON.stringify(state);
    for (const action of layout) {
      state = reduceGame(puzzle, state, action);
      assert.equal(state.feedback.error, false, state.feedback.text);
    }
    assert.equal(JSON.stringify(initialState(puzzle)), original);
    const report = auditGeometry(puzzle, state.present, true);
    assert.deepEqual(report.errors, []);
    assert.equal(report.layoutComplete, true);
    const undone = reduceGame(puzzle, state, { type:'UNDO' });
    assert.equal(auditGeometry(puzzle, undone.present).layoutComplete, false);
    assert.deepEqual(reduceGame(puzzle, undone, { type:'REDO' }).present, state.present);
    assert.deepEqual(reduceGame(puzzle, state, { type:'RESET' }), initialState(puzzle));
    const tampered = { pieces: state.present.pieces.map((piece, i) => i ? piece : { ...piece, orientation: 9 }) };
    assert.equal(auditGeometry(puzzle, tampered).layoutComplete, false);
    const changedMarks = { ...puzzle, board: { ...puzzle.board, cells: puzzle.board.cells.map((cell, i) => i ? cell : { ...cell, socket: cell.socket === 'cross' ? 'circle' : 'cross' }) } };
    assert.equal(auditGeometry(changedMarks, state.present).layoutComplete, false);
    const first = state.present.pieces[0];
    assert.equal(validateMove(puzzle, state.present, first, {x:-1,y:0}).ok, false);
    const removed = reduceGame(puzzle, reduceGame(puzzle, state, {type:'SELECT_PIECE',id:first.id}), {type:'REMOVE_PIECE'});
    assert.equal(auditGeometry(puzzle, removed.present).layoutComplete, false);
    assert.equal(validAnchors(puzzle, removed.present, removed.present.pieces[0]).length > 0, true);
    assert.equal(validateMove(puzzle, state.present, {...first, mirrored:true}, first.position).ok, false);
    const duplicate = { ...puzzle, board:{...puzzle.board, cells:[...puzzle.board.cells, puzzle.board.cells[0]]} };
    assert.equal(auditGeometry(duplicate).errors.length > 0, true);
    const badInstances = {pieces:state.present.pieces.map(() => first)};
    assert.equal(auditGeometry(puzzle, badInstances).layoutComplete, false);
    console.log(JSON.stringify({id:puzzle.challenge.id, ...report}, null, 2));
  }
  const emptyResearch = initialState(researchPuzzle);
  const crosses = emptyResearch.present.pieces.find(p => p.code === 'R03');
  assert.equal(validateMove(researchPuzzle, emptyResearch.present, crosses, {x:0,y:0}).ok, false);
  const fullResearch = observedLayout.reduce((state, action) => reduceGame(researchPuzzle, state, action), emptyResearch);
  assert.equal(validateMove(researchPuzzle, fullResearch.present, fullResearch.present.pieces.find(p=>p.id==='R03-1'), {x:4,y:3}).ok, false);
  for (const piece of emptyResearch.present.pieces) for (const orientation of [0,1,2,3]) {
    const candidate = {...piece, orientation};
    const anchors = validAnchors(researchPuzzle, emptyResearch.present, candidate);
    for (const cell of researchPuzzle.board.cells) assert.equal(anchors.some(p=>p.x===cell.x&&p.y===cell.y), validateMove(researchPuzzle, emptyResearch.present, candidate, cell).ok);
  }
  // Extração de pesquisa, sem importar desafios no runtime. --catalog imprime todos os registros.
  const html = await readFile('references/JogoCilada.html', 'utf8');
  let category = '';
  const catalog = [];
  for (const match of html.matchAll(/<h2>(.*?)<\/h2>|<td>(\d{3})\)\s*([A-N]+)([\s\S]*?)<\/td>/g)) {
    if (match[1]) category = match[1];
    else {
      const image = match[4].match(/src="([^"]+)"/)?.[1];
      assert.ok(image);
      catalog.push({id:match[2], code:match[3], category, image, observation:match[4].split('<br')[0].trim()});
    }
  }
  assert.equal(catalog.length, 509);
  catalog.forEach((row,i) => assert.equal(row.id, String(i+1).padStart(3,'0')));
  assert.equal(catalog[20].code, catalog[24].code);
  if (process.argv.includes('--catalog')) console.log(JSON.stringify(catalog, null, 2));
  else console.log(JSON.stringify({entries:catalog.length, letters:[...new Set(catalog.flatMap(r=>[...r.code]))].sort(), duplicateIds:[catalog[20],catalog[24]], categories:Object.fromEntries([...new Set(catalog.map(r=>r.category))].map(c=>[c,catalog.filter(r=>r.category===c).length]))},null,2));
} finally { await rm(output, {recursive:true, force:true}); }
