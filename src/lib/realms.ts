export const getRealmBackground = (levelIndex: number) => {
  // A set of colourful SVG background patterns depending on the level (1-10)
  const colors = [
    ['#4ade80', '#065f46'], // Green (Level 1)
    ['#38bdf8', '#075985'], // Blue (Level 2)
    ['#a78bfa', '#4c1d95'], // Purple (Level 3)
    ['#f472b6', '#831843'], // Pink (Level 4)
    ['#fb923c', '#7c2d12'], // Orange (Level 5)
    ['#fcd34d', '#78350f'], // Yellow (Level 6)
    ['#2dd4bf', '#134e4a'], // Teal (Level 7)
    ['#f87171', '#7f1d1d'], // Red (Level 8)
    ['#818cf8', '#312e81'], // Indigo (Level 9)
    ['#ef4444', '#000000'], // Final Boss (Level 10) - intense red/black
  ];
  
  const idx = Math.min(levelIndex, colors.length - 1);
  const [color1, color2] = colors[idx];

  // Using a wavy SVG pattern that animates slightly via CSS
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
    <defs>
      <linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stop-color='${color2}' />
        <stop offset='100%' stop-color='${color1}' />
      </linearGradient>
      <pattern id='pattern' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'>
        <circle cx='20' cy='20' r='10' fill='rgba(255,255,255,0.05)' />
        <circle cx='20' cy='20' r='4' fill='rgba(255,255,255,0.1)' />
      </pattern>
    </defs>
    <rect width='100%' height='100%' fill='url(#grad)' />
    <rect width='100%' height='100%' fill='url(#pattern)' />
  </svg>`;

  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};
