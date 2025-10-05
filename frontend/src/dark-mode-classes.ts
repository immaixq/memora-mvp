// This file ensures dark mode classes are included in the build
// DO NOT DELETE - Required for Tailwind to include dark mode classes in production build

export const DARK_MODE_CLASSES = [
  // GitHub dark theme colors
  'dark:bg-[#0d1117]',
  'dark:bg-[#21262d]',
  'dark:bg-[#161b22]',
  'dark:bg-[#30363d]',
  'dark:text-[#f0f6fc]',
  'dark:text-[#7d8590]',
  'dark:text-[#58a6ff]',
  'dark:border-[#30363d]',
  'dark:hover:bg-[#30363d]',
  'dark:hover:text-[#f0f6fc]',
  'dark:hover:text-[#79c0ff]',
  'dark:focus:ring-[#58a6ff]',
  'dark:focus:border-[#58a6ff]',
  'dark:via-[#21262d]',
  'dark:to-[#21262d]',
  'dark:from-[#21262d]',
  'dark:from-[#0d1117]',
  'dark:via-[#161b22]',
  'dark:to-[#21262d]',
  'dark:from-red-900/20',
  'dark:to-orange-900/20',
  'dark:border-red-800/50',
  'dark:bg-red-900/20',
  'dark:text-red-400',
  'dark:text-red-500',
  'dark:bg-green-900/20',
  'dark:border-green-500',
  'dark:text-green-400',
  'dark:hover:bg-[#3c434d]',
  'dark:hover:bg-[#2d333b]',
  'dark:group-hover:text-[#58a6ff]',
  'dark:group-hover:bg-[#58a6ff]',
  'dark:hover:border-[#58a6ff]',
  'dark:hover:bg-[#0d1117]',
  'dark:bg-black',
  'dark:bg-opacity-50',
  'dark:border-[#30363d]',
  'dark:text-[#7d8590]',
  'dark:hover:bg-red-50',
  'dark:hover:text-red-400',
  'dark:focus:ring-[#58a6ff]',
  'dark:bg-[#161b22]/50',
  'dark:bg-[#161b22]/95',
  'dark:bg-[#30363d]/50',
] as const;

// This creates a CSS comment that includes all classes to ensure they're detected
const DARK_MODE_CSS_COMMENT = `
/*
Dark mode classes used in this application:
${DARK_MODE_CLASSES.join(' ')}
*/
`;

export default DARK_MODE_CSS_COMMENT;