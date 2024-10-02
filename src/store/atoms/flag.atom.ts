import { atom } from 'jotai';
import { store } from '../store';

export const flagAtom = atom(false);
export const switchFlag = () => store.set(flagAtom, true);
