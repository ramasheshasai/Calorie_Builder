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
  appTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 15,
    color: "#D1FAE5",
    fontWeight: "500",
  },
  
  /* SECTIONS */
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  
  /* CARD */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  
  /* INPUTS */
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    marginBottom: 12,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  
  /* PRIMARY BUTTON */
  primaryButton: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: "#94A3B8",
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  
  /* FOOD ITEMS - MEAL CARDS */
  mealCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  
  /* FOOD ROW */
  foodRow: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  foodMainInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  foodName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    textTransform: "capitalize",
    flex: 1,
  },
  foodQuantity: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  foodMacro: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
    lineHeight: 18,
  },
  
  /* MACRO GRID */
  macroGrid: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
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
  
  /* SUMMARY CARD */
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryEmoji: {
    fontSize: 32,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 16,
  },
  summaryDividerHorizontal: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 20,
  },
  summaryMacrosRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryMacroItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryMacroEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  summaryMacroLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 4,
  },
  summaryMacroValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#10B981",
  },
  summaryText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#0F172A",
  },
  
  /* CALORIE OVERVIEW */
  calorieOverview: {
    marginHorizontal: 20,
    marginTop: -40,
  },
  calorieMainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  calorieLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  calorieTarget: {
    fontSize: 48,
    fontWeight: "900",
    color: "#0F172A",
    marginTop: 4,
  },
  calorieUnit: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: -4,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginTop: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  calorieStats: {
    flexDirection: "row",
    marginTop: 16,
    width: "100%",
  },
  calorieStat: {
    flex: 1,
    alignItems: "center",
  },
  calorieStatValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#10B981",
  },
  calorieStatLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "600",
  },
  calorieStatDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 16,
  },
  
  /* MACRO BREAKDOWN */
  macroBreakdown: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  macroBreakdownItem: {
    flex: 1,
    alignItems: "center",
  },
  macroBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  macroBadgeEmoji: {
    fontSize: 24,
  },
  macroBreakdownValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  macroBreakdownLabel: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "600",
  },
  
  /* EMPTY STATE */
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    fontWeight: "600",
  },
  
  /* SEARCH CONTAINER */
  searchContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
  },
  searchButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
  },
  searchButtonText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  
  /* SEARCH RESULTS */
  searchResultsContainer: {
    marginBottom: 16,
    maxHeight: 300,
  },
  searchResultsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 8,
  },
  searchResultsList: {
    maxHeight: 280,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  searchResultBrand: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 4,
  },
  searchResultNutrition: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
  searchResultArrow: {
    fontSize: 18,
    color: "#10B981",
    marginLeft: 8,
  },
  
  /* SELECTED FOOD */
  selectedFoodContainer: {
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#10B981",
  },
  selectedFoodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  selectedFoodLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#065F46",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  clearButton: {
    fontSize: 12,
    fontWeight: "700",
    color: "#EF4444",
  },
  selectedFoodName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#065F46",
    marginBottom: 2,
  },
  selectedFoodBrand: {
    fontSize: 12,
    fontWeight: "600",
    color: "#047857",
  },
});