import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";

export const Filter = ({ onSelectFilter, setCtgy }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "", label: "All", value: "all" },
    { id: 1, label: "Music", value: "music" },
    { id: 2, label: "Stand Up Comedy", value: "standUpComedy" },
    { id: 3, label: "Performance", value: "performance" },
    { id: 4, label: "Competitions", value: "competitions" },
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category.value);
    onSelectFilter(category.value);
    setCtgy(category.id);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.buttonsContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.value}
            style={[
              styles.button,
              selectedCategory === category.value && styles.selectedButton,
            ]}
            onPress={() => handleCategoryChange(category)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedCategory === category.value &&
                  styles.selectedButtonText,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  buttonsContainer: {
    paddingHorizontal: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: "#5E17EB",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  selectedButtonText: {
    color: "#fff",
  },
});
