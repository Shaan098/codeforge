/**
 * client/src/utils/toast.js
 * Lightweight toast notification system.
 * No external dependencies — uses vanilla DOM + CSS from index.css.
 *
 * Usage:
 *   import { toast } from '../utils/toast';
 *   toast.success('Problem solved!');
 *   toast.error('Something went wrong');
 *   toast.info('Loading...');
 *   toast.warning('Please wait...');
 */

let container = null;

function getContainer() {
  if (!container || !document.body.contains(container)) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'false');
    document.body.appendChild(container);
  }
  return container;
}

function show(message, type = 'info', duration = 4000) {
  const c = getContainer();
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.setAttribute('role', 'alert');

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  el.innerHTML = `
    <span style="font-size: 1rem; flex-shrink: 0;">${icons[type] || icons.info}</span>
    <span>${String(message).slice(0, 200)}</span>
  `;

  c.appendChild(el);

  const remove = () => {
    el.classList.add('exit');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  };

  const timer = setTimeout(remove, duration);

  // Allow clicking to dismiss
  el.addEventListener('click', () => {
    clearTimeout(timer);
    remove();
  });

  return remove; // Return dismiss function for manual control
}

export const toast = {
  success: (msg, duration) => show(msg, 'success', duration),
  error: (msg, duration) => show(msg, 'error', duration),
  info: (msg, duration) => show(msg, 'info', duration),
  warning: (msg, duration) => show(msg, 'warning', duration),
};

export default toast;
