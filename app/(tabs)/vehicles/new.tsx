import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { VehicleForm } from "../../../components/vehicles/VehicleForm";
import type { VehicleInput } from "../../../schemas/vehicleSchema";
import { selectUid, useAuthStore } from "../../../stores/useAuthStore";
import { useVehicleStore } from "../../../stores/useVehicleStore";

export default function NewVehicleScreen() {
  const uid = useAuthStore(selectUid);
  const addVehicle = useVehicleStore((s) => s.addVehicle);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(input: VehicleInput) {
    setSubmitting(true);
    try {
      await addVehicle(input, uid);
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o veículo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <VehicleForm
      submitLabel="Cadastrar"
      submitting={submitting}
      onSubmit={handleSubmit}
    />
  );
}
