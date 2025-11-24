import ScreenView from "@/components/Screen";
import { Message } from "@/types/asistente";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import {
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
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

export default function Asistente() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.7:8080";

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);

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
  }, []);

  useEffect(() => {
    // Enviar saludo inicial cuando carga el usuario
    if (userData && messages.length === 0) {
      setTimeout(() => {
        sendInitialGreeting();
      }, 500);
    }
  }, [userData]);

  const sendInitialGreeting = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      const id_token = await SecureStore.getItemAsync("id_token");
      if (!token) {
        return;
      }
      if (!id_token) {
        return;
      }
      const decoded: { email: string } = jwtDecode(id_token) as {
        email: string;
      };

      const response = await fetch(`${apiUrl}/api/v1/eva/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          from: decoded.email || "user",
          content: "Hola eva",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addEvaMessage(data.content);
      } else {
        // Fallback si falla la API
        addEvaMessage(
          `¡Hola${userData?.nombre ? ` ${userData.nombre}` : ""}! 👋\n\nSoy Eva, tu asistente de salud con IA.\n\nPuedo ayudarte a:\n• Agendar citas médicas automáticamente\n• Buscar doctores por especialidad\n• Ver tus próximas citas\n• Responder preguntas de salud\n\n¿En qué puedo ayudarte hoy?`
        );
      }
    } catch (error) {
      console.error("Error enviando saludo inicial:", error);
      addEvaMessage(
        `¡Hola${userData?.nombre ? ` ${userData.nombre}` : ""}! 👋\n\nSoy Eva, tu asistente de salud con IA.\n\nPuedo ayudarte a:\n• Agendar citas médicas automáticamente\n• Buscar doctores por especialidad\n• Ver tus próximas citas\n• Responder preguntas de salud\n\n¿En qué puedo ayudarte hoy?`
      );
    }
  };

  const addEvaMessage = (text: string, type: "text" | "success" = "text") => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text,
      sender: "eva",
      timestamp: new Date(),
      type,
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsProcessing(false);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
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

  const handleSendMessage = async () => {
    if (inputText.trim() === "" || isProcessing) return;

    const userMessage = inputText.trim();
    addUserMessage(userMessage);
    setInputText("");
    setIsProcessing(true);

    addThinkingMessage();

    try {
      const token = await SecureStore.getItemAsync("access_token");
      const id_token = await SecureStore.getItemAsync("id_token");
      if (!id_token) {
        return;
      }
      const decoded: { email: string } = jwtDecode(id_token) as {
        email: string;
      };

      const response = await fetch(`${apiUrl}/api/v1/eva/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          from: decoded.email || "user",
          content: userMessage,
        }),
      });

      removeThinkingMessage();

      if (response.ok) {
        const data = await response.json();

        // Detectar si es una confirmación de cita exitosa
        const isSuccessMessage =
          data.content.includes("✅") ||
          data.content.includes("Cita creada exitosamente");

        addEvaMessage(data.content, isSuccessMessage ? "success" : "text");
      } else {
        addEvaMessage("Lo siento, hubo un error al procesar tu solicitud.");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      removeThinkingMessage();
      addEvaMessage("No pude conectarme con el servidor. Intenta de nuevo.");
    }
  };

  // Sugerencias rápidas para el usuario
  const quickSuggestions = [
    {
      icon: Calendar,
      text: "Agendar cita",
      prompt: "Quiero agendar una cita médica",
    },
    {
      icon: User,
      text: "Buscar doctor",
      prompt: "Muéstrame doctores disponibles",
    },
    {
      icon: Clock,
      text: "Mis citas",
      prompt: "¿Cuándo es mi próxima cita?",
    },
  ];

  const handleQuickSuggestion = (prompt: string) => {
    if (!isProcessing) {
      setInputText(prompt);
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
              <Text className="text-blue-600 ml-2 font-medium">
                Eva está procesando tu solicitud...
              </Text>
            </View>
            <Text className="text-blue-400 text-xs mt-1">
              Buscando disponibilidad y creando tu cita
            </Text>
          </View>
        </View>
      );
    }

    if (item.sender === "eva") {
      const isSuccess = item.type === "success";

      return (
        <View className="flex-row items-start mb-4 px-4">
          <View
            className={`w-10 h-10 ${isSuccess ? "bg-green-500" : "bg-blue-500"} rounded-full items-center justify-center mr-3`}
          >
            {isSuccess ? (
              <CheckCircle size={20} color="white" />
            ) : (
              <Sparkles size={20} color="white" />
            )}
          </View>
          <View className="flex-1">
            <View
              className={`${isSuccess ? "bg-green-50 border border-green-200" : "bg-blue-50"} rounded-2xl rounded-tl-sm p-4`}
            >
              <Text
                className={`${isSuccess ? "text-gray-800" : "text-gray-800"} leading-5`}
              >
                {item.text}
              </Text>
            </View>
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
              Cargando Eva...
            </Text>
          </View>
        }
        ListFooterComponent={
          messages.length > 0 && !isProcessing ? (
            <View className="px-4 mt-2">
              <Text className="text-xs text-gray-400 text-center mb-3">
                Sugerencias rápidas:
              </Text>
              <View className="flex-row flex-wrap justify-center gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleQuickSuggestion(suggestion.prompt)}
                    className="bg-blue-50 px-4 py-2 rounded-full flex-row items-center"
                  >
                    <suggestion.icon size={14} color="#3B82F6" />
                    <Text className="text-blue-600 text-xs ml-1 font-medium">
                      {suggestion.text}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null
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
              placeholder="Ej: Necesito una cita con un cardiólogo el jueves..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-gray-900 py-2"
              multiline
              maxLength={500}
              editable={!isProcessing}
              onSubmitEditing={handleSendMessage}
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
