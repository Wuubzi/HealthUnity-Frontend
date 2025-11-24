import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";

export default function Welcome() {
  useEffect(() => {
    const welcome = async () => {
      await AsyncStorage.setItem("hasSeenWelcome", "true");
    };
    welcome();
  }, []);
  return (
    <View className="flex-1 bg-gray-100">
      {/* Imagen grande superior */}
      <View className="flex-1 justify-center items-center mt-10">
        <Image
          source={require("../../assets/images/welcome.png")}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
          // Alternativa con className si prefieres Tailwind
          // className="w-full h-full"
        />
      </View>

      {/* Card inferior */}
      <View className="bg-white rounded-t-3xl p-6 items-center justify-between h-[45%]">
        <View className="flex-1 justify-center">
          <Text className="text-center text-2xl font-extrabold mb-2">
            Tu <Text className="text-blue-600">App Ideal</Text> para Reservar
            Citas Médicas
          </Text>

          <Text className="text-center text-md text-gray-600 mb-6">
            Agenda tus citas de forma fácil y lleva el control de tu salud en un
            solo lugar.
          </Text>
        </View>

        {/* Botón principal */}
        <View className="w-full items-center">
          <Link href="/onboarding" asChild>
            <Pressable className="bg-blue-600 px-10 py-4 rounded-full mb-4 w-full max-w-xs">
              <Text className="text-white font-semibold text-base text-center">
                Empezar ahora
              </Text>
            </Pressable>
          </Link>

          {/* Link de inicio de sesión */}
          <Text className="text-gray-500 text-center">
            ¿Ya tienes una cuenta?
            <Link href="/">
              <Text className="text-blue-600 font-semibold">
                {" "}
                Inicia sesión
              </Text>
            </Link>
          </Text>
        </View>
      </View>
    </View>
  );
}
