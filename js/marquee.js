export function initMarquee() {
  const track = document.querySelector('.marquee__track');
  if (!track) return;

  // Duplicate cards for seamless infinite loop
  const original = track.innerHTML;
  track.innerHTML = original + original;
}
