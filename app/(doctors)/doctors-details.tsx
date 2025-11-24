import ScreenView from "@/components/Screen";
import { Link, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { MapPin, Star, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HorarioDoctor {
  idDoctor: number;
  dias: Dias[];
}

interface Dias {
  diaSemana: number;
  horarios: Horarios[];
}

interface Horarios {
  horaInicio: string;
  horaFin: string;
}

interface Doctor {
  idDoctor: number;
  experiencia: number;
  detalles: string;
  detallesUsuario: DetallesUsuario;
  especialidad: Especialidad;
  galeria: Galeria;
}

interface GaleriaSolo {
  idGaleria: number;
}

interface Galeria {
  idGaleria: number;
  imagenes: Imagenes[];
}

interface Imagenes {
  idImagen: number;
  urlImagen: string;
  galeria: GaleriaSolo;
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

interface Especialidad {
  idEspecialidad: number;
  nombre: string;
  icono: string;
}

interface Reseñas {
  idOpinionDoctor: number;
  estrellas: number;
  fecha: string;
  detalles: string;
  paciente: Paciente;
}
interface Paciente {
  idPaciente: number;
  detallesUsuario: DetallesUsuario;
}

const diasSemana: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

function formatTime(time: string) {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${ampm}`;
}

function isOpenToday(
  diaSemana: number,
  horarios: { horaInicio: string; horaFin: string }[]
) {
  const now = new Date();
  const currentDay = now.getDay() === 0 ? 7 : now.getDay(); // Domingo = 7
  if (currentDay !== diaSemana) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return horarios.some((h) => {
    const [hiH, hiM] = h.horaInicio.split(":").map(Number);
    const [hfH, hfM] = h.horaFin.split(":").map(Number);
    const start = hiH * 60 + hiM;
    const end = hfH * 60 + hfM;
    return currentMinutes >= start && currentMinutes <= end;
  });
}

const openInMaps = (address: string) => {
  const encodedAddress = encodeURIComponent(address);

  Alert.alert("Abrir en", "Selecciona la aplicación de mapas", [
    {
      text: "Google Maps",
      onPress: () => {
        const url =
          Platform.select({
            ios: `comgooglemaps://?q=${encodedAddress}`,
            android: `geo:0,0?q=${encodedAddress}`,
          }) ||
          `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

        Linking.canOpenURL(url).then((supported) => {
          if (supported) {
            Linking.openURL(url);
          } else {
            // Si no tiene la app, abrir en navegador
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
            );
          }
        });
      },
    },
    {
      text: "Waze",
      onPress: () => {
        const url = `waze://?q=${encodedAddress}`;

        Linking.canOpenURL(url).then((supported) => {
          if (supported) {
            Linking.openURL(url);
          } else {
            Alert.alert("Error", "Waze no está instalado en tu dispositivo");
          }
        });
      },
    },
    {
      text: "Cancelar",
      style: "cancel",
    },
  ]);
};

export default function DoctorDetailScreen() {
  const insets = useSafeAreaInsets();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
  const { id_doctor } = useLocalSearchParams();
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [horarioDoctor, setHorarioDoctor] = useState<HorarioDoctor | null>(
    null
  );
  const [reseñas, setReseñas] = useState<Reseñas[]>([]);

  const getDoctorData = async () => {
    const token = await SecureStore.getItemAsync("access_token");
    try {
      if (token) {
        const response = await fetch(
          `${apiUrl}/api/v1/doctor/getDoctorById?idDoctor=${id_doctor}`,
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
        setDoctorData(data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const getReseñas = async () => {
    const token = await SecureStore.getItemAsync("access_token");
    try {
      if (token) {
        const response = await fetch(
          `${apiUrl}/api/v1/doctor/getReviewsByDoctorId?idDoctor=${id_doctor}`,
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
        setReseñas(data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const getHorarioDoctor = async () => {
    const token = await SecureStore.getItemAsync("access_token");
    try {
      if (token) {
        const response = await fetch(
          `${apiUrl}/api/v1/doctor/getHorarioDoctor?idDoctor=${id_doctor}`,
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
        setHorarioDoctor(data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    getDoctorData();
    getReseñas();
    getHorarioDoctor();
  }, []);

  return (
    <ScreenView
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top + 70 }}
    >
      <ScrollView className="flex-1">
        {/* Doctor Info */}
        <View className="px-6 mb-6">
          <View className="items-center mb-4">
            <View className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden items-center justify-center">
              {doctorData?.detallesUsuario.urlImagen ? (
                <Image
                  source={{ uri: doctorData?.detallesUsuario.urlImagen }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <User size={32} color="#9CA3AF" />
              )}
            </View>
            <Text className="text-xl font-bold text-gray-900">
              Dr. {doctorData?.detallesUsuario.nombre}
            </Text>
            <Text className="text-gray-500">
              {doctorData?.especialidad.nombre}
            </Text>
            <View className="flex-row items-center mt-2">
              <MapPin size={14} color="#666" />
              <Text className="text-gray-600 text-sm ml-1">
                {doctorData?.detallesUsuario.direccion}
              </Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            About
          </Text>
          <Text className="text-gray-600 leading-6">
            {doctorData?.detalles}
          </Text>
        </View>

        {/* Horario */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Horario
          </Text>

          <View className="bg-gray-50 rounded-lg p-4">
            {horarioDoctor?.dias.map((dia) => {
              const abierto = isOpenToday(dia.diaSemana, dia.horarios);

              return (
                <View key={dia.diaSemana} className="mb-3">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-900 font-semibold">
                      {diasSemana[dia.diaSemana]}
                    </Text>

                    <Text
                      className={abierto ? "text-green-600" : "text-red-500"}
                    >
                      {abierto ? "Abierto" : "Cerrado"}
                    </Text>
                  </View>

                  {dia.horarios.map((h, i) => (
                    <Text key={i} className="text-gray-600 ml-2">
                      {formatTime(h.horaInicio)} - {formatTime(h.horaFin)}
                    </Text>
                  ))}
                </View>
              );
            })}
          </View>
        </View>

        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Location
          </Text>
          <TouchableOpacity
            onPress={() =>
              openInMaps(doctorData?.detallesUsuario.direccion ?? "")
            }
            activeOpacity={0.8}
          >
            <View className="rounded-lg h-32 overflow-hidden">
              <Image
                source={{
                  uri: "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-74.006,40.7128,12,0/600x300@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-black/10 items-center justify-center">
                <View className="bg-white/90 rounded-full p-3">
                  <MapPin size={32} color="#666" />
                </View>
                <Text className="text-white font-semibold mt-2 bg-black/50 px-3 py-1 rounded">
                  Ver en Mapa
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Reviews */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-gray-900">Reseñas</Text>
          </View>

          {reseñas.map((review) => (
            <View key={review.idOpinionDoctor} className="mb-4">
              <View className="flex-row items-center mb-2">
                <View className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden items-center justify-center">
                  {review.paciente.detallesUsuario.urlImagen ? (
                    <Image
                      source={{
                        uri: review.paciente.detallesUsuario.urlImagen,
                      }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <User size={32} color="#9CA3AF" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    {review.paciente.detallesUsuario.nombre}
                  </Text>
                  <Text className="text-gray-500 text-sm">{review.fecha}</Text>
                </View>
                <View className="flex-row">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      color={i < review.estrellas ? "#FFA500" : "#E5E7EB"}
                      fill={i < review.estrellas ? "#FFA500" : "none"}
                    />
                  ))}
                </View>
              </View>
              <Text className="text-gray-600 ml-13">{review.detalles}</Text>
            </View>
          ))}
        </View>

        {/* Photos */}
        {/* Photos */}
        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Consultorio Fotos
          </Text>
          {doctorData?.galeria?.imagenes &&
          doctorData.galeria.imagenes.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {doctorData.galeria.imagenes.map((photo, index) => (
                <Pressable key={photo.idImagen || index} className="mr-3">
                  <Image
                    source={{ uri: photo.urlImagen }}
                    className="w-32 h-24 rounded-lg"
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <Text className="text-gray-500">No hay fotos disponibles</Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-6 py-4 bg-white border-t border-gray-100">
        <Link href={`/(booking)/book-appoiment?idDoctor=${id_doctor}`} asChild>
          <Pressable className="bg-blue-500 py-4 rounded-full">
            <Text className="text-white text-center font-semibold text-lg">
              Agendar Cita
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScreenView>
  );
}
