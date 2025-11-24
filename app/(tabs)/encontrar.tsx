import DoctorCard from "@/components/DoctorCard";
import ScreenView from "@/components/Screen";
import { Doctor, PaginatedResponse } from "@/types/encontrar";
import { useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Filter, Search, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Encontrar() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(
    null
  );
  const [sortBy, setSortBy] = useState("relevancia");
  const [especialidades, setEspecialidades] = useState<any>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 10;

  // Opciones de filtro
  const sortOptions = [
    { id: "rating", label: "Mejor Valorados" },
    { id: "reviews", label: "Más Reviews" },
  ];

  const getEspecialidades = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
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
          setEspecialidades([
            { idEspecialidad: null, nombre: "Todos" },
            ...data,
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching especialidades:", error);
    }
  };

  const getDoctors = async (
    pageNum: number = 1,
    append: boolean = false,
    search: string = "",
    especialidadId: number | null = null,
    orderBy: string = "relevancia"
  ) => {
    if (loading) return;

    try {
      setLoading(true);
      if (pageNum === 1 && !append) {
        setInitialLoading(true);
      }

      const token = await SecureStore.getItemAsync("access_token");
      if (token) {
        // Construir URL con parámetros
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          orderBy: orderBy,
        });

        if (search) {
          params.append("search", search);
        }

        if (especialidadId !== null) {
          params.append("especialidadId", especialidadId.toString());
        }

        const response = await fetch(
          `${apiUrl}/api/v1/doctor/getDoctores?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data: PaginatedResponse = await response.json();

          if (append) {
            setDoctors((prev) => [...prev, ...data.content]);
          } else {
            setDoctors(data.content);
          }

          setHasMore(data.hasNext);
          setTotalPages(data.totalPages);
          setPage(pageNum);
        } else {
          console.error("Error en la respuesta:", response.status);
        }
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    getEspecialidades();
    getDoctors(1, false);
  }, []);

  // Efecto separado para escuchar cambios en el parámetro especialidadId
  useEffect(() => {
    if (params.especialidadId) {
      const especialidadId = parseInt(params.especialidadId as string);
      setSelectedSpecialty(especialidadId);
      getDoctors(1, false, searchQuery, especialidadId, sortBy);
    }
  }, [params.especialidadId]);

  // Efecto para aplicar filtros cuando cambien
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getDoctors(1, false, searchQuery, selectedSpecialty, sortBy);
    }, 500); // Debounce de 500ms para la búsqueda

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedSpecialty, sortBy]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      getDoctors(nextPage, true, searchQuery, selectedSpecialty, sortBy);
    }
  };

  const handleClearFilters = () => {
    setSelectedSpecialty(null);
    setSortBy("relevancia");
    setSearchQuery("");
  };

  const getSelectedSpecialtyName = () => {
    if (selectedSpecialty === null) return null;
    const esp = especialidades.find(
      (e: any) => e.idEspecialidad === selectedSpecialty
    );
    return esp?.nombre;
  };

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
        {(selectedSpecialty !== null || sortBy !== "relevancia") && (
          <View className="flex-row flex-wrap mt-3">
            {selectedSpecialty !== null && (
              <View className="bg-blue-50 px-3 py-1 rounded-full mr-2 mb-2 flex-row items-center">
                <Text className="text-blue-600 text-sm mr-1">
                  {getSelectedSpecialtyName()}
                </Text>
                <Pressable onPress={() => setSelectedSpecialty(null)}>
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

        {/* Información de resultados */}
        {!initialLoading && (
          <View className="mt-2">
            <Text className="text-gray-500 text-sm">
              Mostrando {doctors.length} doctores
              {totalPages > 1 && ` - Página ${page} de ${totalPages}`}
            </Text>
          </View>
        )}
      </View>

      {/* Lista de doctores */}
      {initialLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">Cargando doctores...</Text>
        </View>
      ) : (
        <FlatList
          data={doctors}
          renderItem={({ item }) => <DoctorCard doctor={item} />}
          keyExtractor={(item) => item.idDoctor.toString()}
          contentContainerStyle={{ padding: 24 }}
          ListFooterComponent={
            <>
              {hasMore && !loading && doctors.length > 0 && (
                <Pressable
                  onPress={loadMore}
                  className="bg-blue-500 py-4 rounded-xl items-center mb-4"
                >
                  <Text className="text-white font-semibold text-base">
                    Cargar Más Doctores
                  </Text>
                </Pressable>
              )}
              {loading && !initialLoading && (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color="#3B82F6" />
                  <Text className="text-gray-500 mt-2">
                    Cargando más doctores...
                  </Text>
                </View>
              )}
              {!hasMore && doctors.length > 0 && (
                <View className="py-4 items-center">
                  <Text className="text-gray-400 text-sm">
                    No hay más doctores disponibles
                  </Text>
                </View>
              )}
            </>
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Text className="text-gray-500 text-center text-lg font-semibold">
                No se encontraron doctores
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-2">
                Intenta con otros filtros de búsqueda
              </Text>
              {(searchQuery ||
                selectedSpecialty ||
                sortBy !== "relevancia") && (
                <Pressable
                  onPress={handleClearFilters}
                  className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
                >
                  <Text className="text-white font-semibold">
                    Limpiar Filtros
                  </Text>
                </Pressable>
              )}
            </View>
          }
        />
      )}

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
                {especialidades.map((esp: any, index: number) => (
                  <Pressable
                    key={
                      esp.idEspecialidad !== null
                        ? esp.idEspecialidad.toString()
                        : `todos-${index}`
                    }
                    onPress={() => setSelectedSpecialty(esp.idEspecialidad)}
                    className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                      selectedSpecialty === esp.idEspecialidad
                        ? "bg-blue-500"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedSpecialty === esp.idEspecialidad
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
                onPress={handleClearFilters}
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
