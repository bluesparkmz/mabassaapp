import 'react-native-url-polyfill/auto';
global.Buffer = require('buffer').Buffer;

const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.map((arg) => String(arg?.message || arg)).join(' ');
  if (message.includes('Unable to activate keep awake')) {
    return;
  }
  originalConsoleError(...args);
};

if (typeof globalThis.addEventListener === 'function') {
  globalThis.addEventListener('unhandledrejection', (event) => {
    const message = String(event?.reason?.message || event?.reason || '');
    if (message.includes('Unable to activate keep awake')) {
      event.preventDefault?.();
    }
  });
}

import '@expo/metro-runtime';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import App from './entrypoint';

renderRootComponent(App);
