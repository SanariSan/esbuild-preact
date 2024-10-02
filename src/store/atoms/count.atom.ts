import { atom } from 'jotai';
import { store } from '../store';
import { switchFlag } from './flag.atom';

export const countAtom = atom(0);
export const setCount = (count: number) => store.set(countAtom, count);
export const addCount = () =>
  store.set(countAtom, (prev) => {
    if (prev + 1 === 3) switchFlag();

    return prev + 1;
  });
