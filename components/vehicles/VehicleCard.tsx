import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../constants/theme";
import type { Vehicle } from "../../types/Vehicle";

type VehicleCardProps = {
  vehicle: Vehicle;
  onPress?: () => void;
};

export function VehicleCard({ vehicle, onPress }: VehicleCardProps) {
  const listingsLabel =
    vehicle.listingsCount === 1
      ? "1 anúncio"
      : `${vehicle.listingsCount} anúncios`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.body}>
        <Text style={styles.title}>
          {vehicle.brand} {vehicle.model}
        </Text>
        <Text style={styles.subtitle}>{vehicle.year}</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{listingsLabel}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  cardPressed: {
    opacity: 0.7,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  badgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "600",
  },
});
