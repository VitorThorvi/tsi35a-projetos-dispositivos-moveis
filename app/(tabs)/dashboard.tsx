import { FlatList, StyleSheet, Text, View } from "react-native";

import { StatCard } from "../../components/ui/StatCard";
import { VehicleCard } from "../../components/vehicles/VehicleCard";
import { colors } from "../../constants/theme";
import { useAuthStore } from "../../stores/useAuthStore";
import { useVehicleStore } from "../../stores/useVehicleStore";
import type { Vehicle } from "../../types/Vehicle";

const renderVehicle = ({ item }: { item: Vehicle }) => (
  <VehicleCard vehicle={item} />
);

const ListEmpty = () => (
  <View style={styles.empty}>
    <Text style={styles.emptyText}>Nenhum anúncio recente.</Text>
  </View>
);

export default function DashboardScreen() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const vehicles = useVehicleStore((s) => s.vehicles);
  const recents = vehicles.slice(0, 3);

  return (
    <FlatList
      data={recents}
      keyExtractor={(item) => item.id}
      renderItem={renderVehicle}
      ListEmptyComponent={ListEmpty}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Olá, {currentUser?.email ?? ""}
          </Text>
          <View style={styles.statsRow}>
            <StatCard
              label="Veículos"
              value={vehicles.length}
              iconName="car-outline"
            />
            <StatCard
              label="Anúncios"
              value={12}
              iconName="pricetag-outline"
            />
            <StatCard
              label="Score médio"
              value="8.4"
              iconName="star-outline"
            />
          </View>
          <Text style={styles.sectionTitle}>Anúncios recentes</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    gap: 12,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  header: {
    gap: 16,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 18,
    color: colors.text,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginTop: 8,
  },
  empty: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
