import ScreenView from "@/components/Screen";
import { Paciente } from "@/types/paciente";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Calendar, Mail, Phone, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PatientDetails() {
  const {
    gmail,
    idDoctor,
    doctorName,
    especialidad,
    fecha,
    fechaFormateada,
    hora,
    urlImagen,
    isReprogramacion,
    idCita,
  } = useLocalSearchParams();

  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
  const insets = useSafeAreaInsets();
  const [pacienteData, setPacienteData] = useState<Paciente | null>(null);
  const [formData, setFormData] = useState({
    reason: "",
  });

  const esReprogramacion = isReprogramacion === "true";

  const getPacienteData = async () => {
    const token = await SecureStore.getItemAsync("access_token");
    try {
      const response = await fetch(
        `${apiUrl}/api/v1/paciente/getPaciente?gmail=${gmail}`,
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
      setPacienteData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const formatearFecha = (fechaStr?: string) => {
    if (!fechaStr) return "";

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

    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) return "";

    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();

    return `${dia} de ${mes} ${anio}`;
  };

  useEffect(() => {
    getPacienteData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    if (!formData.reason.trim()) {
      Alert.alert(
        "Campo requerido",
        "Por favor ingrese el motivo de la consulta antes de continuar.",
        [{ text: "Entendido" }]
      );
      return;
    }

    const fullname =
      `${pacienteData?.nombre ?? ""} ${pacienteData?.apellido ?? ""}`.trim();

    router.push({
      pathname: "/service-summary",
      params: {
        idPaciente: pacienteData?.id,
        gmail: gmail as string,
        idDoctor: idDoctor as string,
        doctorName: doctorName as string,
        especialidad: especialidad as string,
        fecha: fecha as string,
        fechaFormateada: fechaFormateada as string,
        hora: hora as string,
        urlImagen: urlImagen as string,
        pacienteName: fullname,
        pacienteNumero: pacienteData?.telefono || "",
        razon: formData.reason,
        isReprogramacion: esReprogramacion ? "true" : "false",
        idCita: idCita || "",
      },
    });
  };

  const fullname =
    `${pacienteData?.nombre ?? ""} ${pacienteData?.apellido ?? ""}`.trim();

  const isFormValid = formData.reason.trim().length > 0;

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
          </View>
        )}

        {/* Form */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">
            Informacion Personal
          </Text>

          {/* Full Name */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
              <User size={20} color="#6B7280" />
              <TextInput
                value={fullname}
                editable={false}
                onChangeText={(value) => handleInputChange("fullName", value)}
                placeholder="Enter your full name"
                className="flex-1 ml-3 text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Correo Electronico
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
              <Mail size={20} color="#6B7280" />
              <TextInput
                value={pacienteData?.gmail}
                editable={false}
                onChangeText={(value) => handleInputChange("email", value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                className="flex-1 ml-3 text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Phone */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Numero Telefono
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
              <Phone size={20} color="#6B7280" />
              <TextInput
                value={pacienteData?.telefono}
                editable={false}
                onChangeText={(value) => handleInputChange("phone", value)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                className="flex-1 ml-3 text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Date of Birth */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Fecha De Nacimiento
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
              <Calendar size={20} color="#6B7280" />
              <TextInput
                value={
                  pacienteData?.fechaNacimiento
                    ? formatearFecha(pacienteData.fechaNacimiento)
                    : ""
                }
                onChangeText={(value) =>
                  handleInputChange("dateOfBirth", value)
                }
                placeholder="DD/MM/YYYY"
                className="flex-1 ml-3 text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Reason for Visit */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Motivo de la Consulta *
            </Text>
            <View
              className={`rounded-xl px-4 py-3 ${!isFormValid && formData.reason === "" ? "bg-gray-50" : "bg-gray-50"}`}
            >
              <TextInput
                value={formData.reason}
                onChangeText={(value) => handleInputChange("reason", value)}
                placeholder="Descripción breve de su motivo de consulta"
                multiline
                numberOfLines={3}
                className="text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {!isFormValid && (
              <Text className="text-red-500 text-xs mt-1">
                * Campo obligatorio
              </Text>
            )}
          </View>
        </View>

        {/* Summary */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">Resumen de la Cita</Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Doctor:</Text>
              <Text className="font-medium text-gray-900">{doctorName}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Fecha:</Text>
              <Text className="font-medium text-gray-900">
                {fechaFormateada}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Hora:</Text>
              <Text className="font-medium text-gray-900">{hora}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View className="px-6 pb-6">
        <Pressable
          className={`py-4 rounded-full ${isFormValid ? "bg-blue-500" : "bg-gray-300"}`}
          onPress={handleContinue}
          disabled={!isFormValid}
        >
          <Text
            className={`text-center font-semibold text-lg ${isFormValid ? "text-white" : "text-gray-500"}`}
          >
            {esReprogramacion ? "Continuar Reprogramación" : "Agendar Cita"}
          </Text>
        </Pressable>
      </View>
    </ScreenView>
  );
}
