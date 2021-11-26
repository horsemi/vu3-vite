/**
 * Configure and register global directives
 */
import type { App } from 'vue';
import { setupClickOutsideDirective } from './clickOutside';
import { setupPermissionDirective } from './permission';
import { setupLoadingDirective } from './loading';

export function setupGlobDirectives(app: App) {
  setupLoadingDirective(app);
  setupClickOutsideDirective(app);
  setupPermissionDirective(app);
}
