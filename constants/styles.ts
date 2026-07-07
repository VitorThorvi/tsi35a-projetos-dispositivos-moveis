import { StyleSheet } from "react-native";

import { colors } from "./theme";

export const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});

export const detailStyles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 8,
  },
  section: {
    marginTop: 24,
    gap: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
});

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
  },
  form: {
    gap: 8,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  formError: {
    color: colors.error,
    fontSize: 14,
    textAlign: "center",
  },
  submitButton: {
    marginTop: 8,
    paddingVertical: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  footerText: {
    color: colors.textSecondary,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: "600",
  },
});

export const formStyles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 8,
  },
  notesInput: {
    height: 96,
    textAlignVertical: "top",
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textSecondary,
    marginLeft: 10,
    marginBottom: 4,
  },
  fieldError: {
    color: colors.error,
    fontSize: 12,
    marginLeft: 10,
    marginTop: 4,
  },
  submitButton: {
    paddingVertical: 12,
  },
  submitContainer: {
    marginTop: 16,
    marginHorizontal: 10,
  },
});

export const cardStyles = StyleSheet.create({
  body: {
    flex: 1,
    gap: 4,
  },
  pressed: {
    opacity: 0.7,
  },
});

export const chipStyles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
});

export const listStyles = StyleSheet.create({
  empty: {
    paddingVertical: 48,
    alignItems: "center",
  },
});

export const textStyles = StyleSheet.create({
  titleLg: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  titleSm: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  muted: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  badgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "600",
  },
});
