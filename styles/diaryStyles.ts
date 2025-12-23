import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#F8FAFC",
    flexGrow: 1,
  },
  
  /* HEADER */
  header: {
    backgroundColor: "#10B981",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#D1FAE5",
    fontWeight: "500",
  },

  /* STATS OVERVIEW */
  statsOverview: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
  },

  /* DATE NAVIGATOR */
  dateNavigator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
  },
  dateNavButton: {
    backgroundColor: "#FFFFFF",
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dateNavButtonDisabled: {
    backgroundColor: "#F1F5F9",
  },
  dateNavButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#10B981",
  },
  dateNavButtonTextDisabled: {
    color: "#CBD5E1",
  },
  dateDisplay: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  dateDisplayText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  todayBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  todayBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* DAILY SUMMARY */
  dailySummary: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dailySummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  dailySummaryLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 4,
  },
  dailySummaryCalories: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  dailySummaryPercent: {
    fontSize: 28,
    fontWeight: "900",
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  macroSummary: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  macroSummaryItem: {
    alignItems: "center",
    gap: 4,
  },
  macroSummaryEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  macroSummaryValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#10B981",
  },
  macroSummaryLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },

  /* MEALS CONTAINER */
  mealsContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  mealSection: {
    marginBottom: 20,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  mealCalories: {
    fontSize: 15,
    fontWeight: "800",
    color: "#10B981",
  },
  emptyMeal: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  emptyMealText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },

  /* FOOD ENTRY */
  foodEntry: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  foodEntryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  foodEntryName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
  },
  foodEntryTime: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
  },
  foodEntryQuantity: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 10,
  },
  foodEntryMacros: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 10,
  },
  macroItem: {
    flex: 1,
    alignItems: "center",
  },
  macroLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  macroDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E2E8F0",
  },

  /* EMPTY STATE */
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
    paddingHorizontal: 40,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalClose: {
    fontSize: 24,
    color: "#94A3B8",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statsGridItem: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statsGridLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 6,
  },
  statsGridValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#10B981",
  },
  modalButton: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
});