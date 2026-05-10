import { Redirect, Stack, useSegments } from "expo-router";
import { ThemeProvider } from "@rneui/themed";

import { theme } from "../constants/theme";
import { useAuthStore } from "../stores/useAuthStore";

export default function RootLayout() {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);

  const segments = useSegments();
  const inAuthGroup = segments[0] === "(auth)";

  if (!isAuthed && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }
  if (isAuthed && inAuthGroup) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
