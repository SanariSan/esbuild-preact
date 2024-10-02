import { useAtomValue } from 'jotai';
import { addCount, countAtom, flagAtom } from './store/atoms';
import { useEffect } from 'preact/hooks';

/**
 * This example shows:
 * - Count atom increment on click
 * - Flag atom mutation side effect after counter reaches 3
 * - Logs rerenders to showcase flag component not being constantly rerendered
 */

export function Flag() {
  const flag = useAtomValue(flagAtom);

  useEffect(() => {
    console.log('flag rerendered', flag);
  }, [flag]);

  return <div>FLAG: {JSON.stringify(flag)}</div>;
}

export function Count() {
  const count = useAtomValue(countAtom);

  useEffect(() => {
    console.log('count rerendered', count);
  }, [count]);

  return (
    <div style={{ cursor: 'pointer' }} onClick={() => addCount()}>
      COUNT: {count} (Click to increase)
    </div>
  );
}
