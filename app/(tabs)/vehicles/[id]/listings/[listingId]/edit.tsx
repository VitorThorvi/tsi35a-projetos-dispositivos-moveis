import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";

import { ListingForm } from "../../../../../../components/listings/ListingForm";
import { colors } from "../../../../../../constants/theme";
import type { ListingInput } from "../../../../../../schemas/listingSchema";
import { useListingStore } from "../../../../../../stores/useListingStore";
import type { ListingWithEvaluation } from "../../../../../../types/Listing";

export default function EditListingScreen() {
  const { listingId } = useLocalSearchParams<{
    id: string;
    listingId: string;
  }>();
  const getListing = useListingStore((s) => s.getListing);
  const updateListing = useListingStore((s) => s.updateListing);
  const [listing, setListing] = useState<ListingWithEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const found = listingId ? await getListing(listingId) : null;
        if (cancelled) return;
        if (!found) {
          Alert.alert("Erro", "Anúncio não encontrado.");
          router.back();
          return;
        }
        setListing(found);
      } catch {
        if (!cancelled) {
          Alert.alert("Erro", "Anúncio não encontrado.");
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
  }, [listingId, getListing]);

  async function handleSubmit(input: ListingInput) {
    setSubmitting(true);
    try {
      await updateListing(listingId, input);
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o anúncio.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !listing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ListingForm
      initialValues={listing}
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
