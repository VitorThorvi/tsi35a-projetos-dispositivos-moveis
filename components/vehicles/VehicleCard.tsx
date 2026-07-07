import { Pressable, StyleSheet, Text, View } from "react-native";

import { cardStyles, textStyles } from "../../constants/styles";
import { colors } from "../../constants/theme";
import type { VehicleWithCounts } from "../../types/Vehicle";

type VehicleCardProps = {
  vehicle: VehicleWithCounts;
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
      style={({ pressed }) => [styles.card, pressed && cardStyles.pressed]}
    >
      <View style={cardStyles.body}>
        <Text style={textStyles.titleSm}>
          {vehicle.brand} {vehicle.model}
        </Text>
        {vehicle.yearStart !== null && (
          <Text style={textStyles.muted}>{vehicle.yearStart}</Text>
        )}
      </View>
      <View style={styles.badge}>
        <Text style={textStyles.badgeText}>{listingsLabel}</Text>
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
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
});
