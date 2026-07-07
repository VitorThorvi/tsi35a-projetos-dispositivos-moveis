import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { MARKETPLACE_LABELS } from "../../constants/marketplaces";
import { cardStyles, chipStyles, textStyles } from "../../constants/styles";
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
      style={({ pressed }) => [styles.card, pressed && cardStyles.pressed]}
    >
      {hasPhoto && (
        <Image
          source={{ uri: listing.photos[0] }}
          style={styles.thumb}
          contentFit="cover"
        />
      )}
      <View style={cardStyles.body}>
        <Text style={textStyles.titleSm}>
          {listing.brand} {listing.model}
        </Text>
        <Text style={textStyles.muted}>
          {listing.year} · {listing.mileageKm.toLocaleString("pt-BR")} km
        </Text>
        <Text style={styles.price}>{formatPrice(listing.askingPrice)}</Text>
        {marketplaceLabel !== null && (
          <View style={chipStyles.chip}>
            <Text style={chipStyles.chipText}>{marketplaceLabel}</Text>
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
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
  },
});
