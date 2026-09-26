import type { ReactNode, SVGProps } from 'react';

type IconName =
  | 'shield'
  | 'dashboard'
  | 'contracts'
  | 'wrench'
  | 'history'
  | 'settings'
  | 'github'
  | 'branch'
  | 'play'
  | 'refresh'
  | 'search'
  | 'check'
  | 'x'
  | 'warning'
  | 'file'
  | 'clock'
  | 'arrow-left'
  | 'arrow-right'
  | 'code'
  | 'spark';

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

const paths: Record<IconName, ReactNode> = {
  shield: <path d="M12 3l7 3v5c0 4.8-2.8 8.2-7 10-4.2-1.8-7-5.2-7-10V6l7-3Zm-3 9 2 2 4-4" />,
  dashboard: <path d="M4 4h6v6H4V4Zm10 0h6v10h-6V4ZM4 14h6v6H4v-6Zm10 4h6v2h-6v-2Z" />,
  contracts: <path d="M6 3h9l4 4v14H6V3Zm9 0v5h5M9 12h7M9 16h7M9 8h2" />,
  wrench: <path d="M14 6a4 4 0 0 0-5 5L4 16l4 4 5-5a4 4 0 0 0 5-5l-3 3-3-3 2-4Z" />,
  history: <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2" />,
  settings: <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm8 3 2-1-2-3-2 .5-1.5-1.5.5-2-3-2-1 2h-2l-1-2-3 2 .5 2L6 8.5 4 8l-2 3 2 1v2l-2 1 2 3 2-.5L7.5 19l-.5 2 3 2 1-2h2l1 2 3-2-.5-2 1.5-1.5 2 .5 2-3-2-1v-2Z" />,
  github: <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.2-1.5-1.2-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.3-2.3-.3-4.7-1.2-4.7-5A3.9 3.9 0 0 1 6.7 8c-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1.1a9.7 9.7 0 0 1 5 0c1.9-1.4 2.8-1.1 2.8-1.1.6 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1.1 2.8c0 3.9-2.4 4.7-4.7 5 .4.3.7 1 .7 2V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />,
  branch: <path d="M6 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12-7a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM6 7v10m0-5h5a5 5 0 0 0 5-5" />,
  play: <path d="M8 5v14l11-7-11-7Z" />,
  refresh: <path d="M20 7v5h-5M4 17v-5h5M6.1 9A7 7 0 0 1 18 6l2 2M3.9 16A7 7 0 0 0 16 18l2-2" />,
  search: <path d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />,
  check: <path d="m5 12 4 4L19 6" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
  warning: <path d="M12 3 2 21h20L12 3Zm0 6v5m0 3v.1" />,
  file: <path d="M6 2h8l4 4v16H6V2Zm8 0v5h5" />,
  clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2" />,
  'arrow-left': <path d="m15 18-6-6 6-6" />,
  'arrow-right': <path d="m9 18 6-6-6-6" />,
  code: <path d="m8 9-4 3 4 3m8-6 4 3-4 3m-2-9-4 12" />,
  spark: <path d="m12 2 1.2 3.8L17 7l-3.8 1.2L12 12l-1.2-3.8L7 7l3.8-1.2L12 2Zm6 9 .8 2.2L21 14l-2.2.8L18 17l-.8-2.2L15 14l2.2-.8L18 11ZM6 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" />,
};

export default function Icon({ name, size = 18, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
