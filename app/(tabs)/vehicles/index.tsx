import { Ionicons } from "@expo/vector-icons";
import { SearchBar } from "@rneui/themed";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { VehicleCard } from "../../../components/vehicles/VehicleCard";
import {
  cardStyles,
  listStyles,
  screenStyles,
  textStyles,
} from "../../../constants/styles";
import { colors } from "../../../constants/theme";
import { selectUid, useAuthStore } from "../../../stores/useAuthStore";
import { useVehicleStore } from "../../../stores/useVehicleStore";
import type { VehicleWithCounts } from "../../../types/Vehicle";

const VEHICLE_NEW_HREF = "/(tabs)/vehicles/new";

const renderVehicle = ({ item }: { item: VehicleWithCounts }) => (
  <VehicleCard
    vehicle={item}
    onPress={() => router.push(`/(tabs)/vehicles/${item.id}`)}
  />
);

const ListEmpty = ({ searching }: { searching: boolean }) => (
  <View style={listStyles.empty}>
    <Text style={textStyles.muted}>
      {searching ? "Nenhum veículo encontrado." : "Nenhum veículo cadastrado."}
    </Text>
  </View>
);

export default function VehiclesScreen() {
  const uid = useAuthStore(selectUid);
  const vehicles = useVehicleStore((s) => s.vehicles);
  const loading = useVehicleStore((s) => s.loading);
  const search = useVehicleStore((s) => s.search);
  const [query, setQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      search(uid, query).catch(() =>
        Alert.alert("Erro", "Não foi possível carregar os veículos."),
      );
    }, [uid, query, search]),
  );

  const searching = query.trim().length > 0;
  const showSpinner = loading && vehicles.length === 0;

  return (
    <View style={screenStyles.container}>
      <SearchBar
        placeholder="Buscar por marca ou modelo"
        placeholderTextColor={colors.textSecondary}
        value={query}
        onChangeText={setQuery}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={styles.searchInput}
      />
      {showSpinner ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          renderItem={renderVehicle}
          ListEmptyComponent={<ListEmpty searching={searching} />}
          contentContainerStyle={styles.listContent}
        />
      )}
      <Pressable
        accessibilityLabel="Adicionar veículo"
        onPress={() => router.push(VEHICLE_NEW_HREF)}
        style={({ pressed }) => [styles.fab, pressed && cardStyles.pressed]}
      >
        <Ionicons name="add" size={32} color={colors.background} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: colors.background,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  searchInputContainer: {
    backgroundColor: colors.border,
    borderRadius: 12,
  },
  searchInput: {
    color: colors.text,
    fontSize: 15,
  },
  spinner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 96,
    gap: 12,
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
});
