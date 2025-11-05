import SplashScreen from "@/components/SplashScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function Layout() {
  const router = useRouter();
  const [isAppReady, setIsAppReady] = useState(false);

  const [fontsLoaded] = useFonts({
    "Public-sans": require("../assets/fonts/PublicSans-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    const checkWelcome = async () => {
      const hasSeenWelcome = await AsyncStorage.getItem("hasSeenWelcome");
      if (!hasSeenWelcome) {
        router.replace("/welcome");
      } else {
        router.replace("/");
      }
    };

    if (isAppReady) {
      checkWelcome();
    }
  }, [isAppReady, router]);

  if (!isAppReady) {
    return <SplashScreen setIsAppReady={setIsAppReady} />;
  }

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
          name="(first-time)/welcome"
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
      </Stack>
    </SafeAreaProvider>
  );
}
