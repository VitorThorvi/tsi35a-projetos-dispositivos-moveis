import { Button } from "@rneui/themed";
import { Image } from "expo-image";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MARKETPLACE_LABELS } from "../../../../../../constants/marketplaces";
import { colors } from "../../../../../../constants/theme";
import { useListingStore } from "../../../../../../stores/useListingStore";
import type { ListingWithEvaluation } from "../../../../../../types/Listing";

function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const renderPhoto = ({ item }: { item: string }) => (
  <Image source={{ uri: item }} style={styles.photo} contentFit="cover" />
);

export default function ListingDetailScreen() {
  const { id, listingId } = useLocalSearchParams<{
    id: string;
    listingId: string;
  }>();
  const getListing = useListingStore((s) => s.getListing);
  const removeListing = useListingStore((s) => s.removeListing);
  const [listing, setListing] = useState<ListingWithEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
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
    }, [listingId, getListing]),
  );

  function confirmDelete() {
    Alert.alert(
      "Excluir anúncio",
      "A avaliação deste anúncio também será excluída. Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (!listing) return;
            setDeleting(true);
            try {
              await removeListing(listingId, listing.vehicleId);
              router.back();
            } catch {
              Alert.alert("Erro", "Não foi possível excluir o anúncio.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  }

  async function handleOpenSource(url: string) {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Erro", "Não foi possível abrir o link.");
    }
  }

  if (loading || !listing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const marketplaceLabel =
    listing.marketplace !== null
      ? MARKETPLACE_LABELS[listing.marketplace]
      : null;
  const sourceUrl = listing.sourceUrl;
  const factParts = [
    `${listing.mileageKm.toLocaleString("pt-BR")} km`,
    `Ano ${listing.year}`,
  ];
  if (listing.location !== null) factParts.push(listing.location);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {listing.photos.length > 0 && (
        <FlatList
          horizontal
          data={listing.photos}
          keyExtractor={(uri) => uri}
          renderItem={renderPhoto}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoStrip}
        />
      )}

      <Text style={styles.title}>
        {listing.brand} {listing.model}
      </Text>
      <Text style={styles.price}>{formatPrice(listing.askingPrice)}</Text>
      <Text style={styles.facts}>{factParts.join(" · ")}</Text>
      {marketplaceLabel !== null && (
        <View style={styles.chip}>
          <Text style={styles.chipText}>{marketplaceLabel}</Text>
        </View>
      )}

      {sourceUrl !== null && sourceUrl !== "" && (
        <Pressable onPress={() => handleOpenSource(sourceUrl)}>
          <Text style={styles.link}>Abrir anúncio original</Text>
        </Pressable>
      )}

      {listing.evaluation === null && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avaliação</Text>
          <Text style={styles.emptyNotice}>Nenhuma avaliação registrada.</Text>
        </View>
      )}

      <View style={styles.actions}>
        <Button
          title="Editar"
          type="outline"
          onPress={() =>
            router.push(`/(tabs)/vehicles/${id}/listings/${listingId}/edit`)
          }
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
  photoStrip: {
    gap: 12,
    paddingBottom: 8,
  },
  photo: {
    width: 240,
    height: 160,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  facts: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  link: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 4,
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
  emptyNotice: {
    fontSize: 14,
    color: colors.textSecondary,
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
});
