import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#64748B",
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: "Início", tabBarLabel: "Início" }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: "Veículos",
          tabBarLabel: "Veículos",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
