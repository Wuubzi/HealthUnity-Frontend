import ScreenView from "@/components/Screen";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { Camera, ChevronDown, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function CompleteProfile() {
  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
  const cloudinary = process.env.EXPO_PUBLIC_CLOUDINARY_URL || "";
  const cloudinaryUrl = `${cloudinary}`;
  const cloudinaryUploadPreset = "profile_images"; // Crea un unsigned upload preset en Cloudinary

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState<Date>(
    new Date(2000, 0, 1)
  );
  const [genero, setGenero] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [showGeneroModal, setShowGeneroModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [idToken, setIdToken] = useState("");
  const [gmail, setGmail] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const generos = ["Masculino", "Femenino", "Otro", "Prefiero no decir"];

  useEffect(() => {
    const fetchIdToken = async () => {
      try {
        const storedIdToken = await SecureStore.getItemAsync("access_token");
        if (storedIdToken) {
          setIdToken(storedIdToken);
          const decoded: { email: string } = jwtDecode(storedIdToken) as {
            email: string;
          };
          setGmail(decoded.email);
        }
      } catch (error) {
        console.error("Error fetching access_token:", error);
      }
    };

    fetchIdToken();
  }, []);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
  };

  const uploadImageToCloudinary = async (imageUri: string) => {
    try {
      setIsUploading(true);

      // Crear FormData para la subida
      const formData = new FormData();

      // Obtener el nombre del archivo y tipo
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("file", {
        uri: imageUri,
        name: filename || "profile.jpg",
        type: type,
      } as any);

      formData.append("upload_preset", cloudinaryUploadPreset);
      formData.append("folder", "profile_images"); // Opcional: organizar en carpetas

      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading image");
      }

      const data = await response.json();
      setIsUploading(false);
      return data.secure_url; // URL de la imagen subida
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading to Cloudinary:", error);
      Alert.alert("Error", "No se pudo subir la imagen");
      return null;
    }
  };

  const completeProfile = async () => {
    // Validar campos requeridos
    if (!nombre || !apellido || !telefono || !genero || !direccion) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos");
      return;
    }

    try {
      let imageUrl = profileImageUrl;

      if (profileImage && !profileImageUrl) {
        const uploadedUrl = await uploadImageToCloudinary(profileImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
          setProfileImageUrl(uploadedUrl);
        }
      }

      const response = await fetch(
        `${apiUrl}/api/v1/paciente/complete-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            nombre,
            apellido,
            gmail,
            fechaNacimiento: fechaNacimiento.toISOString().split("T")[0], // formato YYYY-MM-DD
            telefono,
            genero,
            direccion,
            url_imagen: imageUrl || null,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Éxito", "Perfil completado correctamente");
        router.replace("/(tabs)");
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Error",
          errorData.message || "No se pudo completar el perfil"
        );
      }
    } catch (error) {
      console.error("Error completing profile:", error);
      Alert.alert("Error", "Ocurrió un error al completar el perfil");
    }
  };

  const handleGeneroSelect = (selectedGenero: string) => {
    setGenero(selectedGenero);
    setShowGeneroModal(false);
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso Necesario",
        "Necesitamos acceso a tu cámara para tomar fotos."
      );
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso Necesario",
        "Necesitamos acceso a tu galería para seleccionar fotos."
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    setShowImageModal(false);
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    setShowImageModal(false);
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <ScreenView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {/* Content */}
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-bold text-center mb-2">
            Completa Tu Perfil
          </Text>
          <Text className="text-gray-500 text-center mb-8 px-4">
            Proporciónanos algunos detalles para personalizar tu experiencia
          </Text>

          {/* Profile Picture */}
          <View className="items-center mb-8">
            <View className="relative">
              <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center overflow-hidden">
                {isUploading ? (
                  <ActivityIndicator size="large" color="#3B82F6" />
                ) : profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <User size={40} color="#666" />
                )}
              </View>
              <Pressable
                onPress={() => setShowImageModal(true)}
                className="absolute -bottom-1 -right-1 bg-blue-500 w-8 h-8 rounded-full items-center justify-center"
                disabled={isUploading}
              >
                <Camera size={16} color="white" />
              </Pressable>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Nombre *</Text>
              <TextInput
                value={nombre}
                onChangeText={setNombre}
                className="border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Ingresa tu nombre"
              />
            </View>

            {/* Apellido Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Apellido *</Text>
              <TextInput
                value={apellido}
                onChangeText={setApellido}
                className="border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Ingresa tu apellido"
              />
            </View>

            {/* Fecha de Nacimiento Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">
                Fecha de Nacimiento *
              </Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="border border-gray-300 rounded-lg px-4 py-3"
              >
                <Text className="text-gray-900">
                  {formatDate(fechaNacimiento)}
                </Text>
              </Pressable>
            </View>

            {/* Phone Number Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">
                Número de Teléfono *
              </Text>
              <View className="flex-row">
                <View className="border border-gray-300 rounded-l-lg px-3 py-3 bg-gray-50">
                  <Text className="text-gray-600">+57</Text>
                </View>
                <TextInput
                  value={telefono}
                  onChangeText={setTelefono}
                  className="flex-1 border border-l-0 border-gray-300 rounded-r-lg px-4 py-3"
                  placeholder="Ingresa tu número"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Dirección Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">
                Dirección *
              </Text>
              <TextInput
                value={direccion}
                onChangeText={setDireccion}
                className="border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Ingresa tu dirección"
                multiline
              />
            </View>

            {/* Gender Input */}
            <View className="mb-8">
              <Text className="text-gray-700 mb-2 font-medium">Género *</Text>
              <Pressable
                onPress={() => setShowGeneroModal(true)}
                className="border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center"
              >
                <Text className={genero ? "text-gray-900" : "text-gray-400"}>
                  {genero || "Seleccionar"}
                </Text>
                <ChevronDown size={20} color="#666" />
              </Pressable>
            </View>

            {/* Complete Profile Button */}
            <Pressable
              onPress={completeProfile}
              className="bg-blue-500 w-full py-4 rounded-full mb-6"
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Completar Perfil
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={fechaNacimiento}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setFechaNacimiento(selectedDate);
            }
          }}
          maximumDate={new Date()}
        />
      )}

      {/* Gender Selection Modal */}
      <Modal
        visible={showGeneroModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGeneroModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setShowGeneroModal(false)}
        >
          <View className="bg-white rounded-2xl w-4/5 max-w-sm">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-center">
                Selecciona tu Género
              </Text>
            </View>
            <View className="py-2">
              {generos.map((generoOption, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleGeneroSelect(generoOption)}
                  className="px-6 py-4 border-b border-gray-100"
                >
                  <Text
                    className={`text-base ${
                      genero === generoOption
                        ? "text-blue-500 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {generoOption}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              onPress={() => setShowGeneroModal(false)}
              className="p-4 border-t border-gray-200"
            >
              <Text className="text-blue-500 text-center font-semibold">
                Cancelar
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Image Selection Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImageModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setShowImageModal(false)}
        >
          <View className="bg-white rounded-t-3xl">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-center">
                Selecciona una Foto
              </Text>
            </View>
            <View className="p-4">
              <Pressable
                onPress={takePhoto}
                className="py-4 border-b border-gray-200"
              >
                <Text className="text-base text-gray-700 text-center">
                  Tomar Foto
                </Text>
              </Pressable>
              <Pressable
                onPress={pickImage}
                className="py-4 border-b border-gray-200"
              >
                <Text className="text-base text-gray-700 text-center">
                  Seleccionar de Galería
                </Text>
              </Pressable>
              {profileImage && (
                <Pressable
                  onPress={() => {
                    setProfileImage(null);
                    setProfileImageUrl("");
                    setShowImageModal(false);
                  }}
                  className="py-4 border-b border-gray-200"
                >
                  <Text className="text-base text-red-500 text-center">
                    Eliminar Foto
                  </Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => setShowImageModal(false)}
                className="py-4"
              >
                <Text className="text-base text-blue-500 text-center font-semibold">
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </ScreenView>
  );
}
