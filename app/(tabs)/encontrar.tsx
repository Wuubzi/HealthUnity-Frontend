import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Filter, Heart, MapPin, Search, Star, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Encontrar() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todos");
  const [sortBy, setSortBy] = useState("relevancia");
  const [especialidades, setEspecialidades] = useState<any>([]);
  const [doctors, setDoctors] = useState<any>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<any>([]);

  // Opciones de filtro
  const sortOptions = [
    { id: "relevancia", label: "Relevancia" },
    { id: "rating", label: "Mejor Valorados" },
    { id: "cercanos", label: "Más Cercanos" },
    { id: "reviews", label: "Más Reviews" },
  ];

  const getEspecialidades = async () => {
    try {
      const token = await SecureStore.getItemAsync("id_token");
      if (token) {
        const response = await fetch(
          `${apiUrl}/api/v1/especialidades/getEspecialidades`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setEspecialidades([{ idEspecialidad: 0, nombre: "Todos" }, ...data]);
        }
      }
    } catch (error) {
      console.error("Error fetching especialidades:", error);
    }
  };

  const getDoctors = async () => {
    try {
      const token = await SecureStore.getItemAsync("id_token");
      if (token) {
        // Aquí deberías llamar a tu endpoint de doctores
        // Por ahora uso datos de ejemplo
        const mockDoctors = [
          {
            id: 1,
            name: "Dr. Anna Copper",
            specialty: "Orthopedic Surgeon",
            rating: 4.9,
            reviews: 127,
            distance: "2.5 km",
            available: true,
          },
          {
            id: 2,
            name: "Dr. Robert Fox",
            specialty: "Cardiologist",
            rating: 4.8,
            reviews: 98,
            distance: "3.1 km",
            available: true,
          },
          {
            id: 3,
            name: "Dr. Cody Fisher",
            specialty: "Neurologist",
            rating: 4.7,
            reviews: 85,
            distance: "1.8 km",
            available: false,
          },
          {
            id: 4,
            name: "Dra. María González",
            specialty: "Dermatologist",
            rating: 4.9,
            reviews: 156,
            distance: "4.2 km",
            available: true,
          },
          {
            id: 5,
            name: "Dr. Carlos Mendoza",
            specialty: "Pediatrician",
            rating: 4.6,
            reviews: 73,
            distance: "2.9 km",
            available: true,
          },
        ];
        setDoctors(mockDoctors);
        setFilteredDoctors(mockDoctors);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    getEspecialidades();
    getDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedSpecialty, sortBy, doctors]);

  const applyFilters = () => {
    let filtered = [...doctors];

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por especialidad
    if (selectedSpecialty !== "Todos") {
      filtered = filtered.filter((doctor) =>
        doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }

    // Ordenar
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "cercanos":
        filtered.sort(
          (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
        );
        break;
      case "reviews":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    setFilteredDoctors(filtered);
  };

  const DoctorCard = ({ doctor }: any) => (
    <Link href={`/(doctors)/doctors-details`} asChild>
      <Pressable className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
        <View className="flex-row">
          <View className="w-20 h-20 bg-gray-200 rounded-xl mr-4" />
          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 text-base mb-1">
                  {doctor.name}
                </Text>
                <Text className="text-gray-500 text-sm mb-2">
                  {doctor.specialty}
                </Text>
              </View>
              <Pressable className="p-1">
                <Heart size={20} color="#E5E7EB" />
              </Pressable>
            </View>

            <View className="flex-row items-center mb-2">
              <Star size={14} color="#FFA500" fill="#FFA500" />
              <Text className="text-sm text-gray-600 ml-1">
                {doctor.rating} ({doctor.reviews} reviews)
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <MapPin size={14} color="#6B7280" />
                <Text className="text-sm text-gray-500 ml-1">
                  {doctor.distance} de distancia
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${
                  doctor.available ? "bg-green-50" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    doctor.available ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {doctor.available ? "Disponible" : "Ocupado"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <ScreenView className="flex-1 bg-gray-50">
      {/* Header con búsqueda */}
      <View className="bg-white px-6 pt-4 pb-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Encontrar Doctores
        </Text>

        {/* Barra de búsqueda */}
        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 mb-3">
          <Search size={20} color="#6B7280" />
          <TextInput
            placeholder="Buscar doctor o especialidad..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <X size={20} color="#6B7280" />
            </Pressable>
          )}
        </View>

        {/* Botón de filtros */}
        <Pressable
          onPress={() => setShowFilters(true)}
          className="flex-row items-center justify-center bg-blue-500 rounded-xl py-3"
        >
          <Filter size={18} color="white" />
          <Text className="text-white font-semibold ml-2">
            Filtros y Ordenar
          </Text>
        </Pressable>

        {/* Filtros activos */}
        {(selectedSpecialty !== "Todos" || sortBy !== "relevancia") && (
          <View className="flex-row flex-wrap mt-3">
            {selectedSpecialty !== "Todos" && (
              <View className="bg-blue-50 px-3 py-1 rounded-full mr-2 mb-2 flex-row items-center">
                <Text className="text-blue-600 text-sm mr-1">
                  {selectedSpecialty}
                </Text>
                <Pressable onPress={() => setSelectedSpecialty("Todos")}>
                  <X size={14} color="#3B82F6" />
                </Pressable>
              </View>
            )}
            {sortBy !== "relevancia" && (
              <View className="bg-blue-50 px-3 py-1 rounded-full mr-2 mb-2 flex-row items-center">
                <Text className="text-blue-600 text-sm mr-1">
                  {sortOptions.find((opt) => opt.id === sortBy)?.label}
                </Text>
                <Pressable onPress={() => setSortBy("relevancia")}>
                  <X size={14} color="#3B82F6" />
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Lista de doctores */}
      <FlatList
        data={filteredDoctors}
        renderItem={({ item }) => <DoctorCard doctor={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 24 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-gray-500 text-center">
              No se encontraron doctores
            </Text>
            <Text className="text-gray-400 text-sm text-center mt-2">
              Intenta con otros filtros de búsqueda
            </Text>
          </View>
        }
      />

      {/* Modal de filtros */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
            {/* Header del modal */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-900">
                Filtros y Ordenar
              </Text>
              <Pressable onPress={() => setShowFilters(false)}>
                <X size={24} color="#6B7280" />
              </Pressable>
            </View>

            {/* Especialidades */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Especialidad
              </Text>
              <View className="flex-row flex-wrap">
                {especialidades.map((esp: any) => (
                  <Pressable
                    key={esp.idEspecialidad}
                    onPress={() => setSelectedSpecialty(esp.nombre)}
                    className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                      selectedSpecialty === esp.nombre
                        ? "bg-blue-500"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedSpecialty === esp.nombre
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {esp.nombre}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Ordenar por */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Ordenar por
              </Text>
              {sortOptions.map((option) => (
                <Pressable
                  key={option.id}
                  onPress={() => setSortBy(option.id)}
                  className="flex-row items-center justify-between py-3 border-b border-gray-100"
                >
                  <Text className="text-gray-700">{option.label}</Text>
                  <View
                    className={`w-5 h-5 rounded-full border-2 ${
                      sortBy === option.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    } items-center justify-center`}
                  >
                    {sortBy === option.id && (
                      <View className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Botones de acción */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => {
                  setSelectedSpecialty("Todos");
                  setSortBy("relevancia");
                }}
                className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
              >
                <Text className="text-gray-700 font-semibold">Limpiar</Text>
              </Pressable>
              <Pressable
                onPress={() => setShowFilters(false)}
                className="flex-1 bg-blue-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-semibold">Aplicar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenView>
  );
}
