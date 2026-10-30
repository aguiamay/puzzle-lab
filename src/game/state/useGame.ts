'use client';
import { useReducer } from 'react';
import { initialState, reduceGame } from '../engine/reducer';
import type { Action, GameState, Puzzle } from '../engine/types';
export function useGame(puzzle: Puzzle) {
  return useReducer((state: GameState, action: Action) => reduceGame(puzzle, state, action), puzzle, initialState);
}
