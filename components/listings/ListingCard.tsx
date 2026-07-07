import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { MARKETPLACE_LABELS } from "../../constants/marketplaces";
import { colors } from "../../constants/theme";
import type { Listing } from "../../types/Listing";

export type ListingCardProps = {
  listing: Listing;
  onPress?: () => void;
};

function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ListingCard({ listing, onPress }: ListingCardProps) {
  const hasPhoto = listing.photos.length > 0;
  const marketplaceLabel =
    listing.marketplace !== null
      ? MARKETPLACE_LABELS[listing.marketplace]
      : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {hasPhoto && (
        <Image
          source={{ uri: listing.photos[0] }}
          style={styles.thumb}
          contentFit="cover"
        />
      )}
      <View style={styles.body}>
        <Text style={styles.title}>
          {listing.brand} {listing.model}
        </Text>
        <Text style={styles.subtitle}>
          {listing.year} · {listing.mileageKm.toLocaleString("pt-BR")} km
        </Text>
        <Text style={styles.price}>{formatPrice(listing.askingPrice)}</Text>
        {marketplaceLabel !== null && (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{marketplaceLabel}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const THUMB_SIZE = 64;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  cardPressed: {
    opacity: 0.7,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
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
});
