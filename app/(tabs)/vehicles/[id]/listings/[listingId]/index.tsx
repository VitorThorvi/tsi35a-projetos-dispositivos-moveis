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

import { RecommendationBadge } from "../../../../../../components/evaluation/RecommendationBadge";
import { MARKETPLACE_LABELS } from "../../../../../../constants/marketplaces";
import {
  chipStyles,
  detailStyles,
  screenStyles,
  textStyles,
} from "../../../../../../constants/styles";
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
      <View style={screenStyles.centered}>
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
    <ScrollView
      style={screenStyles.container}
      contentContainerStyle={detailStyles.content}
    >
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

      <Text style={textStyles.titleLg}>
        {listing.brand} {listing.model}
      </Text>
      <Text style={styles.price}>{formatPrice(listing.askingPrice)}</Text>
      <Text style={styles.facts}>{factParts.join(" · ")}</Text>
      {marketplaceLabel !== null && (
        <View style={chipStyles.chip}>
          <Text style={chipStyles.chipText}>{marketplaceLabel}</Text>
        </View>
      )}

      {sourceUrl !== null && sourceUrl !== "" && (
        <Pressable onPress={() => handleOpenSource(sourceUrl)}>
          <Text style={styles.link}>Abrir anúncio original</Text>
        </Pressable>
      )}

      <View style={detailStyles.section}>
        <Text style={textStyles.titleSm}>Avaliação</Text>
        {listing.evaluation === null ? (
          <>
            <Text style={textStyles.muted}>Nenhuma avaliação registrada.</Text>
            <Button
              title="Avaliar"
              type="outline"
              onPress={() =>
                router.push(
                  `/(tabs)/vehicles/${id}/listings/${listingId}/evaluate`,
                )
              }
              disabled={deleting}
              containerStyle={styles.evaluateButton}
            />
          </>
        ) : (
          <>
            <View style={styles.scoreRow}>
              <Text style={styles.score}>
                {listing.evaluation.score.toLocaleString("pt-BR", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
              </Text>
              <RecommendationBadge score={listing.evaluation.score} />
            </View>
            {listing.evaluation.pros.length > 0 && (
              <Text style={textStyles.muted}>
                Prós: {listing.evaluation.pros.join(" · ")}
              </Text>
            )}
            {listing.evaluation.cons.length > 0 && (
              <Text style={textStyles.muted}>
                Contras: {listing.evaluation.cons.join(" · ")}
              </Text>
            )}
            <Button
              title="Editar avaliação"
              type="outline"
              onPress={() =>
                router.push(
                  `/(tabs)/vehicles/${id}/listings/${listingId}/evaluate`,
                )
              }
              disabled={deleting}
              containerStyle={styles.evaluateButton}
            />
          </>
        )}
      </View>

      <View style={detailStyles.actions}>
        <Button
          title="Editar"
          type="outline"
          onPress={() =>
            router.push(`/(tabs)/vehicles/${id}/listings/${listingId}/edit`)
          }
          disabled={deleting}
          containerStyle={detailStyles.actionButton}
        />
        <Button
          title="Excluir"
          onPress={confirmDelete}
          disabled={deleting}
          buttonStyle={detailStyles.deleteButton}
          containerStyle={detailStyles.actionButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  facts: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  link: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 4,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  score: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  evaluateButton: {
    marginTop: 8,
  },
});
