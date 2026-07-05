import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";

import { VehicleForm } from "../../../../components/vehicles/VehicleForm";
import { colors } from "../../../../constants/theme";
import type { VehicleInput } from "../../../../schemas/vehicleSchema";
import { useVehicleStore } from "../../../../stores/useVehicleStore";
import type { Vehicle } from "../../../../types/Vehicle";

export default function EditVehicleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const getVehicle = useVehicleStore((s) => s.getVehicle);
  const updateVehicle = useVehicleStore((s) => s.updateVehicle);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
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
  }, [id, getVehicle]);

  async function handleSubmit(input: VehicleInput) {
    setSubmitting(true);
    try {
      await updateVehicle(id, input);
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o veículo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !vehicle) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <VehicleForm
      initialValues={vehicle}
      submitLabel="Salvar"
      submitting={submitting}
      onSubmit={handleSubmit}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
