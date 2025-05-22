/**
 * Color utility service for meal planning
 */

/**
 * Generate a random visually distinct color in HSL format
 * Using HSL makes it easier to ensure colors are visually distinct
 */
export const generateRandomColor = (): string => {
  // Generate a random hue (0-360)
  const hue = Math.floor(Math.random() * 360);
  
  // Use fixed saturation and lightness for visibility
  const saturation = 65 + Math.floor(Math.random() * 20); // 65-85%
  const lightness = 45 + Math.floor(Math.random() * 15); // 45-60%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * Convert HSL color to hex color for components that require hex
 */
export const hslToHex = (hslColor: string): string => {
  // Extract HSL values
  const hslMatch = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!hslMatch) return '#5E35B1'; // Default color if parsing fails
  
  const h = parseInt(hslMatch[1]) / 360;
  const s = parseInt(hslMatch[2]) / 100;
  const l = parseInt(hslMatch[3]) / 100;
  
  // HSL to RGB conversion algorithm
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  // Convert to hex
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
