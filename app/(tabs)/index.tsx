import ScreenView from "@/components/Screen";
import { Especialidad, ProximaCita, TopDoctor } from "@/types";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import {
  Calendar,
  Clock,
  Heart,
  Info,
  Shield,
  Star,
  User,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

const formatearFecha = (fechaStr: string) => {
  const meses = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];

  const fecha = new Date(fechaStr + "T00:00:00");
  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();

  return `${dia} de ${mes} ${anio}`;
};

const formatearHora = (horaStr: string) => {
  const [horas, minutos] = horaStr.split(":");
  const horaInicio = parseInt(horas);
  const minutosInicio = parseInt(minutos);

  let horaFin = horaInicio;
  let minutosFin = minutosInicio + 30;

  if (minutosFin >= 60) {
    horaFin += 1;
    minutosFin -= 60;
  }

  const periodoInicio = horaInicio >= 12 ? "PM" : "AM";
  const hora12Inicio =
    horaInicio > 12 ? horaInicio - 12 : horaInicio === 0 ? 12 : horaInicio;

  const periodoFin = horaFin >= 12 ? "PM" : "AM";
  const hora12Fin = horaFin > 12 ? horaFin - 12 : horaFin === 0 ? 12 : horaFin;

  const minutosInicioStr = minutosInicio.toString().padStart(2, "0");
  const minutosFinStr = minutosFin.toString().padStart(2, "0");

  if (periodoInicio === periodoFin) {
    return `${hora12Inicio}:${minutosInicioStr} - ${hora12Fin}:${minutosFinStr} ${periodoFin}`;
  } else {
    return `${hora12Inicio}:${minutosInicioStr} ${periodoInicio} - ${hora12Fin}:${minutosFinStr} ${periodoFin}`;
  }
};

export default function HomeScreen() {
  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";

  const [userData, setUserData] = useState<any>(null);
  const [topDoctores, setTopDoctores] = useState<TopDoctor[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [proximaCita, setProximaCita] = useState<ProximaCita | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  // Estados de carga
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingCita, setIsLoadingCita] = useState(false);
  const [isLoadingDoctores, setIsLoadingDoctores] = useState(false);
  const [isLoadingEspecialidades, setIsLoadingEspecialidades] = useState(false);

  // Estado para modal de favoritos
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<TopDoctor | null>(null);
  const [favoriteAction, setFavoriteAction] = useState<"add" | "remove">("add");
  const [loadingFavorite, setLoadingFavorite] = useState(false);

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
        setUserData(data);
        await SecureStore.setItemAsync("id_paciente", data.id.toString());
        return data;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const loadFavorites = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      const idPaciente = await SecureStore.getItemAsync("id_paciente");

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
          const ids = new Set<number>(
            favoritos.map((fav: { idDoctor: number }) => fav.idDoctor)
          );
          setFavoriteIds(ids);
        }
      }
    } catch (error) {
      console.error("Error cargando favoritos:", error);
    }
  };

  const getEspecialidades = async () => {
    setIsLoadingEspecialidades(true);
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
        if (!response.ok) {
          throw new Error("Error fetching especialidades");
        }
        const data = await response.json();
        setEspecialidades(data || []);
      }
    } catch (error) {
      console.error("Error fetching especialidades:", error);
      setEspecialidades([]);
    } finally {
      setIsLoadingEspecialidades(false);
    }
  };

  const getCitaProxima = async (pacienteId: number) => {
    setIsLoadingCita(true);
    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (token && pacienteId) {
        const response = await fetch(
          `${apiUrl}/api/v1/citas/proxima-cita?idPaciente=${pacienteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error fetching proxima cita");
        }
        const data = await response.json();
        setProximaCita(data);
      }
    } catch (error) {
      console.error("Error fetching proxima cita:", error);
      setProximaCita(null);
    } finally {
      setIsLoadingCita(false);
    }
  };

  const getTopDoctores = async () => {
    setIsLoadingDoctores(true);
    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (token) {
        const response = await fetch(`${apiUrl}/api/v1/doctor/top-doctores`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error fetching top doctores");
        }
        const data = await response.json();
        setTopDoctores(data || []);
      }
    } catch (error) {
      console.error("Error fetching top doctores:", error);
      setTopDoctores([]);
    } finally {
      setIsLoadingDoctores(false);
    }
  };

  const handleFavoritePress = (doctor: TopDoctor, e: any) => {
    e.preventDefault();
    setSelectedDoctor(doctor);
    if (favoriteIds.has(doctor.id)) {
      setFavoriteAction("remove");
    } else {
      setFavoriteAction("add");
    }
    setShowFavoriteModal(true);
  };

  const addToFavorites = async () => {
    if (!selectedDoctor) return;

    try {
      setLoadingFavorite(true);
      const token = await SecureStore.getItemAsync("access_token");
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
          idDoctor: selectedDoctor.id.toString(),
          idPaciente: idPaciente,
        }),
      });

      if (response.ok) {
        setFavoriteIds((prev) => new Set(prev).add(selectedDoctor.id));
        Alert.alert("Exito", "Doctor añadido a favorito");
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
      setLoadingFavorite(false);
    }
  };

  const removeFromFavorites = async () => {
    if (!selectedDoctor) return;

    try {
      setLoadingFavorite(true);
      const token = await SecureStore.getItemAsync("access_token");
      const idPaciente = await SecureStore.getItemAsync("id_paciente");

      if (!token || !idPaciente) {
        Alert.alert("Error", "No se pudo obtener el token de autenticación");
        return;
      }

      const favoritosResponse = await fetch(
        `${apiUrl}/api/v1/doctor/get-doctores-favoritos?idPaciente=${idPaciente}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (favoritosResponse.ok) {
        const favoritos = await favoritosResponse.json();
        const favorito = favoritos.find(
          (fav: any) => fav.idDoctor === selectedDoctor.id
        );

        if (favorito && favorito.idFavorito) {
          const response = await fetch(
            `${apiUrl}/api/v1/doctor/eliminar-favoritos?idFavorito=${favorito.idFavorito}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            setFavoriteIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(selectedDoctor.id);
              return newSet;
            });
            Alert.alert("Removido", "Doctor removido de favoritos");
          } else {
            Alert.alert("Error", "No se pudo remover de favoritos");
          }
        }
      }
    } catch (error) {
      console.error("Error al remover de favoritos:", error);
      Alert.alert("Error", "Ocurrió un error al remover de favoritos");
    } finally {
      setLoadingFavorite(false);
    }
  };

  const confirmFavoriteAction = async () => {
    if (favoriteAction === "add") {
      await addToFavorites();
    } else {
      await removeFromFavorites();
    }
    setShowFavoriteModal(false);
  };

  const handleEspecialidadPress = (especialidad: Especialidad) => {
    router.push(
      `/(tabs)/encontrar?especialidadId=${especialidad.idEspecialidad}`
    );
  };

  // Función para refrescar todos los datos
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const user = await getUserData();
      await Promise.all([
        getEspecialidades(),
        getTopDoctores(),
        loadFavorites(),
        user?.id ? getCitaProxima(user.id) : Promise.resolve(),
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const token = await SecureStore.getItemAsync("access_token");
        console.log(token);
        if (!token) {
          router.replace("/login");
          return;
        }

        const decoded: { exp: number } = jwtDecode(token) as { exp: number };
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          await SecureStore.deleteItemAsync("access_token");
          await SecureStore.deleteItemAsync("id_token");
          router.replace("/login");
          return;
        }

        const user = await getUserData();

        await Promise.all([
          getEspecialidades(),
          getTopDoctores(),
          loadFavorites(),
          user?.id ? getCitaProxima(user.id) : Promise.resolve(),
        ]);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [router]);

  useEffect(() => {
    if (userData?.id && !isLoading) {
      getCitaProxima(userData.id);
    }
  }, [userData?.id]);

  if (isLoading) {
    return (
      <ScreenView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">Cargando...</Text>
        </View>
      </ScreenView>
    );
  }

  return (
    <ScreenView className="flex-1 bg-white">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
      >
        {/* Header */}
        <View className="px-6 py-4 bg-white">
          <Text className="text-2xl font-bold text-gray-900">
            Hola {userData?.nombre} 👋
          </Text>
        </View>

        {/* Upcoming Schedule */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center mb-3 gap-2">
            <Text className="text-lg font-semibold text-gray-900">
              Proxima Cita
            </Text>
            <Info size={16} color="#3B82F6" className="ml-2" />
          </View>

          {isLoadingCita ? (
            <View className="bg-gray-50 rounded-xl p-6 items-center">
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text className="text-gray-500 mt-2">Cargando cita...</Text>
            </View>
          ) : proximaCita ? (
            <View className="bg-blue-500 rounded-xl p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-3">
                    <User size={24} color="#3B82F6" />
                  </View>
                  <View>
                    <Text className="text-white font-semibold">
                      Dr {proximaCita.doctor.detallesUsuario.nombre}{" "}
                      {proximaCita.doctor.detallesUsuario.apellido}
                    </Text>
                    <Text className="text-blue-100 text-sm">
                      {proximaCita.doctor.especialidad.nombre}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <View className="flex-row items-center mb-1">
                    <Calendar size={14} color="white" />
                    <Text className="text-white text-sm ml-1">
                      {formatearFecha(proximaCita.fecha)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Clock size={14} color="white" />
                    <Text className="text-white text-sm ml-1">
                      {formatearHora(proximaCita.hora)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View className="bg-gray-50 rounded-xl p-6 items-center">
              <Calendar size={40} color="#9CA3AF" className="mb-2" />
              <Text className="text-gray-500 text-center font-medium">
                No tienes citas próximas
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-1">
                Agenda una cita con un especialista
              </Text>
            </View>
          )}
        </View>

        {/* Doctor Specialty */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Especialidades Disponibles
          </Text>

          {isLoadingEspecialidades ? (
            <View className="bg-gray-50 rounded-xl p-6 items-center">
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text className="text-gray-500 mt-2">
                Cargando especialidades...
              </Text>
            </View>
          ) : especialidades.length > 0 ? (
            <FlatList
              horizontal
              data={especialidades}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.idEspecialidad.toString()}
              renderItem={({ item }) => (
                <Pressable
                  className="items-center mr-4"
                  onPress={() => handleEspecialidadPress(item)}
                >
                  <View className="w-16 h-16 bg-blue-50 rounded-2xl items-center justify-center mb-2">
                    <Text className="text-2xl">{item.icono}</Text>
                  </View>
                  <Text className="text-gray-700 text-sm text-center w-16">
                    {item.nombre}
                  </Text>
                </Pressable>
              )}
            />
          ) : (
            <View className="bg-gray-50 rounded-xl p-6 items-center">
              <Text className="text-gray-500 text-center">
                No hay especialidades disponibles en este momento
              </Text>
            </View>
          )}
        </View>

        {/* Top Doctors */}
        <View className="px-6 mb-10">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Top Doctores
          </Text>

          {isLoadingDoctores ? (
            <View className="bg-gray-50 rounded-xl p-6 items-center">
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text className="text-gray-500 mt-2">Cargando doctores...</Text>
            </View>
          ) : (
            <FlatList
              data={topDoctores}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: topDoctor }) => {
                const isFavorite = favoriteIds.has(topDoctor.id);
                return (
                  <Link
                    href={`/(doctors)/doctors-details?id_doctor=${topDoctor.id}`}
                    asChild
                  >
                    <Pressable className="flex-row items-center bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
                      <View className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden items-center justify-center">
                        {topDoctor.doctor_image ? (
                          <Image
                            source={{ uri: topDoctor.doctor_image }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <User size={32} color="#9CA3AF" />
                        )}
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                          <Shield size={12} color="#3B82F6" />
                          <Text className="text-blue-500 text-xs ml-1">
                            Doctor Profesional
                          </Text>
                        </View>

                        <Text className="font-semibold text-gray-900 mb-1">
                          {topDoctor.nombre_doctor} {topDoctor.apellido_doctor}
                        </Text>
                        <Text className="text-gray-500 text-sm mb-2">
                          {topDoctor.especialidad}
                        </Text>
                        <View className="flex-row items-center">
                          <Star size={14} color="#FFA500" fill="#FFA500" />
                          <Text className="text-sm text-gray-600 ml-1">
                            {topDoctor.rating} ({topDoctor.number_reviews}{" "}
                            Reviews)
                          </Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Pressable
                          className="mb-2"
                          onPress={(e) => handleFavoritePress(topDoctor, e)}
                        >
                          <Heart
                            size={20}
                            color={isFavorite ? "#EF4444" : "#E5E7EB"}
                            fill={isFavorite ? "#EF4444" : "transparent"}
                          />
                        </Pressable>
                      </View>
                    </Pressable>
                  </Link>
                );
              }}
              ListEmptyComponent={
                <View className="bg-gray-50 rounded-xl p-6 items-center">
                  <Text className="text-gray-500 text-center">
                    No hay Doctores disponibles en este momento
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </ScrollView>

      {/* Modal de favoritos */}
      <Modal
        visible={showFavoriteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFavoriteModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">
                  {favoriteAction === "add"
                    ? "Añadir a Favoritos"
                    : "Remover de Favoritos"}
                </Text>
              </View>
              <Pressable onPress={() => setShowFavoriteModal(false)}>
                <X size={24} color="#6B7280" />
              </Pressable>
            </View>

            <View className="items-center mb-6">
              {selectedDoctor?.doctor_image ? (
                <Image
                  source={{ uri: selectedDoctor.doctor_image }}
                  className="w-20 h-20 rounded-full mb-4"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-20 h-20 bg-gray-200 rounded-full mb-4 items-center justify-center">
                  <User size={32} color="#9CA3AF" />
                </View>
              )}

              <Text className="text-base font-semibold text-gray-900 text-center mb-1">
                {selectedDoctor?.nombre_doctor}{" "}
                {selectedDoctor?.apellido_doctor}
              </Text>
              <Text className="text-sm text-gray-500 text-center mb-4">
                {selectedDoctor?.especialidad}
              </Text>

              <Text className="text-gray-600 text-center">
                {favoriteAction === "add"
                  ? "¿Deseas añadir este doctor a tu lista de favoritos?"
                  : "¿Deseas remover este doctor de tu lista de favoritos?"}
              </Text>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setShowFavoriteModal(false)}
                disabled={loadingFavorite}
                className="flex-1 bg-gray-100 py-3 rounded-full"
              >
                <Text className="text-gray-700 text-center font-semibold">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={confirmFavoriteAction}
                disabled={loadingFavorite}
                className={`flex-1 py-3 rounded-full ${
                  favoriteAction === "add" ? "bg-blue-500" : "bg-red-500"
                } ${loadingFavorite ? "opacity-50" : ""}`}
              >
                <Text className="text-white text-center font-semibold">
                  {loadingFavorite
                    ? "Procesando..."
                    : favoriteAction === "add"
                      ? "Sí, Añadir"
                      : "Sí, Remover"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenView>
  );
}
