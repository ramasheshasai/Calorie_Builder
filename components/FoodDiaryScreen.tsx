import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { styles } from "../styles/diaryStyles";

/* ---------------- STORAGE KEY & TYPES ---------------- */
const STORAGE_KEY = "@food_diary_app";

type MealType = "breakfast" | "lunch" | "snack" | "dinner";

type FoodEntry = {
  id: string;
  name: string;
  meal: MealType;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: Date;
};

type DailyLog = {
  date: string;
  foods: FoodEntry[];
  targetCalories: number;
};

type WeeklyStats = {
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFats: number;
  daysLogged: number;
};

export default function FoodDiaryScreen() {
  /* ---------------- STATE ---------------- */
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("daily");
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [diaryLogs, setDiaryLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD DATA ON MOUNT ---------------- */
  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, [])
  );

  const loadLogs = async () => {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const logs = (parsed.logs || []).map((log: any) => ({
          ...log,
          foods: log.foods.map((f: any) => ({
            ...f,
            timestamp: new Date(f.timestamp)
          }))
        }));
        setDiaryLogs(logs);
      }
    } catch (error) {
      console.error("Failed to load logs:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DATE HELPERS ---------------- */
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  /* ---------------- GET CURRENT DAY LOG ---------------- */
  const getCurrentDayLog = () => {
    return diaryLogs.find(log => log.date === formatDate(selectedDate));
  };

  /* ---------------- CALCULATE TOTALS ---------------- */
  const calculateDayTotals = (log: DailyLog | undefined) => {
    if (!log || !log.foods.length) {
      return { calories: 0, protein: 0, carbs: 0, fats: 0 };
    }

    return log.foods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fats: acc.fats + food.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  /* ---------------- CALCULATE WEEKLY STATS ---------------- */
  const calculateWeeklyStats = (): WeeklyStats => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return formatDate(date);
    });

    const weekLogs = diaryLogs.filter(log => last7Days.includes(log.date));
    
    if (weekLogs.length === 0) {
      return { avgCalories: 0, avgProtein: 0, avgCarbs: 0, avgFats: 0, daysLogged: 0 };
    }

    const totals = weekLogs.reduce(
      (acc, log) => {
        const dayTotals = calculateDayTotals(log);
        return {
          calories: acc.calories + dayTotals.calories,
          protein: acc.protein + dayTotals.protein,
          carbs: acc.carbs + dayTotals.carbs,
          fats: acc.fats + dayTotals.fats,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    return {
      avgCalories: totals.calories / weekLogs.length,
      avgProtein: totals.protein / weekLogs.length,
      avgCarbs: totals.carbs / weekLogs.length,
      avgFats: totals.fats / weekLogs.length,
      daysLogged: weekLogs.length,
    };
  };

  /* ---------------- CALCULATE STREAK ---------------- */
  const calculateStreak = () => {
    let streak = 0;
    const sortedLogs = [...diaryLogs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const today = formatDate(new Date());
    let checkDate = new Date();

    for (let i = 0; i < 30; i++) {
      const dateStr = formatDate(checkDate);
      const hasLog = sortedLogs.find(log => log.date === dateStr && log.foods.length > 0);
      
      if (hasLog) {
        streak++;
      } else if (dateStr !== today) {
        break;
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  };

  /* ---------------- REMOVE FOOD FROM LOG ---------------- */
  const removeFood = async (foodId: string) => {
    const currentLog = getCurrentDayLog();
    if (!currentLog) return;

    const updatedFoods = currentLog.foods.filter(f => f.id !== foodId);
    const updatedLog = { ...currentLog, foods: updatedFoods };

    const updatedLogs = diaryLogs.map(log =>
      log.date === formatDate(selectedDate) ? updatedLog : log
    );

    setDiaryLogs(updatedLogs);

    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = storedData ? JSON.parse(storedData) : {};
      parsed.logs = updatedLogs;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };

  /* ---------------- RENDER MEAL SECTION ---------------- */
  const renderMealSection = (mealType: MealType, title: string, emoji: string, foods: FoodEntry[]) => {
    const mealFoods = foods.filter(f => f.meal === mealType);
    const mealTotal = mealFoods.reduce((sum, f) => sum + f.calories, 0);

    return (
      <View style={styles.mealSection}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>{emoji} {title}</Text>
          {mealFoods.length > 0 && (
            <Text style={styles.mealCalories}>{mealTotal.toFixed(0)} kcal</Text>
          )}
        </View>

        {mealFoods.length === 0 ? (
          <View style={styles.emptyMeal}>
            <Text style={styles.emptyMealText}>No items logged</Text>
          </View>
        ) : (
          mealFoods.map((food) => (
            <View key={food.id} style={styles.foodEntry}>
              <View style={styles.foodEntryHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.foodEntryName}>{food.name}</Text>
                  <Text style={styles.foodEntryTime}>
                    {food.timestamp.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
                <Pressable
                  onPress={() => removeFood(food.id)}
                  style={{ padding: 8 }}
                >
                  <Text style={{ fontSize: 16, color: "#EF4444" }}>✕</Text>
                </Pressable>
              </View>
              <Text style={styles.foodEntryQuantity}>{food.quantity}g</Text>
              <View style={styles.foodEntryMacros}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>Cal</Text>
                  <Text style={styles.macroValue}>{food.calories.toFixed(0)}</Text>
                </View>
                <View style={styles.macroDivider} />
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>P</Text>
                  <Text style={styles.macroValue}>{food.protein.toFixed(1)}g</Text>
                </View>
                <View style={styles.macroDivider} />
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>C</Text>
                  <Text style={styles.macroValue}>{food.carbs.toFixed(1)}g</Text>
                </View>
                <View style={styles.macroDivider} />
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>F</Text>
                  <Text style={styles.macroValue}>{food.fats.toFixed(1)}g</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    );
  };

  const currentLog = getCurrentDayLog();
  const dayTotals = calculateDayTotals(currentLog);
  const weeklyStats = calculateWeeklyStats();
  const streak = calculateStreak();
  const progress = currentLog ? (dayTotals.calories / currentLog.targetCalories) * 100 : 0;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#64748B' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📓 Food Diary</Text>
        <Text style={styles.headerSubtitle}>Track your daily nutrition & habits</Text>
      </View>

      {/* STATS OVERVIEW */}
      <View style={styles.statsOverview}>
        <Pressable style={styles.statCard} onPress={() => setShowStatsModal(true)}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </Pressable>

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>📊</Text>
          <Text style={styles.statValue}>{weeklyStats.daysLogged}/7</Text>
          <Text style={styles.statLabel}>Days Logged</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>⚡</Text>
          <Text style={styles.statValue}>{weeklyStats.avgCalories.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Avg Calories</Text>
        </View>
      </View>

      {/* DATE NAVIGATOR */}
      <View style={styles.dateNavigator}>
        <Pressable style={styles.dateNavButton} onPress={() => changeDate(-1)}>
          <Text style={styles.dateNavButtonText}>←</Text>
        </Pressable>

        <View style={styles.dateDisplay}>
          <Text style={styles.dateDisplayText}>{formatDisplayDate(selectedDate)}</Text>
          {isToday(selectedDate) && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>Today</Text>
            </View>
          )}
        </View>

        <Pressable 
          style={[styles.dateNavButton, isToday(selectedDate) && styles.dateNavButtonDisabled]} 
          onPress={() => changeDate(1)}
          disabled={isToday(selectedDate)}
        >
          <Text style={[
            styles.dateNavButtonText,
            isToday(selectedDate) && styles.dateNavButtonTextDisabled
          ]}>→</Text>
        </Pressable>
      </View>

      {/* DAILY SUMMARY */}
      {currentLog && currentLog.foods.length > 0 && (
        <View style={styles.dailySummary}>
          <View style={styles.dailySummaryHeader}>
            <View>
              <Text style={styles.dailySummaryLabel}>Daily Progress</Text>
              <Text style={styles.dailySummaryCalories}>
                {dayTotals.calories.toFixed(0)} / {currentLog.targetCalories} kcal
              </Text>
            </View>
            <Text style={[
              styles.dailySummaryPercent,
              { color: progress > 100 ? '#EF4444' : '#10B981' }
            ]}>
              {progress.toFixed(0)}%
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: progress > 100 ? '#EF4444' : '#10B981'
                }
              ]} 
            />
          </View>

          <View style={styles.macroSummary}>
            <View style={styles.macroSummaryItem}>
              <Text style={styles.macroSummaryEmoji}>💪</Text>
              <Text style={styles.macroSummaryValue}>{dayTotals.protein.toFixed(1)}g</Text>
              <Text style={styles.macroSummaryLabel}>Protein</Text>
            </View>
            <View style={styles.macroSummaryItem}>
              <Text style={styles.macroSummaryEmoji}>🍞</Text>
              <Text style={styles.macroSummaryValue}>{dayTotals.carbs.toFixed(1)}g</Text>
              <Text style={styles.macroSummaryLabel}>Carbs</Text>
            </View>
            <View style={styles.macroSummaryItem}>
              <Text style={styles.macroSummaryEmoji}>🥑</Text>
              <Text style={styles.macroSummaryValue}>{dayTotals.fats.toFixed(1)}g</Text>
              <Text style={styles.macroSummaryLabel}>Fats</Text>
            </View>
          </View>
        </View>
      )}

      {/* MEALS */}
      <View style={styles.mealsContainer}>
        {currentLog && currentLog.foods.length > 0 ? (
          <>
            {renderMealSection("breakfast", "Breakfast", "🍳", currentLog.foods)}
            {renderMealSection("lunch", "Lunch", "🍚", currentLog.foods)}
            {renderMealSection("snack", "Snacks", "☕", currentLog.foods)}
            {renderMealSection("dinner", "Dinner", "🌙", currentLog.foods)}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>📝</Text>
            <Text style={styles.emptyStateTitle}>No entries for this day</Text>
            <Text style={styles.emptyStateText}>
              {isToday(selectedDate) 
                ? "Start logging your meals to track your nutrition"
                : "No food was logged on this day"}
            </Text>
          </View>
        )}
      </View>

      {/* WEEKLY STATS MODAL */}
      <Modal
        visible={showStatsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStatsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📈 Weekly Statistics</Text>
              <Pressable onPress={() => setShowStatsModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statsGridItem}>
                <Text style={styles.statsGridLabel}>Streak</Text>
                <Text style={styles.statsGridValue}>{streak} days</Text>
              </View>
              <View style={styles.statsGridItem}>
                <Text style={styles.statsGridLabel}>Days Logged</Text>
                <Text style={styles.statsGridValue}>{weeklyStats.daysLogged}/7</Text>
              </View>
              <View style={styles.statsGridItem}>
                <Text style={styles.statsGridLabel}>Avg Calories</Text>
                <Text style={styles.statsGridValue}>{weeklyStats.avgCalories.toFixed(0)}</Text>
              </View>
              <View style={styles.statsGridItem}>
                <Text style={styles.statsGridLabel}>Avg Protein</Text>
                <Text style={styles.statsGridValue}>{weeklyStats.avgProtein.toFixed(1)}g</Text>
              </View>
              <View style={styles.statsGridItem}>
                <Text style={styles.statsGridLabel}>Avg Carbs</Text>
                <Text style={styles.statsGridValue}>{weeklyStats.avgCarbs.toFixed(1)}g</Text>
              </View>
              <View style={styles.statsGridItem}>
                <Text style={styles.statsGridLabel}>Avg Fats</Text>
                <Text style={styles.statsGridValue}>{weeklyStats.avgFats.toFixed(1)}g</Text>
              </View>
            </View>

            <Pressable 
              style={styles.modalButton} 
              onPress={() => setShowStatsModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}