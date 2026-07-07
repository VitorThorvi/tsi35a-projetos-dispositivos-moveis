import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ListingCard } from "../../components/listings/ListingCard";
import { StatCard } from "../../components/ui/StatCard";
import { listStyles, screenStyles, textStyles } from "../../constants/styles";
import { colors } from "../../constants/theme";
import { selectUid, useAuthStore } from "../../stores/useAuthStore";
import { useDashboardStore } from "../../stores/useDashboardStore";
import type { Listing } from "../../types/Listing";

const renderRecent = ({ item }: { item: Listing }) => (
  <ListingCard
    listing={item}
    onPress={() =>
      router.push(`/(tabs)/vehicles/${item.vehicleId}/listings/${item.id}`)
    }
  />
);

const ListEmpty = () => (
  <View style={listStyles.empty}>
    <Text style={textStyles.muted}>Nenhum anúncio recente.</Text>
  </View>
);

function formatScore(averageScore: number | null | undefined): string {
  if (averageScore === null || averageScore === undefined) {
    return "—";
  }
  return averageScore.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export default function DashboardScreen() {
  const uid = useAuthStore(selectUid);
  const user = useAuthStore((s) => s.user);
  const stats = useDashboardStore((s) => s.stats);
  const recentListings = useDashboardStore((s) => s.recentListings);
  const loading = useDashboardStore((s) => s.loading);
  const loadDashboard = useDashboardStore((s) => s.loadDashboard);

  useFocusEffect(
    useCallback(() => {
      loadDashboard(uid).catch(() =>
        Alert.alert("Erro", "Não foi possível carregar o painel."),
      );
    }, [uid, loadDashboard]),
  );

  const greetingName = user?.displayName ?? user?.email ?? "";

  if (loading && !stats) {
    return (
      <View style={screenStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={recentListings}
      keyExtractor={(item) => item.id}
      renderItem={renderRecent}
      ListEmptyComponent={ListEmpty}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.hero}>
            <Text style={styles.greeting}>Olá, {greetingName}</Text>
            <Text style={styles.subtitle}>
              Você tem {stats?.listingCount ?? 0} anúncios salvos
            </Text>
          </View>
          <View style={styles.statsRow}>
            <StatCard
              label="Veículos"
              value={stats?.vehicleCount ?? 0}
              iconName="car-outline"
            />
            <StatCard
              label="Anúncios"
              value={stats?.listingCount ?? 0}
              iconName="pricetag-outline"
            />
            <StatCard
              label="Recomendados"
              value={stats?.recommendedCount ?? 0}
              iconName="star-outline"
            />
          </View>
          <View style={styles.scoreCard}>
            <Text style={textStyles.muted}>Score médio</Text>
            <Text style={styles.scoreValue}>
              {formatScore(stats?.averageScore)}
            </Text>
          </View>
          <Text style={styles.sectionTitle}>Anúncios recentes</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    gap: 12,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  header: {
    gap: 16,
    marginBottom: 4,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.background,
  },
  subtitle: {
    fontSize: 14,
    color: colors.background,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  scoreCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginTop: 8,
  },
});
