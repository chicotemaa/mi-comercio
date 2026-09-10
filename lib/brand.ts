export const palettes = {
  bronze: "Bronce cálido",
  forest: "Verde oliva",
  graphite: "Grafito",
} as const;
export type Brand = {
  name: string;
  initials: string;
  shortName: string;
  palette: keyof typeof palettes;
};
export function brandFromRecord(row: Record<string, unknown>): Brand {
  const palette = String(row.brand_palette || "bronze");
  return {
    name: String(row.name || "Mi Comercio"),
    initials: String(row.brand_initials || "NA"),
    shortName: String(row.short_name || row.name || "Mi Comercio"),
    palette: Object.hasOwn(palettes, palette)
      ? (palette as Brand["palette"])
      : "bronze",
  };
}
