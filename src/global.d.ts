/* eslint-disable import/no-default-export */

declare module '*.scss' {
  const CONTENT: { [className: string]: string };
  export default CONTENT;
}

declare module '*.module.scss' {
  const CONTENT: { [className: string]: string };
  export default CONTENT;
}

declare module '*.svg' {
  const CONTENT: string;
  export default CONTENT;
}
