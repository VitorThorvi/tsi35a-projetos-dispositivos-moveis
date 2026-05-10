import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { VehicleCard } from "../../../components/vehicles/VehicleCard";
import { colors } from "../../../constants/theme";
import { useVehicleStore } from "../../../stores/useVehicleStore";
import type { Vehicle } from "../../../types/Vehicle";

const renderVehicle = ({ item }: { item: Vehicle }) => (
  <VehicleCard vehicle={item} />
);

const ListEmpty = () => (
  <View style={styles.empty}>
    <Text style={styles.emptyText}>Nenhum veículo cadastrado.</Text>
  </View>
);

export default function VehiclesScreen() {
  const vehicles = useVehicleStore((s) => s.vehicles);

  return (
    <View style={styles.container}>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={renderVehicle}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
      />
      <Pressable
        accessibilityLabel="Adicionar veículo"
        onPress={() =>
          Alert.alert(
            "Em breve",
            "Cadastro de veículos disponível em breve."
          )
        }
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Ionicons name="add" size={32} color={colors.background} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 96,
    gap: 12,
  },
  empty: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  fabPressed: {
    opacity: 0.7,
  },
});
