/**
 * Icon keys understood by src/lib/icons.ts. Keep the two lists in sync —
 * anything else falls back to the sparkles glyph.
 */
export const iconOptions = [
  { title: "Bar chart", value: "barChart" },
  { title: "Line chart", value: "lineChart" },
  { title: "Pie chart", value: "pieChart" },
  { title: "Activity", value: "activity" },
  { title: "Target", value: "target" },
  { title: "Database", value: "database" },
  { title: "Workflow", value: "workflow" },
  { title: "Globe", value: "globe" },
  { title: "Leaf", value: "leaf" },
  { title: "Shield", value: "shield" },
  { title: "Map", value: "map" },
  { title: "Users", value: "users" },
  { title: "Clipboard", value: "clipboard" },
  { title: "Gauge", value: "gauge" },
  { title: "Layers", value: "layers" },
  { title: "Search", value: "search" },
  { title: "File chart", value: "fileChart" },
  { title: "Sparkles", value: "sparkles" },
] as const;
