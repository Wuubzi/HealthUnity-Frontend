import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function Layout() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Public-sans": require("../assets/fonts/PublicSans-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    const checkWelcome = async () => {
      if (!fontsLoaded) return;

      try {
        const hasSeenWelcome = await AsyncStorage.getItem("hasSeenWelcome");

        if (!hasSeenWelcome) {
          router.replace("/welcome");
        } else {
          router.replace("/");
        }
      } catch (error) {
        console.error("Error checking welcome status:", error);
        router.replace("/welcome");
      }
    };

    checkWelcome();
  }, [fontsLoaded, router]);

  // Muestra null mientras cargan las fuentes
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="+not-found"
          options={{
            headerTransparent: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="(auth)/login"
          options={{
            headerTransparent: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="(doctors)/doctors-details"
          options={{
            headerTransparent: true,
            headerTitle: "Detalles Del Doctor",
          }}
        />
        <Stack.Screen
          name="(profile)/privacy"
          options={{
            headerTransparent: true,
            headerTitle: "Política de Privacidad",
          }}
        />
        <Stack.Screen
          name="(profile)/edit-profile"
          options={{
            headerTransparent: true,
            headerTitle: "Editar Perfil",
          }}
        />
        <Stack.Screen
          name="(first-time)/welcome"
          options={{
            headerTransparent: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="(auth)/complete-profile"
          options={{
            headerTransparent: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="(first-time)/onboarding"
          options={{
            headerTransparent: true,
            headerTitle: "",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(booking)/book-appoiment"
          options={{
            headerTransparent: true,
            headerTitle: "Reservar Cita",
          }}
        />
        <Stack.Screen
          name="(booking)/patient-details"
          options={{
            headerTransparent: true,
            headerTitle: "Detalles Del Paciente",
          }}
        />
        <Stack.Screen
          name="(booking)/service-summary"
          options={{
            headerTransparent: true,
            headerTitle: "Resumen Cita",
          }}
        />
        <Stack.Screen
          name="(booking)/appoiment-confirmation"
          options={{
            headerTransparent: true,
            headerTitle: "Cita Agendada",
          }}
        />
        <Stack.Screen
          name="reviews"
          options={{
            headerTransparent: true,
            headerTitle: "Calificar Consulta",
          }}
        />
      </Stack>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
    </SafeAreaProvider>
  );
}
