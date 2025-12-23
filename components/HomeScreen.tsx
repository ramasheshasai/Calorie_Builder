import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";
import { styles } from "../styles/homeStyles";

/* ---------------- API CONFIG ---------------- */
const API_KEY = process.env.EXPO_PUBLIC_USDA_API_KEY;
const STORAGE_KEY = "@food_diary_app";

/* ---------------- TYPES ---------------- */
type MealType = "breakfast" | "lunch" | "snack" | "dinner";

type FoodItem = {
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
  foods: FoodItem[];
  targetCalories: number;
};

type UserProfile = {
  age: string;
  height: string;
  weight: string;
  gender: string | null;
  activity: number | null;
  goal: string | null;
};

/* ---------------- USDA SEARCH ---------------- */
const searchFoodInUSDA = async (searchQuery: string) => {
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
    searchQuery
  )}&pageSize=10&api_key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.foods || data.foods.length === 0) {
    return [];
  }

  return data.foods.map((food: any) => ({
    fdcId: food.fdcId,
    description: food.description,
    brandName: food.brandName || null,
    nutrients: food.foodNutrients,
  }));
};

/* ---------------- GET NUTRITION FROM FOOD OBJECT ---------------- */
const getNutritionFromFood = (food: any) => {
  const nutrients = food.nutrients;
  const get = (name: string) =>
    nutrients.find((n: any) => n.nutrientName === name)?.value || 0;

  return {
    calories: get("Energy"),
    protein: get("Protein"),
    carbs: get("Carbohydrate, by difference"),
    fats: get("Total lipid (fat)"),
  };
};

export default function HomeScreen() {
  /* ---------------- STATE: PROFILE ---------------- */
  const [profile, setProfile] = useState<UserProfile>({
    age: "",
    height: "",
    weight: "",
    gender: null,
    activity: null,
    goal: null,
  });

  /* ---------------- STATE: FOOD & SEARCH ---------------- */
  const [foodName, setFoodName] = useState("");
  const [foodQty, setFoodQty] = useState("");
  const [meal, setMeal] = useState<MealType>("breakfast");
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedFood, setSelectedFood] = useState<any | null>(null);

  /* ---------------- LOAD DATA ON MOUNT ---------------- */
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setProfile(parsed.profile || {});
        loadTodaysFoods(parsed.logs || []);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const loadTodaysFoods = (logs: DailyLog[]) => {
    const today = new Date().toISOString().split("T")[0];
    const todayLog = logs.find(log => log.date === today);
    if (todayLog) {
      setFoods(todayLog.foods.map(f => ({
        ...f,
        timestamp: new Date(f.timestamp)
      })));
    }
  };

  /* ---------------- SAVE DATA TO STORAGE ---------------- */
  const saveData = async (updatedFoods: FoodItem[]) => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = storedData ? JSON.parse(storedData) : { logs: [], profile };
      
      const today = new Date().toISOString().split("T")[0];
      const existingLogIndex = parsed.logs.findIndex((log: DailyLog) => log.date === today);
      
      const targetCalories = calculateDailyCalories();
      
      if (existingLogIndex >= 0) {
        parsed.logs[existingLogIndex].foods = updatedFoods;
      } else {
        parsed.logs.push({
          date: today,
          foods: updatedFoods,
          targetCalories,
        });
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  /* ---------------- PROFILE HELPERS ---------------- */
  const profileComplete = profile.age && profile.height && profile.weight && profile.gender && profile.activity && profile.goal;

  const calculateDailyCalories = () => {
    if (!profileComplete) return 0;

    const bmr =
      profile.gender === "male"
        ? 10 * +profile.weight + 6.25 * +profile.height - 5 * +profile.age + 5
        : 10 * +profile.weight + 6.25 * +profile.height - 5 * +profile.age - 161;

    let cal = bmr * (profile.activity || 1.2);
    if (profile.goal === "lose") cal -= 500;
    if (profile.goal === "gain") cal += 500;

    return Math.round(cal);
  };

  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    
    try {
      AsyncStorage.getItem(STORAGE_KEY).then(storedData => {
        const parsed = storedData ? JSON.parse(storedData) : { logs: [] };
        parsed.profile = updated;
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      });
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  /* ---------------- SEARCH FOOD ---------------- */
  const searchFood = async () => {
    if (!foodName.trim()) return;

    try {
      setSearching(true);
      const results = await searchFoodInUSDA(foodName);
      setSearchResults(results);
      
      if (results.length === 0) {
        Alert.alert("No Results", "No foods found matching your search");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to search foods. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  /* ---------------- SELECT FOOD ---------------- */
  const selectFood = (food: any) => {
    setSelectedFood(food);
    setSearchResults([]);
    setFoodName(food.description);
  };

  /* ---------------- ADD FOOD ---------------- */
  const addFood = async () => {
    if (!selectedFood || !foodQty) {
      Alert.alert("Missing Information", "Please search and select a food, then enter quantity");
      return;
    }

    try {
      setLoading(true);

      const qty = Number(foodQty);
      const nutrition = getNutritionFromFood(selectedFood);
      const factor = qty / 100;

      const newFood: FoodItem = {
        id: Date.now().toString(),
        name: selectedFood.description,
        meal,
        quantity: qty,
        calories: nutrition.calories * factor,
        protein: nutrition.protein * factor,
        carbs: nutrition.carbs * factor,
        fats: nutrition.fats * factor,
        timestamp: new Date(),
      };

      const updatedFoods = [...foods, newFood];
      setFoods(updatedFoods);
      await saveData(updatedFoods);

      // Reset form
      setFoodName("");
      setFoodQty("");
      setSelectedFood(null);
      Alert.alert("Success", "Food added to your diary!");
    } catch (error) {
      Alert.alert("Error", "Failed to add food");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REMOVE FOOD ---------------- */
  const removeFood = async (id: string) => {
    const updatedFoods = foods.filter(f => f.id !== id);
    setFoods(updatedFoods);
    await saveData(updatedFoods);
  };

  /* ---------------- TOTALS & CALCULATIONS ---------------- */
  const totals = foods.reduce(
    (a, f) => {
      a.calories += f.calories;
      a.protein += f.protein;
      a.carbs += f.carbs;
      a.fats += f.fats;
      return a;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const dailyCalories = calculateDailyCalories();
  const calorieProgress = dailyCalories > 0 ? (totals.calories / dailyCalories) * 100 : 0;
  const remaining = dailyCalories - totals.calories;

  /* ---------------- RENDER MEAL SECTION ---------------- */
  const renderMeal = (mealType: MealType, title: string, emoji: string) => {
    const items = foods.filter(f => f.meal === mealType);
    if (items.length === 0) return null;

    const mealTotal = items.reduce((sum, f) => sum + f.calories, 0);

    return (
      <View style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>
            {emoji} {title}
          </Text>
          <Text style={styles.mealCalories}>{mealTotal.toFixed(0)} kcal</Text>
        </View>
        
        {items.map((f) => (
          <View key={f.id} style={styles.foodRow}>
            <View style={styles.foodMainInfo}>
              <View style={{ flex: 1 }}>
                <Text style={styles.foodName}>{f.name}</Text>
                <Text style={styles.foodQuantity}>{f.quantity}g</Text>
              </View>
              <Pressable
                onPress={() => removeFood(f.id)}
                style={{ padding: 8 }}
              >
                <Text style={{ fontSize: 16, color: "#EF4444" }}>✕</Text>
              </Pressable>
            </View>
            
            <View style={styles.macroGrid}>
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Cal</Text>
                <Text style={styles.macroValue}>{f.calories.toFixed(0)}</Text>
              </View>
              <View style={styles.macroDivider} />
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>P</Text>
                <Text style={styles.macroValue}>{f.protein.toFixed(1)}g</Text>
              </View>
              <View style={styles.macroDivider} />
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>C</Text>
                <Text style={styles.macroValue}>{f.carbs.toFixed(1)}g</Text>
              </View>
              <View style={styles.macroDivider} />
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>F</Text>
                <Text style={styles.macroValue}>{f.fats.toFixed(1)}g</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>🥗 Diet Planner</Text>
        <Text style={styles.appSubtitle}>Track your nutrition & reach your goals</Text>
      </View>

      {/* CALORIE OVERVIEW */}
      {profileComplete && (
        <View style={styles.calorieOverview}>
          <View style={styles.calorieMainCard}>
            <Text style={styles.calorieLabel}>Daily Target</Text>
            <Text style={styles.calorieTarget}>{dailyCalories}</Text>
            <Text style={styles.calorieUnit}>calories</Text>
            
            {foods.length > 0 && (
              <>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        width: `${Math.min(calorieProgress, 100)}%`,
                        backgroundColor: calorieProgress > 100 ? '#EF4444' : '#10B981'
                      }
                    ]} 
                  />
                </View>
                
                <View style={styles.calorieStats}>
                  <View style={styles.calorieStat}>
                    <Text style={styles.calorieStatValue}>{totals.calories.toFixed(0)}</Text>
                    <Text style={styles.calorieStatLabel}>Consumed</Text>
                  </View>
                  <View style={styles.calorieStatDivider} />
                  <View style={styles.calorieStat}>
                    <Text style={[
                      styles.calorieStatValue,
                      { color: remaining < 0 ? '#EF4444' : '#10B981' }
                    ]}>
                      {Math.abs(remaining).toFixed(0)}
                    </Text>
                    <Text style={styles.calorieStatLabel}>
                      {remaining >= 0 ? 'Remaining' : 'Over'}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* MACRO BREAKDOWN */}
          {foods.length > 0 && (
            <View style={styles.macroBreakdown}>
              <View style={styles.macroBreakdownItem}>
                <View style={[styles.macroBadge, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={styles.macroBadgeEmoji}>💪</Text>
                </View>
                <Text style={styles.macroBreakdownValue}>{totals.protein.toFixed(1)}g</Text>
                <Text style={styles.macroBreakdownLabel}>Protein</Text>
              </View>
              
              <View style={styles.macroBreakdownItem}>
                <View style={[styles.macroBadge, { backgroundColor: '#DBEAFE' }]}>
                  <Text style={styles.macroBadgeEmoji}>🍞</Text>
                </View>
                <Text style={styles.macroBreakdownValue}>{totals.carbs.toFixed(1)}g</Text>
                <Text style={styles.macroBreakdownLabel}>Carbs</Text>
              </View>
              
              <View style={styles.macroBreakdownItem}>
                <View style={[styles.macroBadge, { backgroundColor: '#FCE7F3' }]}>
                  <Text style={styles.macroBadgeEmoji}>🥑</Text>
                </View>
                <Text style={styles.macroBreakdownValue}>{totals.fats.toFixed(1)}g</Text>
                <Text style={styles.macroBreakdownLabel}>Fats</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* PROFILE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Your Profile</Text>
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your age" 
            keyboardType="numeric" 
            value={profile.age}
            onChangeText={(val) => handleProfileChange('age', val)}
          />

          <Text style={styles.inputLabel}>Height (cm)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter height in cm" 
            keyboardType="numeric" 
            value={profile.height}
            onChangeText={(val) => handleProfileChange('height', val)}
          />

          <Text style={styles.inputLabel}>Weight (kg)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter weight in kg" 
            keyboardType="numeric" 
            value={profile.weight}
            onChangeText={(val) => handleProfileChange('weight', val)}
          />

          <Text style={styles.inputLabel}>Gender</Text>
          <View style={styles.pickerWrapper}>
            <Picker 
              selectedValue={profile.gender} 
              onValueChange={(val) => handleProfileChange('gender', val)}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value={null} />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>

          <Text style={styles.inputLabel}>Activity Level</Text>
          <View style={styles.pickerWrapper}>
            <Picker 
              selectedValue={profile.activity} 
              onValueChange={(val) => handleProfileChange('activity', val)}
              style={styles.picker}
            >
              <Picker.Item label="Select Activity Level" value={null} />
              <Picker.Item label="Sedentary (little to no exercise)" value={1.2} />
              <Picker.Item label="Moderate (exercise 3-5 days/week)" value={1.55} />
              <Picker.Item label="Active (exercise 6-7 days/week)" value={1.725} />
            </Picker>
          </View>

          <Text style={styles.inputLabel}>Goal</Text>
          <View style={styles.pickerWrapper}>
            <Picker 
              selectedValue={profile.goal} 
              onValueChange={(val) => handleProfileChange('goal', val)}
              style={styles.picker}
            >
              <Picker.Item label="Select Your Goal" value={null} />
              <Picker.Item label="Lose Weight (-500 cal/day)" value="lose" />
              <Picker.Item label="Maintain Weight" value="maintain" />
              <Picker.Item label="Gain Weight (+500 cal/day)" value="gain" />
            </Picker>
          </View>
        </View>
      </View>

      {/* ADD FOOD */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔍 Search & Add Food</Text>
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Meal Type</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={meal} onValueChange={setMeal} style={styles.picker}>
              <Picker.Item label="🍳 Breakfast" value="breakfast" />
              <Picker.Item label="🍚 Lunch" value="lunch" />
              <Picker.Item label="☕ Snack" value="snack" />
              <Picker.Item label="🌙 Dinner" value="dinner" />
            </Picker>
          </View>

          <Text style={styles.inputLabel}>Search Food Database</Text>
          <View style={styles.searchContainer}>
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search for foods (e.g., Chicken breast, Apple)" 
              value={foodName} 
              onChangeText={setFoodName}
              onSubmitEditing={searchFood}
            />
            <Pressable 
              style={styles.searchButton} 
              onPress={searchFood}
              disabled={searching || !foodName.trim()}
            >
              <Text style={styles.searchButtonText}>
                {searching ? "..." : "🔍"}
              </Text>
            </Pressable>
          </View>

          {/* SEARCH RESULTS */}
          {searchResults.length > 0 && (
            <View style={styles.searchResultsContainer}>
              <Text style={styles.searchResultsTitle}>Search Results:</Text>
              <ScrollView style={styles.searchResultsList} nestedScrollEnabled>
                {searchResults.map((food) => {
                  const nutrition = getNutritionFromFood(food);
                  return (
                    <Pressable 
                      key={food.fdcId} 
                      style={styles.searchResultItem}
                      onPress={() => selectFood(food)}
                    >
                      <View style={styles.searchResultInfo}>
                        <Text style={styles.searchResultName}>
                          {food.description}
                        </Text>
                        {food.brandName && (
                          <Text style={styles.searchResultBrand}>
                            {food.brandName}
                          </Text>
                        )}
                        <Text style={styles.searchResultNutrition}>
                          {nutrition.calories.toFixed(0)} cal · P {nutrition.protein.toFixed(1)}g · 
                          C {nutrition.carbs.toFixed(1)}g · F {nutrition.fats.toFixed(1)}g (per 100g)
                        </Text>
                      </View>
                      <Text style={styles.searchResultArrow}>→</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* SELECTED FOOD DISPLAY */}
          {selectedFood && (
            <View style={styles.selectedFoodContainer}>
              <View style={styles.selectedFoodHeader}>
                <Text style={styles.selectedFoodLabel}>Selected:</Text>
                <Pressable onPress={() => {
                  setSelectedFood(null);
                  setFoodName("");
                }}>
                  <Text style={styles.clearButton}>✕ Clear</Text>
                </Pressable>
              </View>
              <Text style={styles.selectedFoodName}>{selectedFood.description}</Text>
              {selectedFood.brandName && (
                <Text style={styles.selectedFoodBrand}>{selectedFood.brandName}</Text>
              )}
            </View>
          )}

          <Text style={styles.inputLabel}>Quantity (grams)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 100"
            keyboardType="numeric"
            value={foodQty}
            onChangeText={setFoodQty}
          />

          <Pressable 
            style={[
              styles.primaryButton, 
              (loading || !selectedFood || !foodQty) && styles.primaryButtonDisabled
            ]} 
            onPress={addFood} 
            disabled={loading || !selectedFood || !foodQty}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "Adding..." : "➕ Add to Diary"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* FOOD DIARY */}
      {foods.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📓 Today's Meals</Text>
          {renderMeal("breakfast", "Breakfast", "🍳")}
          {renderMeal("lunch", "Lunch", "🍚")}
          {renderMeal("snack", "Snacks", "☕")}
          {renderMeal("dinner", "Dinner", "🌙")}
        </View>
      )}

      {/* SUMMARY */}
      {foods.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Daily Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}>🎯</Text>
                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryLabel}>Target</Text>
                  <Text style={styles.summaryValue}>
                    {profileComplete ? `${dailyCalories} kcal` : 'Complete profile'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.summaryDivider} />
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}>🔥</Text>
                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryLabel}>Consumed</Text>
                  <Text style={styles.summaryValue}>{totals.calories.toFixed(0)} kcal</Text>
                </View>
              </View>
            </View>

            <View style={styles.summaryDividerHorizontal} />

            <View style={styles.summaryMacrosRow}>
              <View style={styles.summaryMacroItem}>
                <Text style={styles.summaryMacroEmoji}>💪</Text>
                <Text style={styles.summaryMacroLabel}>Protein</Text>
                <Text style={styles.summaryMacroValue}>{totals.protein.toFixed(1)}g</Text>
              </View>

              <View style={styles.summaryMacroItem}>
                <Text style={styles.summaryMacroEmoji}>🍞</Text>
                <Text style={styles.summaryMacroLabel}>Carbs</Text>
                <Text style={styles.summaryMacroValue}>{totals.carbs.toFixed(1)}g</Text>
              </View>

              <View style={styles.summaryMacroItem}>
                <Text style={styles.summaryMacroEmoji}>🥑</Text>
                <Text style={styles.summaryMacroLabel}>Fats</Text>
                <Text style={styles.summaryMacroValue}>{totals.fats.toFixed(1)}g</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}