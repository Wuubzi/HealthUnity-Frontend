import ScreenView from "@/components/Screen";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { ChevronDown, User } from "lucide-react-native";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const cloudinary = process.env.EXPO_PUBLIC_CLOUDINARY_API_URL || "";
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";

  const cloudinaryUrl = `${cloudinary}`;
  const cloudinaryUploadPreset = "profile_images";

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState<Date>(
    new Date(1990, 0, 15)
  );
  const [genero, setGenero] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [showGeneroModal, setShowGeneroModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generos = ["Masculino", "Femenino", "Otro", "Prefiero no decir"];

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

  const handleGeneroSelect = (selectedGenero: string) => {
    setGenero(selectedGenero);
    setShowGeneroModal(false);
  };

  const uploadImageToCloudinary = async (imageUri: string) => {
    try {
      setIsUploading(true);

      const formData = new FormData();

      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("file", {
        uri: imageUri,
        name: filename || "profile.jpg",
        type: type,
      } as any);

      formData.append("upload_preset", cloudinaryUploadPreset);
      formData.append("folder", "profile_images");

      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudinary error:", errorData);
        throw new Error("Error uploading image");
      }

      const data = await response.json();
      setIsUploading(false);

      console.log("Imagen subida exitosamente:", data.secure_url);
      return data.secure_url;
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading to Cloudinary:", error);
      Alert.alert("Error", "No se pudo subir la imagen");
      return null;
    }
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
      // Resetear la URL cuando se selecciona una nueva imagen
      setProfileImageUrl("");
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
      // Resetear la URL cuando se selecciona una nueva imagen
      setProfileImageUrl("");
    }
  };

  const handleSave = async () => {
    // Validar que los campos requeridos estén completos
    if (!nombre || !apellido || !telefono) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos");
      return;
    }

    setIsSaving(true);
    const token = await SecureStore.getItemAsync("access_token");

    try {
      let imageUrl = profileImageUrl;

      // Si hay una imagen local nueva, subirla primero a Cloudinary
      if (profileImage && !profileImageUrl) {
        const uploadedUrl = await uploadImageToCloudinary(profileImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
          setProfileImageUrl(uploadedUrl);
        } else {
          // Si falla la subida, preguntar si quiere continuar sin imagen
          Alert.alert(
            "Advertencia",
            "No se pudo subir la imagen. ¿Deseas continuar sin actualizar la foto?",
            [
              {
                text: "Cancelar",
                style: "cancel",
                onPress: () => setIsSaving(false),
              },
              { text: "Continuar", onPress: () => saveProfile(token, null) },
            ]
          );
          return;
        }
      }

      await saveProfile(token, imageUrl);
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "No se pudo actualizar el perfil");
      setIsSaving(false);
    }
  };

  const saveProfile = async (token: string | null, imageUrl: string | null) => {
    const userData = {
      nombre,
      apellido,
      gmail: email,
      fechaNacimiento: fechaNacimiento.toISOString().split("T")[0],
      genero,
      direccion,
      telefono,
      url_imagen: imageUrl || profileImageUrl,
    };

    try {
      const response = await fetch(`${apiUrl}/api/v1/paciente/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el perfil");
      }

      Alert.alert("Éxito", "Perfil actualizado correctamente");
      console.log("Datos guardados:", userData);
    } catch (error) {
      console.error("Error al guardar:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const getUserData = async () => {
    const token = await SecureStore.getItemAsync("access_token");
    const id_token = await SecureStore.getItemAsync("id_token");
    try {
      if (token) {
        if (!id_token) {
          return;
        }
        const decoded: { email: string } = jwtDecode(id_token) as {
          email: string;
        };
        const response = await fetch(
          `${apiUrl}/api/v1/paciente/getPaciente?gmail=${decoded.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching user data");
        }
        const data = await response.json();
        setNombre(data?.nombre || "");
        setApellido(data?.apellido || "");
        setEmail(data?.gmail || "");
        setDireccion(data?.direccion || "");
        setTelefono(data?.telefono || "");
        setGenero(data?.genero || "");

        // Guardar ambas: la imagen local y la URL
        if (data?.url_imagen) {
          setProfileImage(data.url_imagen);
          setProfileImageUrl(data.url_imagen);
        }

        // Convertir la fecha del backend (YYYY-MM-DD) a objeto Date
        if (data?.fechaNacimiento) {
          const [year, month, day] = data.fechaNacimiento.split("-");
          setFechaNacimiento(
            new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
          );
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "No se pudo cargar la información del perfil");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <ScreenView
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top + 60 }}
    >
      {/* Profile Photo */}
      <View className="items-center px-6 py-8">
        <View className="relative">
          <View className="w-24 h-24 bg-gray-200 rounded-full mb-4 overflow-hidden">
            {isUploading ? (
              <View className="w-full h-full rounded-full bg-blue-100 items-center justify-center">
                <ActivityIndicator size="large" color="#3B82F6" />
              </View>
            ) : profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full rounded-full bg-blue-100 items-center justify-center">
                <User size={32} color="#3B82F6" />
              </View>
            )}
          </View>
        </View>
        <Pressable
          onPress={() => setShowImageModal(true)}
          disabled={isUploading || isSaving}
        >
          <Text
            className={`font-medium ${isUploading || isSaving ? "text-gray-400" : "text-blue-500"}`}
          >
            {isUploading ? "Subiendo..." : "Cambiar Foto"}
          </Text>
        </Pressable>
      </View>

      {/* Form Fields */}
      <ScrollView className="flex-1 px-6">
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Nombre *</Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            className="border border-gray-200 rounded-lg p-4"
            placeholder="Ingresa tu nombre"
            editable={!isSaving}
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Apellido *</Text>
          <TextInput
            value={apellido}
            onChangeText={setApellido}
            className="border border-gray-200 rounded-lg p-4"
            placeholder="Ingresa tu apellido"
            editable={!isSaving}
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">
            Correo Electrónico
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={false}
          />
          <Text className="text-gray-500 text-xs mt-1">
            El correo no se puede modificar
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">
            Número de Teléfono *
          </Text>
          <View className="flex-row">
            <View className="border border-gray-300 rounded-l-lg px-3 py-4 bg-gray-50">
              <Text className="text-gray-600">+57</Text>
            </View>
            <TextInput
              value={telefono}
              onChangeText={setTelefono}
              className="flex-1 border border-l-0 border-gray-300 rounded-r-lg px-4 py-4"
              placeholder="Ingresa tu número"
              keyboardType="phone-pad"
              editable={!isSaving}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">
            Fecha de Nacimiento
          </Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="border border-gray-200 rounded-lg p-4"
            disabled={isSaving}
          >
            <Text className="text-gray-900">{formatDate(fechaNacimiento)}</Text>
          </Pressable>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Género</Text>
          <Pressable
            onPress={() => setShowGeneroModal(true)}
            className="border border-gray-200 rounded-lg p-4 flex-row justify-between items-center"
            disabled={isSaving}
          >
            <Text className={`${genero ? "text-gray-900" : "text-gray-400"}`}>
              {genero || "Seleccionar"}
            </Text>
            <ChevronDown size={20} color="#666" />
          </Pressable>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Dirección</Text>
          <TextInput
            value={direccion}
            onChangeText={setDireccion}
            className="border border-gray-200 rounded-lg p-4"
            placeholder="Ingresa tu dirección"
            multiline
            numberOfLines={2}
            editable={!isSaving}
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="px-6 py-4 bg-white border-t border-gray-100">
        <Pressable
          onPress={handleSave}
          className={`py-4 rounded-lg ${isSaving || isUploading ? "bg-blue-300" : "bg-blue-500"}`}
          disabled={isSaving || isUploading}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Guardar Cambios
            </Text>
          )}
        </Pressable>
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
