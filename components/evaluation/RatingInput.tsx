import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { formStyles } from "../../constants/styles";
import { colors } from "../../constants/theme";

export type RatingInputProps = {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
};

const STARS = [1, 2, 3, 4, 5];

export function RatingInput({
  label,
  value,
  onChange,
  error,
  disabled,
}: RatingInputProps) {
  const selected = value ?? 0;
  return (
    <View style={styles.container}>
      <Text style={formStyles.fieldLabel}>{label}</Text>
      <View style={styles.stars}>
        {STARS.map((position) => (
          <Pressable
            key={position}
            onPress={() => onChange(position)}
            disabled={disabled}
            hitSlop={4}
          >
            <Ionicons
              name={position <= selected ? "star" : "star-outline"}
              size={32}
              color={position <= selected ? colors.primary : colors.border}
            />
          </Pressable>
        ))}
      </View>
      {error ? <Text style={formStyles.fieldError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  stars: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 10,
  },
});
