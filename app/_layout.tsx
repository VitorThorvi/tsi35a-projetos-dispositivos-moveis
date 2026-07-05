import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect, Stack, useSegments } from "expo-router";
import { ThemeProvider } from "@rneui/themed";

import { colors, theme } from "../constants/theme";
import { useAuthStore } from "../stores/useAuthStore";

export default function RootLayout() {
  const status = useAuthStore((s) => s.status);
  const init = useAuthStore((s) => s.init);
  const segments = useSegments();

  useEffect(() => {
    void init();
  }, [init]);

  if (status === "initializing") {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const inAuthGroup = segments[0] === "(auth)";

  if (status === "unauthenticated" && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }
  if ((status === "guest" || status === "authenticated") && inAuthGroup) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
