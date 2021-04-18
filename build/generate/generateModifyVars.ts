import { resolve } from 'path';

/**
 * less global variable
 */
export function generateModifyVars() {
  return {
    // Used for global import to avoid the need to import each style file separately
    // reference:  Avoid repeated references
    hack: `@import (reference) "${resolve('src/styles/config.less')}";`,
  };
}
