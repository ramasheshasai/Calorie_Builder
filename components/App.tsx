import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import FoodDiaryScreen from "./FoodDiaryScreen";
import HomeScreen from "./HomeScreen";

export default function App() {
  const [activeTab, setActiveTab] = React.useState<"home" | "diary">("home");

  return (
    <View style={styles.container}>
      {/* CONTENT */}
      <View style={styles.content}>
        {activeTab === "home" ? <HomeScreen /> : <FoodDiaryScreen />}
      </View>

      {/* BOTTOM TAB NAVIGATION */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === "home" && styles.tabActive]}
          onPress={() => setActiveTab("home")}
        >
          <Text style={[styles.tabIcon, activeTab === "home" && styles.tabIconActive]}>
            🍎
          </Text>
          <Text style={[styles.tabLabel, activeTab === "home" && styles.tabLabelActive]}>
            Track
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === "diary" && styles.tabActive]}
          onPress={() => setActiveTab("diary")}
        >
          <Text style={[styles.tabIcon, activeTab === "diary" && styles.tabIconActive]}>
            📓
          </Text>
          <Text style={[styles.tabLabel, activeTab === "diary" && styles.tabLabelActive]}>
            Diary
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingBottom: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: "#D1FAE5",
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabIconActive: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  tabLabelActive: {
    color: "#065F46",
    fontWeight: "800",
  },
});