import ScreenView from "@/components/Screen";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { Calendar, Clock, Heart, Info, Star, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const formatearFecha = (fechaStr: string) => {
  const meses = [
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

interface Especialidad {
  idEspecialidad: number;
  nombre: string;
  icono: string;
}

interface ProximaCita {
  idCita: number;
  detalles: string;
  fecha: string;
  hora: string;
  estado: string;
  recordar: boolean;
  doctor: Doctor;
}

interface Doctor {
  idDoctor: number;
  experiencia: number;
  detalles: string;
  detallesUsuario: DetallesUsuario;
  especialidad: Especialidad;
}

interface DetallesUsuario {
  idDetalleUsuario: number;
  nombre: string;
  apellido: string;
  gmail: string;
  fechaNacimiento: string;
  telefono: string;
  genero: string;
  urlImagen: string;
  direccion: string;
}

interface TopDoctor {
  id: number;
  nombre_doctor: string;
  apellido_doctor: string;
  doctor_image: string;
  especialidad: string;
  rating: number;
  number_reviews: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";

  const [userData, setUserData] = useState<any>(null);
  const [topDoctores, setTopDoctores] = useState<TopDoctor[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [proximaCita, setProximaCita] = useState<ProximaCita | null>(null);

  // Estados de carga
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCita, setIsLoadingCita] = useState(false);
  const [isLoadingDoctores, setIsLoadingDoctores] = useState(false);
  const [isLoadingEspecialidades, setIsLoadingEspecialidades] = useState(false);

  const getUserData = async () => {
    const token = await SecureStore.getItemAsync("id_token");
    console.log(token);
    try {
      if (token) {
        const decoded: { email: string } = jwtDecode(token) as {
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
        return data; // Retornar los datos para usarlos inmediatamente
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const getEspecialidades = async () => {
    setIsLoadingEspecialidades(true);
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
      const token = await SecureStore.getItemAsync("id_token");
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
      const token = await SecureStore.getItemAsync("id_token");
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

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // Verificar autenticación
        const token = await SecureStore.getItemAsync("id_token");
        if (!token) {
          router.replace("/login");
          return;
        }

        const decoded: { exp: number } = jwtDecode(token) as { exp: number };
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          await SecureStore.deleteItemAsync("id_token");
          router.replace("/login");
          return;
        }

        // Obtener datos del usuario primero
        const user = await getUserData();

        // Cargar datos en paralelo
        await Promise.all([
          getEspecialidades(),
          getTopDoctores(),
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

  // Efecto separado para cargar la cita cuando userData cambie
  useEffect(() => {
    if (userData?.id && !isLoading) {
      getCitaProxima(userData.id);
    }
  }, [userData?.id]);

  // Pantalla de carga inicial
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
      <ScrollView>
        {/* Header */}
        <View className="px-6 py-4 bg-white">
          <Text className="text-2xl font-bold text-gray-900">
            Hola {userData?.nombre} 👋
          </Text>
        </View>

        {/* Upcoming Schedule */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center mb-3">
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
                <Link href={`/`} asChild>
                  <Pressable className="items-center mr-4">
                    <View className="w-16 h-16 bg-blue-50 rounded-2xl items-center justify-center mb-2">
                      <Text className="text-2xl">{item.icono}</Text>
                    </View>
                    <Text className="text-gray-700 text-sm text-center w-16">
                      {item.nombre}
                    </Text>
                  </Pressable>
                </Link>
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
              renderItem={({ item: topDoctor }) => (
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
                      <Pressable className="mb-2">
                        <Heart size={20} color="#E5E7EB" />
                      </Pressable>
                      <Link href={`/(booking)/book-appoiment`} asChild>
                        <Pressable className="bg-blue-500 px-4 py-2 rounded-full">
                          <Text className="text-white text-sm font-medium">
                            Agendar Cita
                          </Text>
                        </Pressable>
                      </Link>
                    </View>
                  </Pressable>
                </Link>
              )}
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
    </ScreenView>
  );
}
