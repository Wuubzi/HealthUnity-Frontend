import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
const auth0Domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN || "";
const clientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || "";

type AuthState =
  | "checking"
  | "ready"
  | "authenticating"
  | "registering"
  | "error";

const CODE_VERIFIER_KEY = "auth_code_verifier";

export default function Login() {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const hasProcessedResponse = useRef(false);
  const hasInitiatedAuth = useRef(false);
  const storedVerifier = useRef<string | null>(null);

  const discovery = {
    authorizationEndpoint: `https://${auth0Domain}/authorize`,
    tokenEndpoint: `https://${auth0Domain}/oauth/token`,
    revocationEndpoint: `https://${auth0Domain}/oauth/revoke`,
  };

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "healthunityfrontend",
    path: "redirect",
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      redirectUri: redirectUri,
      scopes: ["openid", "profile", "email", "offline_access"],
      responseType: "code",
      usePKCE: true,
      extraParams: {
        audience: "https://api.healthunity.com",
        nonce: Crypto.randomUUID(),
      },
    },
    discovery
  );

  const register = async (email: string, accessToken: string) => {
    try {
      setAuthState("registering");
      const response = await fetch(`${apiUrl}/api/v1/paciente/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          gmail: email,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en registro: ${response.status}`);
      }

      const data = await response.json();

      if (data?.profileCompleted) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/complete-profile");
      }
    } catch (error) {
      await SecureStore.deleteItemAsync("id_token");
      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync(CODE_VERIFIER_KEY);
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido en el registro"
      );
      setAuthState("error");
    }
  };

  // Check stored token on mount
  useEffect(() => {
    const checkStoredToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("id_token");

        if (token) {
          const decoded: any = jwtDecode(token);
          const now = Date.now() / 1000;

          if (decoded.exp && decoded.exp > now) {
            router.replace("/(tabs)");
            return;
          } else {
            await SecureStore.deleteItemAsync("id_token");
            await SecureStore.deleteItemAsync("access_token");
            await SecureStore.deleteItemAsync(CODE_VERIFIER_KEY);
          }
        }

        setAuthState("ready");
      } catch (error) {
        setAuthState("ready");
      }
    };

    checkStoredToken();
  }, []);

  // Auto-trigger login when ready - SIN DELAY
  useEffect(() => {
    if (authState === "ready" && request && !hasInitiatedAuth.current) {
      handleLogin();
    }
  }, [authState, request]);

  // Handle the login process
  const handleLogin = async () => {
    if (hasInitiatedAuth.current || !request) {
      console.log("⚠️ Auth already initiated or request not ready");
      return;
    }

    try {
      hasInitiatedAuth.current = true;
      setAuthState("authenticating");
      setError(null);
      hasProcessedResponse.current = false;

      // Store the code_verifier BEFORE opening the browser
      if (request.codeVerifier) {
        await SecureStore.setItemAsync(CODE_VERIFIER_KEY, request.codeVerifier);
        storedVerifier.current = request.codeVerifier;
        console.log(
          "✅ Code verifier stored:",
          request.codeVerifier.substring(0, 10) + "..."
        );
      } else {
        throw new Error("Code verifier no disponible en el request");
      }

      console.log("🚀 Iniciando login automáticamente...");

      await promptAsync({
        showInRecents: false,
      });
    } catch (error) {
      console.error("❌ Error en handleLogin:", error);
      setError("No se pudo iniciar el proceso de autenticación");
      setAuthState("error");
      hasInitiatedAuth.current = false;
    }
  };

  // Handle OAuth response
  useEffect(() => {
    const handleResponse = async () => {
      if (hasProcessedResponse.current || !response) {
        return;
      }

      hasProcessedResponse.current = true;

      if (response.type === "success") {
        const { code } = response.params;

        if (!code) {
          setError("No se recibió el código de autorización");
          setAuthState("error");
          hasInitiatedAuth.current = false;
          return;
        }

        try {
          // Retrieve the stored code_verifier
          const codeVerifier =
            await SecureStore.getItemAsync(CODE_VERIFIER_KEY);

          if (!codeVerifier) {
            throw new Error("Code verifier no encontrado en el almacenamiento");
          }

          console.log(
            "🔑 Usando code_verifier:",
            codeVerifier.substring(0, 10) + "..."
          );

          const tokenResponse = await fetch(
            `https://${auth0Domain}/oauth/token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                grant_type: "authorization_code",
                client_id: clientId,
                code: code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
              }),
            }
          );

          if (!tokenResponse.ok) {
            const errorData = await tokenResponse.text();
            console.error("❌ Error al obtener tokens:", errorData);
            throw new Error(`Error al obtener tokens: ${errorData}`);
          }

          const tokens = await tokenResponse.json();
          const { id_token, access_token } = tokens;

          if (!access_token) {
            throw new Error("No se recibió access_token");
          }

          const decoded: any = jwtDecode(id_token);
          const email = decoded.email || decoded.gmail;

          if (!email) {
            throw new Error("No se pudo obtener el email del usuario");
          }

          await SecureStore.setItemAsync("id_token", id_token);
          await SecureStore.setItemAsync("access_token", access_token);
          await SecureStore.deleteItemAsync(CODE_VERIFIER_KEY);

          console.log("✅ Autenticación exitosa");
          await register(email, access_token);
        } catch (error) {
          await SecureStore.deleteItemAsync("id_token");
          await SecureStore.deleteItemAsync("access_token");
          await SecureStore.deleteItemAsync(CODE_VERIFIER_KEY);
          hasInitiatedAuth.current = false;

          console.error("❌ Error en handleResponse:", error);
          setError(
            error instanceof Error
              ? error.message
              : "Error procesando el código de autorización"
          );
          setAuthState("error");
        }
      } else if (response.type === "error") {
        console.error("❌ Response error:", response.error);
        setError(response.error?.message || "Error en el login");
        setAuthState("error");
        await SecureStore.deleteItemAsync(CODE_VERIFIER_KEY);
        hasInitiatedAuth.current = false;
      } else if (response.type === "cancel") {
        setAuthState("ready");
        setError("Autenticación cancelada. Por favor intenta de nuevo.");
        await SecureStore.deleteItemAsync(CODE_VERIFIER_KEY);
        hasInitiatedAuth.current = false;
      } else if (response.type === "dismiss") {
        setAuthState("ready");
        await SecureStore.deleteItemAsync(CODE_VERIFIER_KEY);
        hasInitiatedAuth.current = false;
      }
    };

    handleResponse();
  }, [response]);

  // Timeout for authentication
  useEffect(() => {
    if (authState === "authenticating") {
      const timeout = setTimeout(() => {
        if (authState === "authenticating") {
          setError(
            "La autenticación está tardando mucho. Por favor intenta de nuevo."
          );
          setAuthState("error");
          SecureStore.deleteItemAsync(CODE_VERIFIER_KEY);
          hasInitiatedAuth.current = false;
        }
      }, 45000);

      return () => clearTimeout(timeout);
    }
  }, [authState]);

  const handleRetry = async () => {
    setError(null);
    hasProcessedResponse.current = false;
    hasInitiatedAuth.current = false;
    await SecureStore.deleteItemAsync(CODE_VERIFIER_KEY);
    setAuthState("ready");
    console.log("🔄 Reiniciando autenticación...");
  };

  if (authState === "checking") {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.text}>Verificando sesión...</Text>
      </View>
    );
  }

  if (authState === "ready") {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.text}>Iniciando sesión...</Text>
      </View>
    );
  }

  if (authState === "authenticating") {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.text}>Autenticando con Auth0...</Text>
        <Text style={styles.subText}>
          Completa la verificación en el navegador
        </Text>
        <Text style={styles.subText}>
          Si usas verificación en dos pasos, esto puede tomar un momento
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleRetry}
        >
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (authState === "registering") {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.text}>Configurando tu cuenta...</Text>
      </View>
    );
  }

  if (authState === "error" && error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>⚠️ Error de autenticación</Text>
        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity style={styles.button} onPress={handleRetry}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0066CC" />
      <Text style={styles.text}>Cargando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0066CC",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 40,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#333",
  },
  subText: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D32F2F",
    marginBottom: 12,
    textAlign: "center",
  },
  errorText: {
    color: "#D32F2F",
    marginBottom: 16,
    textAlign: "center",
    fontSize: 14,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#0066CC",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0066CC",
    marginTop: 16,
  },
  secondaryButtonText: {
    color: "#0066CC",
    fontSize: 14,
    fontWeight: "600",
  },
});
