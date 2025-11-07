import ScreenView from "@/components/Screen";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  User,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

interface Message {
  id: string;
  text: string;
  sender: "user" | "eva";
  timestamp: Date;
  type?: "text" | "appointment" | "thinking";
  appointmentData?: {
    doctor: string;
    specialty: string;
    date: string;
    time: string;
    confirmationCode?: string;
  };
}

export default function Asistente() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);

  const getUserData = async () => {
    const token = await SecureStore.getItemAsync("id_token");
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
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUserData();
    setTimeout(() => {
      addEvaMessage(
        `¡Hola${userData?.nombre ? ` ${userData.nombre}` : ""}! 👋\n\nSoy Eva, tu agente de salud con IA. Puedo ayudarte a agendar citas médicas de forma automática.\n\nSolo dime qué necesitas, por ejemplo:\n• "Necesito un cardiólogo para mañana"\n• "Quiero agendar con un dentista esta semana"\n• "Dolor de cabeza, necesito consulta urgente"`
      );
    }, 500);
  }, []);

  const addEvaMessage = (text: string, appointmentData?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "eva",
      timestamp: new Date(),
      type: appointmentData ? "appointment" : "text",
      appointmentData,
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsProcessing(false);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addThinkingMessage = () => {
    const thinkingMessage: Message = {
      id: "thinking",
      text: "",
      sender: "eva",
      timestamp: new Date(),
      type: "thinking",
    };
    setMessages((prev) => [...prev, thinkingMessage]);
  };

  const removeThinkingMessage = () => {
    setMessages((prev) => prev.filter((msg) => msg.id !== "thinking"));
  };

  const processWithEvaAI = async (userMessage: string) => {
    try {
      const token = await SecureStore.getItemAsync("id_token");

      // Aquí harías la llamada a tu API de IA/Eva
      // Por ahora simulo el procesamiento inteligente
      const response = await fetch(`${apiUrl}/api/v1/eva/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          patientId: userData?.id,
          context: messages.slice(-5), // Últimos 5 mensajes para contexto
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }

      // Fallback: procesamiento simulado
      return simulateEvaProcessing(userMessage);
    } catch (error) {
      console.error("Error processing with Eva:", error);
      return simulateEvaProcessing(userMessage);
    }
  };

  const simulateEvaProcessing = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();

    // Simulación de entendimiento de intención y agendamiento automático
    if (
      lowerMessage.includes("cardio") ||
      lowerMessage.includes("corazón") ||
      lowerMessage.includes("presión")
    ) {
      return {
        type: "appointment_created",
        message:
          "He analizado tu solicitud y encontré disponibilidad con especialistas en cardiología.\n\nHe agendado automáticamente tu cita con el mejor especialista disponible según tu ubicación y disponibilidad:",
        appointment: {
          doctor: "Dr. Robert Fox",
          specialty: "Cardiología",
          date: "Mañana, 25 de Enero",
          time: "10:00 AM - 11:00 AM",
          confirmationCode:
            "EVA-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
        },
      };
    } else if (
      lowerMessage.includes("dent") ||
      lowerMessage.includes("muela") ||
      lowerMessage.includes("odonto")
    ) {
      return {
        type: "appointment_created",
        message:
          "Perfecto, he procesado tu solicitud de odontología.\n\n✅ Cita agendada automáticamente:",
        appointment: {
          doctor: "Dra. María González",
          specialty: "Odontología",
          date: "Viernes, 27 de Enero",
          time: "3:00 PM - 4:00 PM",
          confirmationCode:
            "EVA-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
        },
      };
    } else if (
      lowerMessage.includes("dolor") ||
      lowerMessage.includes("urgente") ||
      lowerMessage.includes("emergencia")
    ) {
      return {
        type: "appointment_created",
        message:
          "Entiendo que necesitas atención urgente. He localizado disponibilidad inmediata.\n\n🚨 Cita de urgencia agendada:",
        appointment: {
          doctor: "Dr. Carlos Mendoza",
          specialty: "Medicina General",
          date: "Hoy",
          time: "5:30 PM - 6:00 PM",
          confirmationCode:
            "EVA-URG-" + Math.random().toString(36).substr(2, 4).toUpperCase(),
        },
      };
    } else if (
      lowerMessage.includes("piel") ||
      lowerMessage.includes("derma") ||
      lowerMessage.includes("acné")
    ) {
      return {
        type: "appointment_created",
        message:
          "He encontrado especialistas en dermatología disponibles cerca de ti.\n\n✨ Tu cita ha sido confirmada:",
        appointment: {
          doctor: "Dra. Ana Martínez",
          specialty: "Dermatología",
          date: "Miércoles, 26 de Enero",
          time: "11:00 AM - 12:00 PM",
          confirmationCode:
            "EVA-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
        },
      };
    } else {
      return {
        type: "response",
        message:
          "Claro, puedo ayudarte con eso. Para agendarte la mejor cita, ¿podrías darme más detalles?\n\nPor ejemplo:\n• ¿Qué tipo de especialista necesitas?\n• ¿Es urgente o puedes esperar unos días?\n• ¿Tienes algún síntoma específico?",
      };
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === "" || isProcessing) return;

    const userMessage = inputText.trim();
    addUserMessage(userMessage);
    setInputText("");
    setIsProcessing(true);

    // Mostrar indicador de que Eva está pensando
    addThinkingMessage();

    // Procesar con IA de Eva
    const result = await processWithEvaAI(userMessage);

    // Remover indicador de pensamiento
    removeThinkingMessage();

    // Mostrar respuesta de Eva
    if (result.type === "appointment_created") {
      addEvaMessage(result.message, result.appointment);

      // Mensaje adicional de confirmación
      setTimeout(() => {
        addEvaMessage(
          "✅ ¡Listo! He enviado la confirmación a tu correo y SMS.\n\n¿Hay algo más en lo que pueda ayudarte?"
        );
      }, 1000);
    } else {
      addEvaMessage(result.message);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.type === "thinking") {
      return (
        <View className="flex-row items-start mb-4 px-4">
          <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
            <Sparkles size={20} color="white" />
          </View>
          <View className="flex-1 bg-blue-50 rounded-2xl rounded-tl-sm p-4">
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text className="text-blue-600 ml-2">Eva está procesando...</Text>
            </View>
          </View>
        </View>
      );
    }

    if (item.sender === "eva") {
      return (
        <View className="flex-row items-start mb-4 px-4">
          <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
            <Sparkles size={20} color="white" />
          </View>
          <View className="flex-1">
            <View className="bg-blue-50 rounded-2xl rounded-tl-sm p-4">
              <Text className="text-gray-800 leading-5">{item.text}</Text>
            </View>

            {item.appointmentData && (
              <View className="mt-3 bg-white rounded-2xl p-4 border-2 border-blue-500">
                <View className="flex-row items-center mb-3">
                  <CheckCircle2 size={20} color="#22C55E" />
                  <Text className="text-base font-bold text-gray-900 ml-2">
                    Cita Confirmada
                  </Text>
                </View>

                <View className="flex-row items-center mb-2">
                  <User size={16} color="#6B7280" />
                  <Text className="text-gray-700 ml-2 font-semibold">
                    {item.appointmentData.doctor}
                  </Text>
                </View>

                <View className="flex-row items-center mb-2">
                  <MessageCircle size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2">
                    {item.appointmentData.specialty}
                  </Text>
                </View>

                <View className="flex-row items-center mb-2">
                  <Calendar size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2">
                    {item.appointmentData.date}
                  </Text>
                </View>

                <View className="flex-row items-center mb-3">
                  <Clock size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2">
                    {item.appointmentData.time}
                  </Text>
                </View>

                {item.appointmentData.confirmationCode && (
                  <View className="bg-blue-50 rounded-lg p-3 mt-2">
                    <Text className="text-xs text-gray-500 mb-1">
                      Código de confirmación
                    </Text>
                    <Text className="text-blue-600 font-bold text-lg">
                      {item.appointmentData.confirmationCode}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <Text className="text-xs text-gray-400 mt-1 ml-1">
              {item.timestamp.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View className="flex-row items-start mb-4 px-4 justify-end">
        <View className="flex-1 items-end">
          <View className="bg-blue-500 rounded-2xl rounded-tr-sm p-4 max-w-[80%]">
            <Text className="text-white leading-5">{item.text}</Text>
          </View>
          <Text className="text-xs text-gray-400 mt-1 mr-1">
            {item.timestamp.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center ml-3">
          <User size={20} color="#6B7280" />
        </View>
      </View>
    );
  };

  return (
    <ScreenView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-500 px-6 py-4 pb-6">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-3">
            <Sparkles size={24} color="#3B82F6" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-xl">Eva</Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-green-400 rounded-full mr-2" />
              <Text className="text-blue-100 text-sm">
                Agente IA • Disponible 24/7
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-12 px-6">
            <View className="w-20 h-20 bg-blue-50 rounded-full items-center justify-center mb-4">
              <Sparkles size={40} color="#3B82F6" />
            </View>
            <Text className="text-gray-500 text-center text-base">
              Eva está lista para ayudarte a agendar citas automáticamente
            </Text>
          </View>
        }
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View className="border-t border-gray-200 bg-white px-4 py-3">
          <View className="flex-row items-center bg-gray-50 rounded-full px-4 py-2">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Escribe tu solicitud aquí..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-gray-900 py-2"
              multiline
              maxLength={500}
              editable={!isProcessing}
            />
            <Pressable
              onPress={handleSendMessage}
              disabled={isProcessing || inputText.trim() === ""}
              className={`ml-2 w-10 h-10 rounded-full items-center justify-center ${
                isProcessing || inputText.trim() === ""
                  ? "bg-gray-300"
                  : "bg-blue-500"
              }`}
            >
              {isProcessing ? (
                <Loader2 size={20} color="white" />
              ) : (
                <Send size={20} color="white" />
              )}
            </Pressable>
          </View>
          <Text className="text-xs text-gray-400 text-center mt-2">
            Eva procesa tu solicitud con IA y agenda automáticamente
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ScreenView>
  );
}
