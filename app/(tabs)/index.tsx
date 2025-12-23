import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

/* ---------------- API CONFIG ---------------- */
const API_KEY = process.env.EXPO_PUBLIC_USDA_API_KEY;

/* ---------------- TYPES ---------------- */
type MealType = "breakfast" | "lunch" | "snack" | "dinner";

type FoodItem = {
  name: string;
  meal: MealType;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

/* ---------------- USDA FETCH ---------------- */
const fetchFoodFromUSDA = async (foodName: string) => {
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
    foodName
  )}&pageSize=1&api_key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.foods || data.foods.length === 0) {
    throw new Error("Food not found");
  }

  const nutrients = data.foods[0].foodNutrients;
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
  /* ---------------- PROFILE ---------------- */
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [activity, setActivity] = useState<number | null>(null);
  const [goal, setGoal] = useState<string | null>(null);

  /* ---------------- FOOD ---------------- */
  const [foodName, setFoodName] = useState("");
  const [foodQty, setFoodQty] = useState("");
  const [meal, setMeal] = useState<MealType>("breakfast");
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- CALORIES ---------------- */
  const dailyCalories = (() => {
    if (!age || !height || !weight || !gender || !activity || !goal) return 0;

    const bmr =
      gender === "male"
        ? 10 * +weight + 6.25 * +height - 5 * +age + 5
        : 10 * +weight + 6.25 * +height - 5 * +age - 161;

    let cal = bmr * activity;
    if (goal === "lose") cal -= 500;
    if (goal === "gain") cal += 500;

    return Math.round(cal);
  })();

  /* ---------------- ADD FOOD ---------------- */
  const addFood = async () => {
    if (!foodName || !foodQty) return;

    try {
      setLoading(true);

      const qty = Number(foodQty);
      const grams = foodName.toLowerCase() === "egg" ? qty * 50 : qty;

      const nutrition = await fetchFoodFromUSDA(foodName);
      const factor = grams / 100;

      setFoods([
        ...foods,
        {
          name: foodName,
          meal,
          quantity: qty,
          calories: nutrition.calories * factor,
          protein: nutrition.protein * factor,
          carbs: nutrition.carbs * factor,
          fats: nutrition.fats * factor,
        },
      ]);

      setFoodName("");
      setFoodQty("");
    } catch {
      Alert.alert("Error", "Food not found in USDA database");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TOTALS ---------------- */
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

  const renderMeal = (mealType: MealType, title: string) => {
    const items = foods.filter(f => f.meal === mealType);
    if (items.length === 0) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {items.map((f, i) => (
          <View key={i} style={styles.foodRow}>
            <Text style={styles.foodName}>
              {f.name} (
              {f.name.toLowerCase() === "egg"
                ? `${f.quantity} eggs`
                : `${f.quantity} g`}
              )
            </Text>
            <Text style={styles.foodMacro}>
              {f.calories.toFixed(0)} kcal · P {f.protein.toFixed(1)}g · C{" "}
              {f.carbs.toFixed(1)}g · F {f.fats.toFixed(1)}g
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.appTitle}>🥗 Diet Planner</Text>

      {/* PROFILE */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your Profile</Text>

        <TextInput style={styles.input} placeholder="Age" keyboardType="numeric" onChangeText={setAge} />
        <TextInput style={styles.input} placeholder="Height (cm)" keyboardType="numeric" onChangeText={setHeight} />
        <TextInput style={styles.input} placeholder="Weight (kg)" keyboardType="numeric" onChangeText={setWeight} />

        <Picker selectedValue={gender} onValueChange={setGender}>
          <Picker.Item label="Gender" value={null} />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>

        <Picker selectedValue={activity} onValueChange={setActivity}>
          <Picker.Item label="Activity Level" value={null} />
          <Picker.Item label="Sedentary" value={1.2} />
          <Picker.Item label="Moderate" value={1.55} />
          <Picker.Item label="Active" value={1.725} />
        </Picker>

        <Picker selectedValue={goal} onValueChange={setGoal}>
          <Picker.Item label="Goal" value={null} />
          <Picker.Item label="Lose Weight" value="lose" />
          <Picker.Item label="Maintain" value="maintain" />
          <Picker.Item label="Gain Weight" value="gain" />
        </Picker>
      </View>

      {/* ADD FOOD */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Add Food</Text>

        <Picker selectedValue={meal} onValueChange={setMeal}>
          <Picker.Item label="🍳 Breakfast" value="breakfast" />
          <Picker.Item label="🍚 Lunch" value="lunch" />
          <Picker.Item label="☕ Snack" value="snack" />
          <Picker.Item label="🌙 Dinner" value="dinner" />
        </Picker>

        <TextInput style={styles.input} placeholder="Food name" value={foodName} onChangeText={setFoodName} />
        <TextInput
          style={styles.input}
          placeholder={foodName.toLowerCase() === "egg" ? "Number of eggs" : "Quantity (grams)"}
          keyboardType="numeric"
          value={foodQty}
          onChangeText={setFoodQty}
        />

        <Pressable style={styles.primaryButton} onPress={addFood} disabled={loading}>
          <Text style={styles.primaryButtonText}>
            {loading ? "Adding..." : "Add Food"}
          </Text>
        </Pressable>
      </View>

      {renderMeal("breakfast", "🍳 Breakfast")}
      {renderMeal("lunch", "🍚 Lunch")}
      {renderMeal("snack", "☕ Snacks")}
      {renderMeal("dinner", "🌙 Dinner")}

      {/* SUMMARY */}
      {foods.length > 0 && (
        <View style={[styles.card, styles.summaryCard]}>
          <Text style={styles.sectionTitle}>Daily Summary</Text>
          <Text style={styles.summaryText}>🎯 Target: {dailyCalories} kcal</Text>
          <Text style={styles.summaryText}>🔥 Consumed: {totals.calories.toFixed(0)} kcal</Text>
          <Text style={styles.summaryText}>💪 Protein: {totals.protein.toFixed(1)} g</Text>
          <Text style={styles.summaryText}>🍞 Carbs: {totals.carbs.toFixed(1)} g</Text>
          <Text style={styles.summaryText}>🥑 Fats: {totals.fats.toFixed(1)} g</Text>
        </View>
      )}
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    flexGrow: 1,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 24,
    color: "#1F2937",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  foodRow: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  foodName: {
    fontWeight: "600",
    color: "#111827",
  },
  foodMacro: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: "#ECFDF5",
  },
  summaryText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#065F46",
  },
});
