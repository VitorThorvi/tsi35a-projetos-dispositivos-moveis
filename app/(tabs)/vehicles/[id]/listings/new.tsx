import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { ListingForm } from "../../../../../components/listings/ListingForm";
import type { ListingInput } from "../../../../../schemas/listingSchema";
import { useListingStore } from "../../../../../stores/useListingStore";

export default function NewListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const addListing = useListingStore((s) => s.addListing);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(input: ListingInput) {
    setSubmitting(true);
    try {
      await addListing(input, id);
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o anúncio.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ListingForm
      submitLabel="Cadastrar"
      submitting={submitting}
      onSubmit={handleSubmit}
    />
  );
}
