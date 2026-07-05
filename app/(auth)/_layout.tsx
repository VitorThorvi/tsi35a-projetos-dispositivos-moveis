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
      <Stack.Screen name="signup" options={{ title: "Criar conta" }} />
      <Stack.Screen
        name="forgot-password"
        options={{ title: "Recuperar senha" }}
      />
    </Stack>
  );
}
