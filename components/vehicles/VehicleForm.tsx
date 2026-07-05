import { Button, Input } from "@rneui/themed";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { colors } from "../../constants/theme";
import {
  vehicleInputSchema,
  type VehicleInput,
} from "../../schemas/vehicleSchema";
import type { Vehicle } from "../../types/Vehicle";

export type VehicleFormProps = {
  initialValues?: Vehicle;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (input: VehicleInput) => void;
};

type VehicleField = "brand" | "model" | "yearStart" | "yearEnd" | "notes";
type VehicleFormErrors = Partial<Record<VehicleField, string>>;

function digitsOnly(text: string): string {
  return text.replace(/[^0-9]/g, "");
}

export function VehicleForm({
  initialValues,
  submitLabel,
  submitting,
  onSubmit,
}: VehicleFormProps) {
  const [brand, setBrand] = useState(() => initialValues?.brand ?? "");
  const [model, setModel] = useState(() => initialValues?.model ?? "");
  const [yearStart, setYearStart] = useState(() =>
    String(initialValues?.yearStart ?? ""),
  );
  const [yearEnd, setYearEnd] = useState(() =>
    String(initialValues?.yearEnd ?? ""),
  );
  const [notes, setNotes] = useState(() => initialValues?.notes ?? "");
  const [errors, setErrors] = useState<VehicleFormErrors>({});

  function handleSubmit() {
    const trimmedNotes = notes.trim();
    const candidate = {
      brand: brand.trim(),
      model: model.trim(),
      yearStart: yearStart === "" ? undefined : Number(yearStart),
      yearEnd: yearEnd === "" ? undefined : Number(yearEnd),
      notes: trimmedNotes === "" ? undefined : trimmedNotes,
    };
    const result = vehicleInputSchema.safeParse(candidate);
    if (!result.success) {
      const next: VehicleFormErrors = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0]) as VehicleField;
        next[field] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    onSubmit(result.data);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Marca"
          placeholder="Ex.: Fiat"
          value={brand}
          onChangeText={setBrand}
          errorMessage={errors.brand}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <Input
          label="Modelo"
          placeholder="Ex.: Uno"
          value={model}
          onChangeText={setModel}
          errorMessage={errors.model}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <Input
          label="Ano inicial (opcional)"
          placeholder="Ex.: 2015"
          value={yearStart}
          onChangeText={(text) => setYearStart(digitsOnly(text))}
          errorMessage={errors.yearStart}
          keyboardType="number-pad"
          maxLength={4}
        />
        <Input
          label="Ano final (opcional)"
          placeholder="Ex.: 2018"
          value={yearEnd}
          onChangeText={(text) => setYearEnd(digitsOnly(text))}
          errorMessage={errors.yearEnd}
          keyboardType="number-pad"
          maxLength={4}
        />
        <Input
          label="Observações (opcional)"
          placeholder="Detalhes que você queira lembrar"
          value={notes}
          onChangeText={setNotes}
          errorMessage={errors.notes}
          multiline
          inputStyle={styles.notesInput}
        />
        <Button
          title={submitLabel}
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          buttonStyle={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  notesInput: {
    height: 96,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 8,
    marginHorizontal: 10,
    paddingVertical: 12,
  },
});
