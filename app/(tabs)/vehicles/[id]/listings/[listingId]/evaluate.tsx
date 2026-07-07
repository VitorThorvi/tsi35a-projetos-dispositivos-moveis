import { Button, Input } from "@rneui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { RatingInput } from "../../../../../../components/evaluation/RatingInput";
import { RecommendationBadge } from "../../../../../../components/evaluation/RecommendationBadge";
import { formStyles, screenStyles } from "../../../../../../constants/styles";
import { colors } from "../../../../../../constants/theme";
import { evaluationInputSchema } from "../../../../../../schemas/evaluationSchema";
import { useEvaluationStore } from "../../../../../../stores/useEvaluationStore";
import { calculateScore } from "../../../../../../utils/scoreCalculator";

type RatingField = "generalCond" | "priceVsMkt" | "maintHist";
type EvaluationErrors = Partial<Record<RatingField, string>>;

const splitLines = (text: string): string[] =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export default function EvaluateListingScreen() {
  const { listingId } = useLocalSearchParams<{
    id: string;
    listingId: string;
  }>();
  const loadByListing = useEvaluationStore((s) => s.loadByListing);
  const saveEvaluation = useEvaluationStore((s) => s.saveEvaluation);
  const removeEvaluation = useEvaluationStore((s) => s.removeEvaluation);

  const [generalCond, setGeneralCond] = useState<number | null>(null);
  const [priceVsMkt, setPriceVsMkt] = useState<number | null>(null);
  const [maintHist, setMaintHist] = useState<number | null>(null);
  const [prosText, setProsText] = useState("");
  const [consText, setConsText] = useState("");
  const [errors, setErrors] = useState<EvaluationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const seed = async () => {
      try {
        await loadByListing(listingId);
        if (cancelled) return;
        const existing = useEvaluationStore.getState().byListing[listingId];
        if (existing) {
          setGeneralCond(existing.generalCond);
          setPriceVsMkt(existing.priceVsMkt);
          setMaintHist(existing.maintHist);
          setProsText(existing.pros.join("\n"));
          setConsText(existing.cons.join("\n"));
          setHasExisting(true);
        }
      } catch {
        if (!cancelled) {
          Alert.alert("Erro", "Não foi possível carregar a avaliação.");
          router.back();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void seed();
    return () => {
      cancelled = true;
    };
  }, [listingId, loadByListing]);

  const score =
    generalCond !== null && priceVsMkt !== null && maintHist !== null
      ? calculateScore({ generalCond, priceVsMkt, maintHist })
      : null;

  async function handleSubmit() {
    const fieldErrors: EvaluationErrors = {};
    if (generalCond === null)
      fieldErrors.generalCond = "Selecione uma nota de 1 a 5.";
    if (priceVsMkt === null)
      fieldErrors.priceVsMkt = "Selecione uma nota de 1 a 5.";
    if (maintHist === null)
      fieldErrors.maintHist = "Selecione uma nota de 1 a 5.";
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    const result = evaluationInputSchema.safeParse({
      generalCond,
      priceVsMkt,
      maintHist,
      pros: splitLines(prosText),
      cons: splitLines(consText),
    });
    if (!result.success) {
      const next: EvaluationErrors = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0]) as RatingField;
        next[field] ??= issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await saveEvaluation({ ...result.data, listingId });
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar a avaliação.");
    } finally {
      setSubmitting(false);
    }
  }

  function confirmRemove() {
    Alert.alert("Remover avaliação", "Esta ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          setSubmitting(true);
          try {
            await removeEvaluation(listingId);
            router.back();
          } catch {
            Alert.alert("Erro", "Não foi possível remover a avaliação.");
          } finally {
            setSubmitting(false);
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={screenStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
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
        {score !== null ? (
          <View style={styles.scoreRow}>
            <Text style={styles.score}>
              {score.toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </Text>
            <RecommendationBadge score={score} />
          </View>
        ) : (
          <Text style={styles.scoreHint}>
            Selecione as três notas para ver a pontuação.
          </Text>
        )}

        <RatingInput
          label="Condição geral"
          value={generalCond}
          onChange={(value) => {
            setGeneralCond(value);
            setErrors((prev) => ({ ...prev, generalCond: undefined }));
          }}
          error={errors.generalCond}
          disabled={submitting}
        />
        <RatingInput
          label="Preço vs. mercado"
          value={priceVsMkt}
          onChange={(value) => {
            setPriceVsMkt(value);
            setErrors((prev) => ({ ...prev, priceVsMkt: undefined }));
          }}
          error={errors.priceVsMkt}
          disabled={submitting}
        />
        <RatingInput
          label="Histórico de manutenção"
          value={maintHist}
          onChange={(value) => {
            setMaintHist(value);
            setErrors((prev) => ({ ...prev, maintHist: undefined }));
          }}
          error={errors.maintHist}
          disabled={submitting}
        />

        <Input
          label="Pontos positivos (um por linha)"
          placeholder="Ex.: único dono"
          value={prosText}
          onChangeText={setProsText}
          multiline
          inputStyle={formStyles.notesInput}
        />
        <Input
          label="Pontos negativos (um por linha)"
          placeholder="Ex.: pneus gastos"
          value={consText}
          onChangeText={setConsText}
          multiline
          inputStyle={formStyles.notesInput}
        />

        <Button
          title={hasExisting ? "Salvar alterações" : "Salvar avaliação"}
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          buttonStyle={formStyles.submitButton}
          containerStyle={formStyles.submitContainer}
        />

        {hasExisting ? (
          <Button
            type="clear"
            title="Remover avaliação"
            onPress={confirmRemove}
            disabled={submitting}
            titleStyle={styles.removeTitle}
            containerStyle={styles.removeContainer}
          />
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginLeft: 10,
    marginBottom: 8,
  },
  score: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
  },
  scoreHint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 10,
    marginBottom: 8,
  },
  removeContainer: {
    marginTop: 8,
    marginHorizontal: 10,
  },
  removeTitle: {
    color: colors.error,
  },
});
