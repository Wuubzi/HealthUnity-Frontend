import ScreenView from "@/components/Screen";
import { Cita } from "@/types/booking";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Calendar, Clock, MapPin, User } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Booking() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "completed" | "cancelled"
  >("upcoming");
  const [bookings, setBookings] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [activeTab])
  );

  const getEstadoFromTab = (tab: string) => {
    switch (tab) {
      case "upcoming":
        return "pendiente";
      case "completed":
        return "completada";
      case "cancelled":
        return "cancelada";
      default:
        return "pendiente";
    }
  };

  const loadBookings = async (isRefreshing = false) => {
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

      const estado = getEstadoFromTab(activeTab);
      const response = await fetch(
        `${apiUrl}/api/v1/citas/getCitas?idPaciente=${idPaciente}&estado=${estado}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data: Cita[] = await response.json();
        setBookings(data);
      } else {
        console.error("Error al cargar citas:", response.status);
        setBookings([]);
      }
    } catch (error) {
      console.error("Error al cargar citas:", error);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const goReseñas = (cita: Cita) => {
    router.push({
      pathname: "/reviews",
      params: {
        idDoctor: cita.idDoctor,
        nombreDoctor: cita.nombre_doctor,
        apellidoDoctor: cita.apellido_doctor,
        especialidad: cita.especialidad,
        urlImagen: cita.doctor_image,
      },
    });
  };

  // Función modificada para manejar reprogramación y citas nuevas
  const goCita = (id_doctor: number, cita?: Cita) => {
    if (cita) {
      // Reprogramación - pasar datos de la cita existente
      router.push({
        pathname: "/(booking)/book-appoiment",
        params: {
          idDoctor: id_doctor,
          isReprogramacion: "true",
          idCita: cita.idCita,
          fechaActual: cita.fecha,
          horaActual: cita.hora,
        },
      });
    } else {
      // Cita nueva
      router.push(`/(booking)/book-appoiment?idDoctor=${id_doctor}`);
    }
  };

  const cancelarCitas = async (idCita: number) => {
    const token = await SecureStore.getItemAsync("access_token");
    if (!token) {
      console.log("No se encontró token");
      return;
    }
    const response = await fetch(
      `${apiUrl}/api/v1/citas/cancelarCitas?idCita=${idCita}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      console.error("Error en la respuesta:", response);
    }

    Alert.alert("cita cancelada exitosamente");
  };

  const handleCancelarCita = (cita: Cita) => {
    Alert.alert(
      "Cancelar Cita",
      `¿Estás seguro de que deseas cancelar la cita con Dr. ${cita.nombre_doctor} ${cita.apellido_doctor}?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            await cancelarCitas(cita.idCita);
            loadBookings();
          },
        },
      ]
    );
  };

  const formatearHora = (horaStr: string) => {
    const [horas, minutos] = horaStr.split(":");
    const horaNum = parseInt(horas);
    const periodo = horaNum >= 12 ? "PM" : "AM";
    const hora12 = horaNum > 12 ? horaNum - 12 : horaNum === 0 ? 12 : horaNum;

    return `${hora12}:${minutos} ${periodo}`;
  };

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "bg-orange-100 text-orange-800";
      case "completada":
        return "bg-green-100 text-green-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "Pendiente";
      case "completada":
        return "Completada";
      case "cancelada":
        return "Cancelada";
      default:
        return estado;
    }
  };

  const renderActionButtons = (cita: Cita) => {
    if (cita.estado.toLowerCase() === "pendiente") {
      return (
        <View className="flex-row gap-2 mt-4">
          <Pressable
            className="flex-1 bg-gray-100 py-3 px-4 rounded-lg"
            onPress={() => handleCancelarCita(cita)}
          >
            <Text className="text-gray-700 text-center font-medium">
              Cancelar
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 bg-blue-500 py-3 px-4 rounded-lg"
            onPress={() => goCita(cita.idDoctor, cita)}
          >
            <Text className="text-white text-center font-medium">
              Reprogramar
            </Text>
          </Pressable>
        </View>
      );
    } else if (cita.estado.toLowerCase() === "completada") {
      return (
        <View className="flex-row gap-2 mt-4">
          <Pressable
            onPress={() => goCita(cita.idDoctor)}
            className="flex-1 bg-gray-100 py-3 px-4 rounded-lg"
          >
            <Text className="text-gray-700 text-center font-medium">
              Reagendar
            </Text>
          </Pressable>
          <Pressable
            onPress={() => goReseñas(cita)}
            className="flex-1 bg-blue-500 py-3 px-4 rounded-lg"
          >
            <Text className="text-white text-center font-medium">
              Añadir Reseña
            </Text>
          </Pressable>
        </View>
      );
    } else {
      return (
        <View className="flex-row gap-2 mt-4">
          <Pressable
            onPress={() => goCita(cita.idDoctor)}
            className="flex-1 bg-blue-500 py-3 px-4 rounded-lg"
          >
            <Text className="text-white text-center font-medium">
              Reagendar
            </Text>
          </Pressable>
        </View>
      );
    }
  };

  return (
    <ScreenView className="flex-1 bg-gray-50">
      <View className="bg-white px-6 pt-4 pb-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Mis Citas</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row px-6 py-4 bg-white border-b border-gray-100">
        <Pressable
          onPress={() => setActiveTab("upcoming")}
          className={`flex-1 py-2 ${
            activeTab === "upcoming" ? "border-b-2 border-blue-500" : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "upcoming" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Pendientes
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("completed")}
          className={`flex-1 py-2 ${
            activeTab === "completed" ? "border-b-2 border-blue-500" : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "completed" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Completadas
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("cancelled")}
          className={`flex-1 py-2 ${
            activeTab === "cancelled" ? "border-b-2 border-blue-500" : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "cancelled" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Canceladas
          </Text>
        </Pressable>
      </View>

      {/* Booking List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">Cargando citas...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 pt-4">
          {bookings.length > 0 ? (
            bookings.map((cita) => (
              <View
                key={cita.idCita}
                className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
              >
                {/* Date and Status */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center flex-1">
                    <Calendar size={16} color="#3B82F6" className="mr-2" />
                    <Text className="text-gray-600 font-medium mr-2">
                      {cita.fecha}
                    </Text>
                    <Clock size={16} color="#3B82F6" className="mr-2" />
                    <Text className="text-gray-600 font-medium">
                      {formatearHora(cita.hora)}
                    </Text>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${getStatusColor(
                      cita.estado
                    )}`}
                  >
                    <Text className="text-xs font-medium">
                      {getStatusText(cita.estado)}
                    </Text>
                  </View>
                </View>

                {/* Doctor Info */}
                <View className="flex-row items-center mb-4">
                  <View className="w-14 h-14 bg-gray-200 rounded-full mr-3 items-center justify-center">
                    <View className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden items-center justify-center">
                      {cita.doctor_image ? (
                        <Image
                          source={{ uri: cita.doctor_image }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <User size={32} color="#9CA3AF" />
                      )}
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      Dr. {cita.nombre_doctor} {cita.apellido_doctor}
                    </Text>
                    <Text className="text-gray-500 text-sm mb-1">
                      {cita.especialidad}
                    </Text>
                    <View className="flex-row items-center">
                      <MapPin size={12} color="#666" />
                      <Text
                        className="text-gray-500 text-xs ml-1"
                        numberOfLines={1}
                      >
                        {cita.direccion}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                {renderActionButtons(cita)}
              </View>
            ))
          ) : (
            <View className="items-center justify-center py-12">
              <Calendar size={48} color="#9CA3AF" className="mb-4" />
              <Text className="text-gray-500 text-center text-lg font-semibold">
                No hay citas{" "}
                {activeTab === "upcoming"
                  ? "pendientes"
                  : activeTab === "completed"
                    ? "completadas"
                    : "canceladas"}
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-2 px-8">
                {activeTab === "upcoming"
                  ? "Agenda una cita con un especialista"
                  : "Aún no tienes citas en esta categoría"}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </ScreenView>
  );
}
