import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="login" options={{ title: "Entrar" }} />
    </Stack>
  );
}
