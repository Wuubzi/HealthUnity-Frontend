import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const auth0Domain = "dev-kv01j6hec10g7jva.us.auth0.com";
const clientId = "qSkszKI8TNuAhxxhVajFqZ5QbDz3U75m";

export default function Login() {
  const [loading, setLoading] = useState(true);
  const [hasPrompted, setHasPrompted] = useState(false);
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
      responseType: "id_token token", // 👈 pedimos ambos
      usePKCE: false, // 👈 necesario para validar id_token
      extraParams: {
        audience: "https://api.healthunity.com",
        nonce: Crypto.randomUUID(),
        prompt: "login", // fuerza mostrar selector
      },
    },
    discovery
  );

  // Verifica si ya hay un token guardado
  useEffect(() => {
    const checkStoredToken = async () => {
      const token = await SecureStore.getItemAsync("id_token");
      if (token) {
         router.replace("/(tabs)");
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
    if (response?.type === "success") {
      const {id_token } = response.params;

      if (id_token) {
        SecureStore.setItemAsync("id_token", id_token);
        router.replace("/(tabs)");
      }
    } else if (response?.type === "error") {
      console.error("Error en login:", response);
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
}
