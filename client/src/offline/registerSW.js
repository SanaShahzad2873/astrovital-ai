import { registerSW } from 'virtual:pwa-register';
import { startAutoSync } from './syncQueue.js';

export function setupOffline() {
  registerSW({ immediate: true });
  startAutoSync();
}