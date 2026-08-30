// Ported directly from sunny2's CATEGORY_EMOJI constant -- the real design's own
// fallback for a product with no image (see pdCardHTML: `imgHtml = img ? <img> :
// <div class="pcard-img-inner">${CATEGORY_EMOJI[category]}</div>`).
export const CATEGORY_EMOJI: Record<string, string> = {
  flower: '🌿',
  vapes: '💨',
  edibles: '🍬',
  prerolls: '🌀',
  concentrates: '🍯',
  topicals: '🧴',
  capsules: '💊',
  tinctures: '💧',
  beverages: '🥤',
  accessories: '🎁',
  ingestibles: '🍽️',
  troches: '🍫',
};
