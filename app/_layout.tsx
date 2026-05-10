import { Redirect, Stack, useSegments } from "expo-router";
import { ThemeProvider } from "@rneui/themed";

import { theme } from "../constants/theme";

export default function RootLayout() {
  const isAuthed = false;

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
