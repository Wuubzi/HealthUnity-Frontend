import ScreenView from "@/components/Screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Calendar, Clock, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const convertirHoraALocalTime = (horaStr: string) => {
  const hora = Array.isArray(horaStr) ? horaStr[0] : horaStr;
  const [time, period] = hora.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
};

const convertirFechaALocalDate = (fechaStr: string) => {
  const fecha = Array.isArray(fechaStr) ? fechaStr[0] : fechaStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return fecha;
  }
  const date = new Date(fecha + "T00:00:00");
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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

export default function ServiceSummary() {
  const {
    gmail,
    idDoctor,
    idPaciente,
    doctorName,
    especialidad,
    fecha,
    fechaFormateada,
    hora,
    pacienteName,
    pacienteNumero,
    razon,
    urlImagen,
    isReprogramacion,
    idCita,
  } = useLocalSearchParams();

  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const esReprogramacion = isReprogramacion === "true";

  const handleConfirmarCita = async () => {
    setIsLoading(true);

    try {
      const token = await SecureStore.getItemAsync("access_token");

      let response;

      if (esReprogramacion) {
        // Llamar al endpoint de editar citas
        response = await fetch(
          `${apiUrl}/api/v1/citas/editarCitas?idCita=${idCita}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              idDoctor: idDoctor,
              idPaciente: idPaciente,
              fecha: convertirFechaALocalDate(fecha as string),
              hora: convertirHoraALocalTime(hora as string),
              razon: Array.isArray(razon) ? razon[0] : razon,
            }),
          }
        );
      } else {
        // Llamar al endpoint de añadir citas
        response = await fetch(`${apiUrl}/api/v1/citas/añadirCitas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            idDoctor: Number(Array.isArray(idDoctor) ? idDoctor[0] : idDoctor),
            idPaciente: Number(
              Array.isArray(idPaciente) ? idPaciente[0] : idPaciente
            ),
            fecha: convertirFechaALocalDate(fecha as string),
            hora: convertirHoraALocalTime(hora as string),
            razon: Array.isArray(razon) ? razon[0] : razon,
          }),
        });
      }

      const data = await response.json();

      if (response.ok) {
        router.push({
          pathname: "/(booking)/appoiment-confirmation",
          params: {
            gmail,
            idDoctor,
            idPaciente,
            doctorName,
            especialidad,
            fecha,
            fechaFormateada,
            hora,
            pacienteName,
            pacienteNumero,
            razon,
            urlImagen,
            isReprogramacion: esReprogramacion ? "true" : "false",
          },
        });
      } else {
        Alert.alert(
          "Error",
          data.message ||
            `No se pudo ${esReprogramacion ? "reprogramar" : "confirmar"} la cita. Por favor intente nuevamente.`
        );
      }
    } catch (error) {
      Alert.alert(
        "Error de conexión",
        "No se pudo conectar con el servidor. Por favor verifique su conexión a internet."
      );
      console.error("Error al confirmar cita:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenView
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top + 70 }}
    >
      <ScrollView className="flex-1 px-6">
        {/* Indicador de Reprogramación */}
        {esReprogramacion && (
          <View className="mb-4 bg-blue-50 rounded-xl p-4">
            <Text className="text-blue-700 font-semibold text-center">
              Reprogramando Cita
            </Text>
            <Text className="text-blue-600 text-sm text-center mt-1">
              Revisa los nuevos detalles de tu cita
            </Text>
          </View>
        )}

        {/* Service Details */}
        <View className="mb-6">
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Resumen Cita
            </Text>

            {/* Doctor Info */}
            <View className="flex-row items-center mb-4">
              {urlImagen ? (
                <Image
                  source={{
                    uri: Array.isArray(urlImagen) ? urlImagen[0] : urlImagen,
                  }}
                  className="w-20 h-20 rounded-xl mr-4"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-20 h-20 bg-gray-200 rounded-xl mr-4 items-center justify-center">
                  <Text className="text-gray-400 text-xs">Sin foto</Text>
                </View>
              )}
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">
                  Dr. {doctorName}
                </Text>
                <Text className="text-gray-500 text-sm">{especialidad}</Text>
              </View>
            </View>

            {/* Appointment Details */}
            <View className="space-y-3">
              <View className="flex-row items-center">
                <Calendar size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-3">
                  {formatearFecha(fecha as string)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Clock size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-3">{hora}</Text>
              </View>
              <View className="flex-row items-center">
                <User size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-3">Duracion: 30 minutos</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Patient Information */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">
            Informacion del Paciente
          </Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Nombre:</Text>
              <Text className="font-medium text-gray-900">{pacienteName}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Email:</Text>
              <Text className="font-medium text-gray-900">{gmail}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Telefono:</Text>
              <Text className="font-medium text-gray-900">
                {pacienteNumero}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Razon:</Text>
              <Text className="font-medium text-gray-900">{razon}</Text>
            </View>
          </View>
        </View>

        {/* Important Notes */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">Notas Importantes</Text>
          <View className="bg-amber-50 rounded-xl p-4">
            <View className="space-y-2">
              <View className="flex-row items-start">
                <View className="w-2 h-2 bg-amber-500 rounded-full mr-2 mt-2" />
                <Text className="text-amber-700 text-sm flex-1">
                  Por favor, llegue 15 minutos antes de su cita programada.
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-2 h-2 bg-amber-500 rounded-full mr-2 mt-2" />
                <Text className="text-amber-700 text-sm flex-1">
                  Traiga una identificación válida y cualquier historial médico
                  pertinente.
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-2 h-2 bg-amber-500 rounded-full mr-2 mt-2" />
                <Text className="text-amber-700 text-sm flex-1">
                  {esReprogramacion
                    ? "Recibirás un correo de confirmación con los nuevos detalles."
                    : "Recibirás un correo electrónico de confirmación en breve."}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 pb-6 space-y-3">
        <Pressable
          className={`py-4 rounded-full ${isLoading ? "bg-blue-300" : "bg-blue-500"}`}
          onPress={handleConfirmarCita}
          disabled={isLoading}
        >
          {isLoading ? (
            <View className="flex-row justify-center items-center">
              <ActivityIndicator color="white" />
              <Text className="text-white text-center font-semibold text-lg ml-2">
                {esReprogramacion ? "Reprogramando..." : "Confirmando..."}
              </Text>
            </View>
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              {esReprogramacion ? "Confirmar Reprogramación" : "Confirmar Cita"}
            </Text>
          )}
        </Pressable>
      </View>
    </ScreenView>
  );
}
