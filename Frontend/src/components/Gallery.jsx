import React, { useState } from "react";
import {
  Modal,
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export const Gallery = ({ galleryPhoto, handlePostGallery }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const imageWidth = width / 2 - 8;

  const openModal = (item) => {
    setSelectedImage(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
        data={galleryPhoto}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.imageWrapper,
              { width: imageWidth, height: imageWidth },
            ]}
            onPress={() => openModal(item)}
          >
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />

      <TouchableOpacity style={styles.addButton} onPress={handlePostGallery}>
        <Ionicons name="add-circle" size={50} color="#5E17EB" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    backgroundColor: "#fff",
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 4,
  },
  imageWrapper: {
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    marginBottom: 4,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalImage: {
    width: width - 40,
    height: width - 40,
    borderRadius: 20,
  },
  modalCloseButton: {
    width: width - 40,
    height: width - 40,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
