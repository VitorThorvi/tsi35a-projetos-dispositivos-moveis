import { StyleSheet, Text, View } from "react-native";

import { textStyles } from "../../constants/styles";
import { colors } from "../../constants/theme";
import {
  getRecommendation,
  type Recommendation,
} from "../../utils/scoreCalculator";

export type RecommendationBadgeProps = { score: number };

const BADGE: Record<Recommendation, { label: string; color: string }> = {
  recomendado: { label: "Recomendado", color: colors.success },
  "atenção": { label: "Atenção", color: colors.warning },
  evitar: { label: "Evitar", color: colors.error },
};

export function RecommendationBadge({ score }: RecommendationBadgeProps) {
  const { label, color } = BADGE[getRecommendation(score)];
  return (
    <View style={[styles.pill, { backgroundColor: color }]}>
      <Text style={textStyles.badgeText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
});
