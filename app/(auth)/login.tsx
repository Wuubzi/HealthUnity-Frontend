import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();
const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
const auth0Domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN || "";
const clientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || "";

export default function Login() {
  const [loading, setLoading] = useState(true);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const discovery = {
    authorizationEndpoint: `https://${auth0Domain}/authorize`,
    tokenEndpoint: `https://${auth0Domain}/oauth/token`,
    revocationEndpoint: `https://${auth0Domain}/oauth/revoke`,
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      redirectUri: AuthSession.makeRedirectUri(),
      scopes: ["openid", "profile", "email"],
      responseType: "id_token token",
      usePKCE: false,
      extraParams: {
        audience: "https://api.healthunity.com",
        nonce: Crypto.randomUUID(),
        prompt: "login",
      },
    },
    discovery
  );

  const register = async (email: string, idToken: string) => {
    try {
      console.log("Registrando usuario:", email);
      
      const response = await fetch(`${apiUrl}/api/v1/paciente/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`, // Añade el token si tu API lo requiere
        },
        body: JSON.stringify({
          gmail: email, // o cambiar a "email" si tu API usa ese campo
        }),
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        throw new Error(`Error en registro: ${response.status}`);
      }

      const data = await response.json();
      console.log("Datos del registro:", data);
      
      if (data?.profileCompleted) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/complete-profile");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setLoading(false);
    }
  };

  // Verifica si ya hay un token guardado
  useEffect(() => {
    const checkStoredToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("id_token");
        if (token) {
          // Verifica si el token es válido
          const decoded: any = jwtDecode(token);
          const now = Date.now() / 1000;
          
          if (decoded.exp && decoded.exp > now) {
            router.replace("/(tabs)");
            return;
          } else {
            // Token expirado, elimínalo
            await SecureStore.deleteItemAsync("id_token");
          }
        }
      } catch (error) {
        console.error("Error verificando token:", error);
      }
      setLoading(false);
    };
    checkStoredToken();
  }, []);

  useEffect(() => {
    if (!loading && request && !hasPrompted) {
      setHasPrompted(true);
      promptAsync();
    }
  }, [loading, request, hasPrompted]);

  // Procesa la respuesta
  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === "success") {
        console.log("Login exitoso, params:", response.params);
        
        const { id_token, access_token } = response.params;

        if (id_token) {
          try {
            const decoded: any = jwtDecode(id_token);
            console.log("Token decodificado:", decoded);
            
            // Auth0 usa 'email', no 'gmail'
            const email = decoded.email || decoded.gmail;
            
            if (!email) {
              console.error("No se encontró email en el token:", decoded);
              setError("No se pudo obtener el email del usuario");
              return;
            }

            // Guarda el token ANTES de hacer el registro
            await SecureStore.setItemAsync("id_token", id_token);
            if (access_token) {
              await SecureStore.setItemAsync("access_token", access_token);
            }

            // Luego registra
            await register(email, id_token);
          } catch (error) {
            console.error("Error procesando token:", error);
            setError("Error procesando el token");
          }
        } else {
          console.error("No se recibió id_token");
          setError("No se recibió el token de identificación");
        }
      } else if (response?.type === "error") {
        console.error("Error en login:", response.error);
        setError(response.error?.message || "Error en el login");
      } else if (response?.type === "cancel") {
        console.log("Login cancelado por el usuario");
        setLoading(false);
      }
    };

    if (response) {
      handleResponse();
    }
  }, [response]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Iniciando sesión...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ color: "red", marginBottom: 20 }}>Error: {error}</Text>
        <Text onPress={() => {
          setError(null);
          setHasPrompted(false);
          setLoading(true);
          setTimeout(() => setLoading(false), 100);
        }}>
          Intentar de nuevo
        </Text>
      </View>
    );
  }

  return null;
}