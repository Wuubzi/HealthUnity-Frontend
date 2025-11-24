import ScreenView from "@/components/Screen";
import { Link, useLocalSearchParams } from "expo-router";
import { Calendar, CheckCircle, Clock, User } from "lucide-react-native";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppointmentConfirmation() {
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
  } = useLocalSearchParams();

  const insets = useSafeAreaInsets();
  const esReprogramacion = isReprogramacion === "true";

  return (
    <ScreenView
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top + 60 }}
    >
      <ScrollView className="flex-1 px-6 py-8">
        {/* Success Icon */}
        <View className="items-center mb-8">
          <View
            className={`w-24 h-24 ${esReprogramacion ? "bg-blue-100" : "bg-green-100"} rounded-full items-center justify-center mb-4`}
          >
            <CheckCircle
              size={48}
              color={esReprogramacion ? "#3B82F6" : "#10B981"}
            />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {esReprogramacion ? "Cita Reprogramada" : "Cita Agendada"}
          </Text>
          <Text className="text-gray-600 text-center">
            {esReprogramacion
              ? "Tu cita se ha reprogramado exitosamente."
              : "Su cita se ha programado correctamente."}
          </Text>
        </View>

        {/* Reprogramación Notice */}
        {esReprogramacion && (
          <View className="bg-blue-50 rounded-xl p-4 mb-6">
            <Text className="text-blue-700 font-semibold mb-1">
              ✓ Reprogramación Exitosa
            </Text>
            <Text className="text-blue-600 text-sm">
              Los detalles de tu cita han sido actualizados. Recibirás un correo
              de confirmación con la nueva información.
            </Text>
          </View>
        )}

        {/* Appointment Details Card */}
        <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            {esReprogramacion
              ? "Nuevos Detalles de la Cita"
              : "Detalles de la Cita"}
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

          {/* Appointment Info */}
          <View className="space-y-3">
            <View className="flex-row items-center">
              <Calendar size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-3">{fechaFormateada}</Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-3">{hora}</Text>
            </View>
            <View className="flex-row items-center">
              <User size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-3">
                Paciente: {pacienteName}
              </Text>
            </View>
          </View>
        </View>

        {/* Important Notes */}
        <View className="bg-amber-50 rounded-xl p-4 mb-6">
          <Text className="text-amber-800 font-medium mb-2">
            Notas Importantes
          </Text>
          <View className="space-y-1">
            <Text className="text-amber-700 text-sm">
              • Por favor, llegue 15 minutos antes de su cita.
            </Text>
            <Text className="text-amber-700 text-sm">
              • Traiga su identificación y cualquier historial médico relevante.
            </Text>
            <Text className="text-amber-700 text-sm">
              {esReprogramacion
                ? "• Recibirás una confirmación por correo con los nuevos detalles."
                : "• Recibirás un recordatorio 24 horas antes de tu cita."}
            </Text>
          </View>
        </View>

        {/* Contact Info */}
        <View className="bg-gray-50 rounded-xl p-4 mb-10">
          <Text className="font-medium text-gray-900 mb-2">
            {esReprogramacion
              ? "¿Necesitas hacer más cambios?"
              : "¿Necesitas realizar cambios?"}
          </Text>
          <Text className="text-gray-600 text-sm mb-1">
            Llamanos al: +57 (320) 314 3465
          </Text>
          <Text className="text-gray-600 text-sm">
            Email: appointments@healthcare.com
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 pb-6 space-y-5 flex gap-2">
        <Link href="/(tabs)/bookings" asChild>
          <Pressable className="bg-blue-500 py-4 rounded-full">
            <Text className="text-white text-center font-semibold text-lg">
              Ver mis Citas
            </Text>
          </Pressable>
        </Link>

        <Link href="/" asChild>
          <Pressable className="bg-gray-100 py-4 rounded-full">
            <Text className="text-gray-700 text-center font-semibold text-lg">
              Regresar al Inicio
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScreenView>
  );
}
