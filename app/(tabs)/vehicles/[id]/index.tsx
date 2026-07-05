import { Button } from "@rneui/themed";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../../../../constants/theme";
import { useVehicleStore } from "../../../../stores/useVehicleStore";
import type { Vehicle } from "../../../../types/Vehicle";

const listingNewHref = (vehicleId: string) =>
  `/(tabs)/vehicles/${vehicleId}/listings/new` as never;

function formatYearRange(
  yearStart: number | null,
  yearEnd: number | null,
): string | null {
  if (yearStart !== null && yearEnd !== null) return `${yearStart}–${yearEnd}`;
  if (yearStart !== null) return String(yearStart);
  if (yearEnd !== null) return `até ${yearEnd}`;
  return null;
}

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const getVehicle = useVehicleStore((s) => s.getVehicle);
  const removeVehicle = useVehicleStore((s) => s.removeVehicle);
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
      return () => {
        cancelled = true;
      };
    }, [id, getVehicle]),
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
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const yearLabel = formatYearRange(vehicle.yearStart, vehicle.yearEnd);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        {vehicle.brand} {vehicle.model}
      </Text>
      {yearLabel !== null && <Text style={styles.yearLine}>{yearLabel}</Text>}

      {vehicle.notes ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <Text style={styles.notes}>{vehicle.notes}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button
          title="Editar"
          type="outline"
          onPress={() => router.push(`/(tabs)/vehicles/${id}/edit`)}
          disabled={deleting}
          containerStyle={styles.actionButton}
        />
        <Button
          title="Excluir"
          onPress={confirmDelete}
          disabled={deleting}
          buttonStyle={styles.deleteButton}
          containerStyle={styles.actionButton}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Anúncios</Text>
        <Text style={styles.emptyNotice}>Nenhum anúncio cadastrado.</Text>
        <Button
          title="Adicionar anúncio"
          type="outline"
          onPress={() => router.push(listingNewHref(id))}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  yearLine: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginTop: 24,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  notes: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
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
  emptyNotice: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
