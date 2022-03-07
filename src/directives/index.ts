/**
 * Configure and register global directives
 */
import type { App } from 'vue';
import { setupClickOutsideDirective } from './clickOutside';
import { setupContextMenuOutsideDirective } from './contextMenuOutside';
import { setupPermissionDirective } from './permission';
import { setupLoadingDirective } from './loading';

export function setupGlobDirectives(app: App) {
  setupLoadingDirective(app);
  setupClickOutsideDirective(app);
  setupContextMenuOutsideDirective(app);
  setupPermissionDirective(app);
}
