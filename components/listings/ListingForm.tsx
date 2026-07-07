import { Button, ButtonGroup, Input } from "@rneui/themed";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

import { MARKETPLACE_LABELS } from "../../constants/marketplaces";
import { formStyles, screenStyles } from "../../constants/styles";
import { colors } from "../../constants/theme";
import {
  listingInputSchema,
  type ListingInput,
} from "../../schemas/listingSchema";
import { MARKETPLACES, type Listing } from "../../types/Listing";
import { PhotoPicker } from "../ui/PhotoPicker";

export type ListingFormProps = {
  initialValues?: Listing;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (input: ListingInput) => void;
};

type ListingField =
  | "marketplace"
  | "sourceUrl"
  | "brand"
  | "model"
  | "year"
  | "mileageKm"
  | "askingPrice"
  | "location"
  | "photos";
type ListingFormErrors = Partial<Record<ListingField, string>>;

const MARKETPLACE_BUTTONS = MARKETPLACES.map(
  (marketplace) => MARKETPLACE_LABELS[marketplace],
);

function digitsOnly(text: string): string {
  return text.replace(/[^0-9]/g, "");
}

export function ListingForm({
  initialValues,
  submitLabel,
  submitting,
  onSubmit,
}: ListingFormProps) {
  const [marketplaceIndex, setMarketplaceIndex] = useState<number | null>(() =>
    initialValues?.marketplace
      ? MARKETPLACES.indexOf(initialValues.marketplace)
      : null,
  );
  const [sourceUrl, setSourceUrl] = useState(
    () => initialValues?.sourceUrl ?? "",
  );
  const [brand, setBrand] = useState(() => initialValues?.brand ?? "");
  const [model, setModel] = useState(() => initialValues?.model ?? "");
  const [year, setYear] = useState(() => String(initialValues?.year ?? ""));
  const [mileageKm, setMileageKm] = useState(() =>
    String(initialValues?.mileageKm ?? ""),
  );
  const [askingPrice, setAskingPrice] = useState(() =>
    String(initialValues?.askingPrice ?? ""),
  );
  const [location, setLocation] = useState(
    () => initialValues?.location ?? "",
  );
  const [photos, setPhotos] = useState<string[]>(
    () => initialValues?.photos ?? [],
  );
  const [errors, setErrors] = useState<ListingFormErrors>({});

  function handleSubmit() {
    const candidate = {
      marketplace:
        marketplaceIndex === null ? undefined : MARKETPLACES[marketplaceIndex],
      sourceUrl: sourceUrl.trim() === "" ? undefined : sourceUrl.trim(),
      brand: brand.trim(),
      model: model.trim(),
      year: year === "" ? undefined : Number(year),
      mileageKm,
      askingPrice,
      location: location.trim() === "" ? undefined : location.trim(),
      photos,
    };
    const result = listingInputSchema.safeParse(candidate);
    if (!result.success) {
      const next: ListingFormErrors = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0]) as ListingField;
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
      style={screenStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={formStyles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={formStyles.fieldLabel}>Marketplace</Text>
        <ButtonGroup
          buttons={MARKETPLACE_BUTTONS}
          selectedIndex={marketplaceIndex}
          onPress={(index: number) => setMarketplaceIndex(index)}
          disabled={submitting}
          selectedButtonStyle={styles.marketplaceSelected}
          containerStyle={styles.marketplaceGroup}
        />
        {errors.marketplace ? (
          <Text style={formStyles.fieldError}>{errors.marketplace}</Text>
        ) : null}

        <Input
          label="URL do anúncio (opcional)"
          placeholder="https://..."
          value={sourceUrl}
          onChangeText={setSourceUrl}
          errorMessage={errors.sourceUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        <Input
          label="Marca"
          placeholder="Ex.: Toyota"
          value={brand}
          onChangeText={setBrand}
          errorMessage={errors.brand}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <Input
          label="Modelo"
          placeholder="Ex.: Corolla"
          value={model}
          onChangeText={setModel}
          errorMessage={errors.model}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <Input
          label="Ano"
          placeholder="Ex.: 2019"
          value={year}
          onChangeText={(text) => setYear(digitsOnly(text))}
          errorMessage={errors.year}
          keyboardType="number-pad"
          maxLength={4}
        />
        <Input
          label="Quilometragem (km)"
          placeholder="Ex.: 45000"
          value={mileageKm}
          onChangeText={(text) => setMileageKm(digitsOnly(text))}
          errorMessage={errors.mileageKm}
          keyboardType="number-pad"
        />
        <Input
          label="Preço pedido (R$)"
          placeholder="Ex.: 98000"
          value={askingPrice}
          onChangeText={(text) => setAskingPrice(digitsOnly(text))}
          errorMessage={errors.askingPrice}
          keyboardType="number-pad"
        />
        <Input
          label="Localização (opcional)"
          placeholder="Ex.: São Paulo, SP"
          value={location}
          onChangeText={setLocation}
          errorMessage={errors.location}
        />

        <Text style={formStyles.fieldLabel}>Fotos</Text>
        <PhotoPicker
          photos={photos}
          onChange={setPhotos}
          disabled={submitting}
        />

        <Button
          title={submitLabel}
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          buttonStyle={formStyles.submitButton}
          containerStyle={formStyles.submitContainer}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  marketplaceGroup: {
    borderRadius: 8,
    borderColor: colors.border,
  },
  marketplaceSelected: {
    backgroundColor: colors.primary,
  },
});
