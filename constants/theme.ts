import { createTheme } from "@rneui/themed";

export const colors = {
  primary: "#2563EB",
  background: "#FFFFFF",
  text: "#0F172A",
  textSecondary: "#64748B",
} as const;

export type ThemeColors = typeof colors;

export const theme = createTheme({
  lightColors: {
    primary: colors.primary,
    background: colors.background,
  },
  darkColors: {
    primary: "#3B82F6",
    background: "#0F172A",
  },
  mode: "light",
});
