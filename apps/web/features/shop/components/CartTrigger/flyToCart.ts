/** Name of the window event an add-to-cart action dispatches once the item is saved. */
export const CART_FLY_EVENT = 'sd:cart-fly';

/**
 * Plays a small dot from the source element to the cart icon. It is a visual
 * cue only, so it does nothing when the reader asks for less motion, and it
 * removes itself when the animation ends.
 */
export function flyToCart(source: HTMLElement | null, target: HTMLElement | null): void {
  if (!source || !target) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const dot = document.createElement('span');
  dot.setAttribute('aria-hidden', 'true');
  dot.className = 'cart-fly-dot';
  dot.style.left = `${from.left + from.width / 2 - 6}px`;
  dot.style.top = `${from.top + from.height / 2 - 6}px`;
  document.body.appendChild(dot);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const animation = dot.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.4)`, opacity: 0.2 },
    ],
    { duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' },
  );
  animation.onfinish = () => dot.remove();
}
