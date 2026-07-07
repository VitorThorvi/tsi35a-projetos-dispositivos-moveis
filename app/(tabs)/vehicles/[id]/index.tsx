import { Button } from "@rneui/themed";
import {
  type Href,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ListingCard } from "../../../../components/listings/ListingCard";
import {
  detailStyles,
  screenStyles,
  textStyles,
} from "../../../../constants/styles";
import { colors } from "../../../../constants/theme";
import { useListingStore } from "../../../../stores/useListingStore";
import { useVehicleStore } from "../../../../stores/useVehicleStore";
import type { Listing } from "../../../../types/Listing";
import type { Vehicle } from "../../../../types/Vehicle";

const EMPTY: Listing[] = [];

const listingNewHref = (vehicleId: string): Href =>
  `/(tabs)/vehicles/${vehicleId}/listings/new`;

function formatYearRange(
  yearStart: number | null,
  yearEnd: number | null,
): string | null {
  if (yearStart !== null && yearEnd !== null) return `${yearStart}–${yearEnd}`;
  if (yearStart !== null) return String(yearStart);
  if (yearEnd !== null) return `até ${yearEnd}`;
  return null;
}

type VehicleDetailHeaderProps = {
  vehicle: Vehicle;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

function VehicleDetailHeader({
  vehicle,
  deleting,
  onEdit,
  onDelete,
}: VehicleDetailHeaderProps) {
  const yearLabel = formatYearRange(vehicle.yearStart, vehicle.yearEnd);

  return (
    <View style={styles.header}>
      <Text style={textStyles.titleLg}>
        {vehicle.brand} {vehicle.model}
      </Text>
      {yearLabel !== null && <Text style={styles.yearLine}>{yearLabel}</Text>}

      {vehicle.notes ? (
        <View style={detailStyles.section}>
          <Text style={textStyles.titleSm}>Observações</Text>
          <Text style={styles.notes}>{vehicle.notes}</Text>
        </View>
      ) : null}

      <View style={detailStyles.actions}>
        <Button
          title="Editar"
          type="outline"
          onPress={onEdit}
          disabled={deleting}
          containerStyle={detailStyles.actionButton}
        />
        <Button
          title="Excluir"
          onPress={onDelete}
          disabled={deleting}
          buttonStyle={detailStyles.deleteButton}
          containerStyle={detailStyles.actionButton}
        />
      </View>

      <View style={detailStyles.section}>
        <Text style={textStyles.titleSm}>Anúncios</Text>
      </View>
    </View>
  );
}

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const getVehicle = useVehicleStore((s) => s.getVehicle);
  const removeVehicle = useVehicleStore((s) => s.removeVehicle);
  const loadByVehicle = useListingStore((s) => s.loadByVehicle);
  const listings = useListingStore((s) => s.listingsByVehicle[id]) ?? EMPTY;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const load = async () => {
        try {
          const found = id ? await getVehicle(id) : null;
          if (cancelled) return;
          if (!found) {
            Alert.alert("Erro", "Veículo não encontrado.");
            router.back();
            return;
          }
          setVehicle(found);
        } catch {
          if (!cancelled) {
            Alert.alert("Erro", "Veículo não encontrado.");
            router.back();
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      void load();
      loadByVehicle(id).catch(() =>
        Alert.alert("Erro", "Não foi possível carregar os anúncios."),
      );
      return () => {
        cancelled = true;
      };
    }, [id, getVehicle, loadByVehicle]),
  );

  const renderListing = useCallback(
    ({ item }: { item: Listing }) => (
      <ListingCard
        listing={item}
        onPress={() =>
          router.push(`/(tabs)/vehicles/${id}/listings/${item.id}`)
        }
      />
    ),
    [id],
  );

  function confirmDelete() {
    Alert.alert(
      "Excluir veículo",
      "Os anúncios e avaliações deste veículo também serão excluídos. Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await removeVehicle(id);
              router.back();
            } catch {
              Alert.alert("Erro", "Não foi possível excluir o veículo.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  }

  if (loading || !vehicle) {
    return (
      <View style={screenStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={screenStyles.container}
      contentContainerStyle={detailStyles.content}
      data={listings}
      keyExtractor={(item) => item.id}
      renderItem={renderListing}
      ListHeaderComponent={
        <VehicleDetailHeader
          vehicle={vehicle}
          deleting={deleting}
          onEdit={() => router.push(`/(tabs)/vehicles/${id}/edit`)}
          onDelete={confirmDelete}
        />
      }
      ListEmptyComponent={
        <Text style={textStyles.muted}>Nenhum anúncio cadastrado.</Text>
      }
      ListFooterComponent={
        <Button
          title="Adicionar anúncio"
          type="outline"
          onPress={() => router.push(listingNewHref(id))}
          disabled={deleting}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  yearLine: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  notes: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
});
