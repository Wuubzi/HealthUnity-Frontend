import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Send, Star } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DoctorReview() {
  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
  const insets = useSafeAreaInsets();
  const { idDoctor, nombreDoctor, apellidoDoctor, especialidad, urlImagen } =
    useLocalSearchParams();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Por favor selecciona una calificación");
      return;
    }

    if (comment.trim() === "") {
      Alert.alert("Error", "Por favor escribe un comentario");
      return;
    }
    const token = await SecureStore.getItemAsync("access_token");
    const idPaciente = await SecureStore.getItemAsync("id_paciente");

    // Aquí enviarías la review al backend
    const response = await fetch(`${apiUrl}/api/v1/doctor/añadir-opinion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        estrellas: rating,
        comentario: comment,
        idDoctor: idDoctor,
        idPaciente: idPaciente,
      }),
    });
    if (!response.ok) {
      console.error("Error en la respuesta:", response);
    }

    Alert.alert("Éxito", "Tu reseña ha sido enviada correctamente", [
      { text: "OK", onPress: () => console.log("Review submitted") },
    ]);
    router.push("/(tabs)/asistente");
  };

  const renderStar = (index: number) => {
    const isFilled = index <= (hoveredRating || rating);

    return (
      <Pressable
        key={index}
        onPress={() => setRating(index)}
        onPressIn={() => setHoveredRating(index)}
        onPressOut={() => setHoveredRating(0)}
        className="p-1"
      >
        <Star
          size={40}
          color="#FCD34D"
          fill={isFilled ? "#FCD34D" : "transparent"}
          strokeWidth={2}
        />
      </Pressable>
    );
  };

  const getRatingText = () => {
    switch (rating) {
      case 1:
        return "Muy insatisfecho";
      case 2:
        return "Insatisfecho";
      case 3:
        return "Aceptable";
      case 4:
        return "Bueno";
      case 5:
        return "Excelente";
      default:
        return "Selecciona tu calificación";
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 80 }}>
      <ScrollView className="flex-1 px-6">
        {/* Doctor Card */}
        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 -mt-6 mb-6">
          <View className="flex-row items-center">
            {urlImagen ? (
              <Image
                source={{
                  uri: Array.isArray(urlImagen) ? urlImagen[0] : urlImagen,
                }}
                className="w-16 h-16 rounded-xl mr-4"
                resizeMode="cover"
              />
            ) : (
              <View className="w-16 h-16 bg-gray-200 rounded-xl mr-4 items-center justify-center">
                <Text className="text-gray-400 text-xs">Sin foto</Text>
              </View>
            )}
            <View className="flex-1">
              <Text className="font-semibold text-gray-900 text-lg">
                Dr. {nombreDoctor} {apellidoDoctor}
              </Text>
              <Text className="text-gray-500">{especialidad}</Text>
            </View>
          </View>
        </View>

        {/* Rating Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            ¿Cómo calificarías tu experiencia?
          </Text>

          <View className="bg-gray-50 rounded-xl p-6 items-center">
            <View className="flex-row justify-center mb-3">
              {[1, 2, 3, 4, 5].map((index) => renderStar(index))}
            </View>
            <Text
              className={`text-base font-medium ${
                rating > 0 ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {getRatingText()}
            </Text>
          </View>
        </View>

        {/* Comment Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Cuéntanos tu experiencia
          </Text>
          <Text className="text-gray-500 text-sm mb-3">
            Comparte detalles sobre la atención recibida
          </Text>

          <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <TextInput
              className="text-gray-900 min-h-[120px] text-base"
              placeholder="Escribe tu opinión aquí..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
              maxLength={500}
            />
            <Text className="text-gray-400 text-xs text-right mt-2">
              {comment.length}/500
            </Text>
          </View>
        </View>

        {/* Quick Tips */}
        <View className="bg-blue-50 rounded-xl p-4 mb-6">
          <Text className="text-blue-800 font-medium mb-2">
            💡 Consejos para tu reseña
          </Text>
          <View className="space-y-1">
            <Text className="text-blue-700 text-sm">
              • Sé específico sobre la atención recibida
            </Text>
            <Text className="text-blue-700 text-sm">
              • Menciona la puntualidad y tiempo de espera
            </Text>
            <Text className="text-blue-700 text-sm">
              • Describe cómo te sentiste durante la consulta
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="px-6 py-4 border-t border-gray-100">
        <Pressable
          onPress={handleSubmitReview}
          className={`py-4 rounded-full flex-row items-center justify-center ${
            rating > 0 && comment.trim() !== "" ? "bg-blue-500" : "bg-gray-300"
          }`}
          disabled={rating === 0 || comment.trim() === ""}
        >
          <Send size={20} color="white" />
          <Text className="text-white text-center font-semibold text-lg ml-2">
            Enviar Reseña
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
