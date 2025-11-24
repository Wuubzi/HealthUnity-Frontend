import DoctorCard from "@/components/DoctorCard";
import ScreenView from "@/components/Screen";
import { FavoriteDoctorDTO } from "@/types/favoriteDoctor";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function Favorites() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
  const [favoriteDoctors, setFavoriteDoctors] = useState<FavoriteDoctorDTO[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = await SecureStore.getItemAsync("access_token");
      const idPaciente = await SecureStore.getItemAsync("id_paciente");

      if (!token || !idPaciente) {
        console.log("No se encontró token o id_paciente");
        return;
      }

      const response = await fetch(
        `${apiUrl}/api/v1/doctor/get-doctores-favoritos?idPaciente=${idPaciente}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFavoriteDoctors(data);
      } else {
        console.error("Error al cargar favoritos:", response.status);
      }
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleFavoriteChange = () => {
    // Recargar la lista cuando se elimine un favorito
    loadFavorites();
  };

  const onRefresh = () => {
    loadFavorites(true);
  };

  return (
    <ScreenView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">Favoritos</Text>
        </View>
        {!loading && (
          <Text className="text-gray-500 text-sm mt-2">
            {favoriteDoctors.length}{" "}
            {favoriteDoctors.length === 1 ? "doctor" : "doctores"} favoritos
          </Text>
        )}
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">
            Cargando doctores favoritos...
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteDoctors}
          renderItem={({ item }) => (
            <DoctorCard doctor={item} onFavoriteChange={handleFavoriteChange} />
          )}
          keyExtractor={(item) => item.idDoctor.toString()}
          contentContainerStyle={{ padding: 24 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Text className="text-6xl mb-4">💙</Text>
              <Text className="text-gray-500 text-center text-lg font-semibold">
                No tienes doctores favoritos
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-2 px-8">
                Explora y añade doctores a tus favoritos para encontrarlos
                fácilmente aquí
              </Text>
            </View>
          }
        />
      )}
    </ScreenView>
  );
}
