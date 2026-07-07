import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { StatCard } from "../../components/ui/StatCard";
import { screenStyles } from "../../constants/styles";
import { colors } from "../../constants/theme";
import { selectUid, useAuthStore } from "../../stores/useAuthStore";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { authErrorMessage } from "../../utils/authErrorMessages";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

function firebaseErrorCode(err: unknown): string | undefined {
  if (typeof err === "object" && err !== null && "code" in err) {
    const code = (err as { code: unknown }).code;
    if (typeof code === "string") return code;
  }
  return undefined;
}

export default function ProfileScreen() {
  const uid = useAuthStore(selectUid);
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const stats = useDashboardStore((s) => s.stats);
  const loadStats = useDashboardStore((s) => s.loadStats);
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadStats(uid).catch(() => {});
    }, [uid, loadStats]),
  );

  const isGuest = status === "guest";
  const accountName = user?.displayName ?? user?.email ?? "";
  const accountEmail = user?.email ?? "";

  function handleChangePassword() {
    const email = user?.email;
    if (!email) return;
    Alert.alert(
      "Alterar senha",
      `Enviaremos um e-mail para redefinir sua senha para ${email}.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar",
          onPress: async () => {
            if (submitting) return;
            setSubmitting(true);
            try {
              await resetPassword(email);
              Alert.alert(
                "Pronto",
                "Enviamos um e-mail para redefinir sua senha.",
              );
            } catch (err) {
              const code = firebaseErrorCode(err);
              Alert.alert(
                "Erro",
                code
                  ? authErrorMessage(code)
                  : "Não foi possível enviar o e-mail. Tente novamente.",
              );
            } finally {
              setSubmitting(false);
            }
          },
        },
      ],
    );
  }

  async function handleLogout() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await logout();
    } catch {
      Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
      setSubmitting(false);
    }
  }

  return (
    <ScrollView style={screenStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          {isGuest ? (
            <Ionicons name="person" size={40} color={colors.primary} />
          ) : (
            <Text style={styles.avatarText}>
              {initialsFromName(accountName)}
            </Text>
          )}
        </View>
        <Text style={styles.name}>{isGuest ? "Convidado" : accountName}</Text>
        {!isGuest && accountEmail ? (
          <Text style={styles.email}>{accountEmail}</Text>
        ) : null}
      </View>

      {isGuest ? (
        <Text style={styles.notice}>
          Você está usando o app sem conta. Seus dados ficam somente neste
          dispositivo.
        </Text>
      ) : null}

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

      <View style={styles.actions}>
        {isGuest ? (
          <Pressable
            onPress={handleLogout}
            disabled={submitting}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.text} />
            <Text style={styles.rowLabel}>Sair do modo convidado</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        ) : (
          <>
            <Pressable
              onPress={handleChangePassword}
              disabled={submitting}
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
            >
              <Ionicons name="key-outline" size={22} color={colors.text} />
              <Text style={styles.rowLabel}>Alterar senha</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
            <Pressable
              onPress={handleLogout}
              disabled={submitting}
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
            >
              <Ionicons name="log-out-outline" size={22} color={colors.text} />
              <Text style={styles.rowLabel}>Sair</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  header: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.primary,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.background,
  },
  email: {
    fontSize: 14,
    color: colors.background,
  },
  notice: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  actions: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  rowPressed: {
    opacity: 0.6,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
});
