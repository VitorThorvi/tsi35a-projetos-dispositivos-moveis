import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../constants/theme";

type StatCardProps = {
  label: string;
  value: string | number;
  iconName?: ComponentProps<typeof Ionicons>["name"];
};

export function StatCard({ label, value, iconName }: StatCardProps) {
  return (
    <View style={styles.container}>
      {iconName ? (
        <Ionicons name={iconName} size={20} color={colors.primary} />
      ) : null}
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.text,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
