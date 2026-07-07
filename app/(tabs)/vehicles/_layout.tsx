import { Stack } from "expo-router";

import { colors } from "../../../constants/theme";

export default function VehiclesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Veículos" }} />
      <Stack.Screen name="new" options={{ title: "Novo veículo" }} />
      <Stack.Screen name="[id]/index" options={{ title: "Detalhes" }} />
      <Stack.Screen name="[id]/edit" options={{ title: "Editar veículo" }} />
      <Stack.Screen
        name="[id]/listings/new"
        options={{ title: "Novo anúncio" }}
      />
      <Stack.Screen
        name="[id]/listings/[listingId]/index"
        options={{ title: "Anúncio" }}
      />
      <Stack.Screen
        name="[id]/listings/[listingId]/edit"
        options={{ title: "Editar anúncio" }}
      />
      <Stack.Screen
        name="[id]/listings/[listingId]/evaluate"
        options={{ title: "Avaliar anúncio" }}
      />
    </Stack>
  );
}
