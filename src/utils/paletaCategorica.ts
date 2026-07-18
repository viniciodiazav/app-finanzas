// Paleta categórica validada (CVD-safe, orden fijo — ver skill de dataviz)
export const PALETA_CATEGORICA = [
  '#2a78d6', // blue
  '#008300', // green
  '#e87ba4', // magenta
  '#eda100', // yellow
  '#1baf7a', // aqua
  '#eb6834', // orange
  '#4a3aa7', // violet
  '#e34948', // red
] as const;

export const COLOR_OTRAS = '#898781'; // gris muted, para categorías fuera del techo de 7

export const COLOR_ESTADO_BIEN = '#0ca30c';
export const COLOR_ESTADO_CRITICO = '#d03b3b';
export const COLOR_TRACK_CLARO = '#cde2fb'; // paso claro del ramp azul, para el fondo de medidores

const TECHO_SLOTS = 7;

export function colorParaIndice(indice: number): string {
  if (indice < TECHO_SLOTS) return PALETA_CATEGORICA[indice];
  return COLOR_OTRAS;
}
