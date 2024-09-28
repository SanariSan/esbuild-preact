/**
 * Only works for CSS, causes content flash,
 * but keeps html and js states untouched as opposite to full reload.
 * Prefer true, but can avoid this if not needed.
 */
const shoudTryHMR = true;

export const subscribeUpdates = () => {
  try {
    const e = new EventSource('/esbuild');

    window.addEventListener('beforeunload', () => {
      e.close();
    });

    if (!shoudTryHMR) {
      e.addEventListener('change', () => location.reload());
      return;
    }

    e.addEventListener('change', (e) => {
      const { added, removed, updated } = JSON.parse(e.data);

      if (!added.length && !removed.length) {
        let hasUpdatedCss = false;
        let hasUpdatedJs = false;
        let hasUpdatedUnknown = false;
        let cssUpdates: string[] = [];

        // This ensures that only css was updated, so full page reload can be avoided
        for (let i = 0; i < updated.length; i += 1) {
          switch (true) {
            case updated[i].endsWith('.css'): {
              hasUpdatedCss = true;
              cssUpdates.push(updated[i]);
              break;
            }
            case updated[i].endsWith('.js'): {
              hasUpdatedJs = true;
              break;
            }
            default: {
              hasUpdatedUnknown = true;
              break;
            }
          }
        }

        if (hasUpdatedCss && !hasUpdatedJs && !hasUpdatedUnknown) {
          for (const cssUpdateUrl of cssUpdates) {
            for (const link of document.getElementsByTagName('link')) {
              const url = new URL(link.href);

              if (url.host === location.host && url.pathname === cssUpdateUrl) {
                const next = link.cloneNode() as HTMLLinkElement;
                link.remove(); // instant node deletion because of firefox inf loop bug; investigate
                next.href = cssUpdateUrl + '?' + Math.random().toString(36).slice(2);
                (link.parentNode || document.head).insertBefore(next, link.nextSibling);
              }
            }
          }
          return;
        }
      }

      location.reload();
    });
  } catch (e) {
    /* do nothing */
  }
};
