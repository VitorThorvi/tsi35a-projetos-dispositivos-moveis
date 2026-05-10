import { StyleSheet, Text, View } from "react-native";

export default function VehiclesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Veículos</Text>
      <Text style={styles.subtitle}>Em construção</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
  },
});
