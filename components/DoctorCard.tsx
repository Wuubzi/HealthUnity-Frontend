import { Doctor } from "@/types/doctor";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Heart, Shield, Star, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Image, Modal, Pressable, Text, View } from "react-native";

interface DoctorCardProps {
  doctor: Doctor;
  onFavoriteChange?: () => void; // Callback para actualizar la lista
}

export default function DoctorCard({
  doctor,
  onFavoriteChange,
}: DoctorCardProps) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "remove">("add");
  const [loading, setLoading] = useState(false);

  // Verificar si el doctor ya está en favoritos al cargar
  useEffect(() => {
    checkIfFavorite();
  }, []);

  const checkIfFavorite = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      const idPaciente = await SecureStore.getItemAsync("id_paciente"); // Asegúrate de guardar esto al login

      if (token && idPaciente) {
        const response = await fetch(
          `${apiUrl}/api/v1/doctor/get-doctores-favoritos?idPaciente=${idPaciente}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const favoritos = await response.json();
          const favorito = favoritos.find(
            (fav: any) => fav.idDoctor === doctor.idDoctor
          );

          if (favorito) {
            setIsFavorite(true);
            // Si tu backend devuelve el ID del favorito, guárdalo
            setFavoriteId(favorito.idFavorito || null);
          }
        }
      }
    } catch (error) {
      console.error("Error verificando favorito:", error);
    }
  };

  const handleFavoritePress = (e: any) => {
    e.preventDefault(); // Evitar que se active el Link
    if (isFavorite) {
      setModalAction("remove");
    } else {
      setModalAction("add");
    }
    setShowModal(true);
  };

  const addToFavorites = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("id_token");
      const idPaciente = await SecureStore.getItemAsync("id_paciente");

      if (!token || !idPaciente) {
        Alert.alert("Error", "No se pudo obtener la información del usuario");
        return;
      }

      const response = await fetch(`${apiUrl}/api/v1/doctor/añadir-favoritos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idDoctor: doctor.idDoctor.toString(),
          idPaciente: idPaciente,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorite(true);
        setFavoriteId(data.idFavorito || null); // Si el backend devuelve el ID
        onFavoriteChange?.(); // Notificar cambio
        Alert.alert("¡Éxito!", "Doctor añadido a favoritos");
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Error",
          errorData.message || "No se pudo añadir a favoritos"
        );
      }
    } catch (error) {
      console.error("Error al añadir a favoritos:", error);
      Alert.alert("Error", "Ocurrió un error al añadir a favoritos");
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("access_token");

      if (!token) {
        Alert.alert("Error", "No se pudo obtener el token de autenticación");
        return;
      }

      if (!favoriteId) {
        Alert.alert("Error", "No se encontró el ID del favorito");
        return;
      }

      const response = await fetch(
        `${apiUrl}/api/v1/doctor/eliminar-favoritos?idFavorito=${favoriteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setIsFavorite(false);
        setFavoriteId(null);
        onFavoriteChange?.(); // Notificar cambio
        Alert.alert("Removido", "Doctor removido de favoritos");
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Error",
          errorData.message || "No se pudo remover de favoritos"
        );
      }
    } catch (error) {
      console.error("Error al remover de favoritos:", error);
      Alert.alert("Error", "Ocurrió un error al remover de favoritos");
    } finally {
      setLoading(false);
    }
  };

  const confirmAction = async () => {
    if (modalAction === "add") {
      await addToFavorites();
    } else {
      await removeFromFavorites();
    }
    setShowModal(false);
  };

  return (
    <>
      <Link
        href={`/(doctors)/doctors-details?id_doctor=${doctor.idDoctor}`}
        asChild
      >
        <Pressable className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <View className="flex-row">
            {/* Imagen del doctor */}
            {doctor.doctor_image ? (
              <Image
                source={{ uri: doctor.doctor_image }}
                className="w-20 h-20 rounded-xl mr-4"
                resizeMode="cover"
              />
            ) : (
              <View className="w-20 h-20 bg-gray-200 rounded-xl mr-4 items-center justify-center">
                <Text className="text-gray-400 text-xs">Sin foto</Text>
              </View>
            )}

            <View className="flex-1">
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1">
                  {/* Badge de Doctor Profesional */}
                  <View className="flex-row items-center mb-1">
                    <Shield size={12} color="#3B82F6" />
                    <Text className="text-blue-500 text-xs ml-1">
                      Doctor Profesional
                    </Text>
                  </View>

                  <Text className="font-semibold text-gray-900 text-base mb-1">
                    {doctor.nombre} {doctor.apellido}
                  </Text>
                  <Text className="text-gray-500 text-sm mb-2">
                    {doctor.especialidad}
                  </Text>
                </View>

                {/* Botón de favorito */}
                <Pressable className="p-1" onPress={handleFavoritePress}>
                  <Heart
                    size={20}
                    color={isFavorite ? "#EF4444" : "#E5E7EB"}
                    fill={isFavorite ? "#EF4444" : "transparent"}
                  />
                </Pressable>
              </View>

              <View className="flex-row items-center">
                <Star size={14} color="#FFA500" fill="#FFA500" />
                <Text className="text-sm text-gray-600 ml-1">
                  {doctor.rating.toFixed(1)} ({doctor.number_reviews}{" "}
                  {doctor.number_reviews === 1 ? "review" : "reviews"})
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Link>

      {/* Modal de confirmación */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            {/* Header del modal */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">
                  {modalAction === "add"
                    ? "Añadir a Favoritos"
                    : "Remover de Favoritos"}
                </Text>
              </View>
              <Pressable onPress={() => setShowModal(false)}>
                <X size={24} color="#6B7280" />
              </Pressable>
            </View>

            {/* Contenido del modal */}
            <View className="items-center mb-6">
              {/* Imagen del doctor */}
              {doctor.doctor_image ? (
                <Image
                  source={{ uri: doctor.doctor_image }}
                  className="w-20 h-20 rounded-full mb-4"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-20 h-20 bg-gray-200 rounded-full mb-4 items-center justify-center">
                  <Text className="text-gray-400 text-xs">Sin foto</Text>
                </View>
              )}

              <Text className="text-base font-semibold text-gray-900 text-center mb-1">
                {doctor.nombre} {doctor.apellido}
              </Text>
              <Text className="text-sm text-gray-500 text-center mb-4">
                {doctor.especialidad}
              </Text>

              <Text className="text-gray-600 text-center">
                {modalAction === "add"
                  ? "¿Deseas añadir este doctor a tu lista de favoritos?"
                  : "¿Deseas remover este doctor de tu lista de favoritos?"}
              </Text>
            </View>

            {/* Botones de acción */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 bg-gray-100 py-3 rounded-full"
              >
                <Text className="text-gray-700 text-center font-semibold">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={confirmAction}
                disabled={loading}
                className={`flex-1 py-3 rounded-full ${
                  modalAction === "add" ? "bg-blue-500" : "bg-red-500"
                } ${loading ? "opacity-50" : ""}`}
              >
                <Text className="text-white text-center font-semibold">
                  {loading
                    ? "Procesando..."
                    : modalAction === "add"
                      ? "Sí, Añadir"
                      : "Sí, Remover"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
