import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [foodQty, setFoodQty] = useState("");
  const [result, setResult] = useState<any>(null);

  const calculateDiet = () => {
    const a = Number(age);
    const h = Number(height);
    const w = Number(weight);
    const q = Number(foodQty);

    if (!a || !h || !w || !q) return;

    const bmr = 10 * w + 6.25 * h - 5 * a + 5;
    const dailyCalories = bmr * 1.55;

    const calories = q * 2.5;
    const protein = q * 0.08;
    const carbs = q * 0.3;
    const fats = q * 0.05;

    setResult({
      dailyCalories: dailyCalories.toFixed(0),
      calories: calories.toFixed(1),
      protein: protein.toFixed(1),
      carbs: carbs.toFixed(1),
      fats: fats.toFixed(1),
      remaining: (dailyCalories - calories).toFixed(0),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Diet Planner</Text>

      <TextInput style={styles.input} placeholder="Age" keyboardType="numeric" onChangeText={setAge} />
      <TextInput style={styles.input} placeholder="Height (cm)" keyboardType="numeric" onChangeText={setHeight} />
      <TextInput style={styles.input} placeholder="Weight (kg)" keyboardType="numeric" onChangeText={setWeight} />
      <TextInput style={styles.input} placeholder="Food Quantity (grams)" keyboardType="numeric" onChangeText={setFoodQty} />

      <Button title="Calculate" onPress={calculateDiet} />

      {result && (
        <View style={styles.result}>
          <Text>Daily Calories Needed: {result.dailyCalories} kcal</Text>
          <Text>Calories Consumed: {result.calories} kcal</Text>
          <Text>Protein: {result.protein} g</Text>
          <Text>Carbs: {result.carbs} g</Text>
          <Text>Fats: {result.fats} g</Text>
          <Text>Remaining Calories: {result.remaining} kcal</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 6 },
  result: { marginTop: 20, padding: 15, backgroundColor: "#e8f5e9", borderRadius: 6 },
});
