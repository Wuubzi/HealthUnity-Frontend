import ScreenView from "@/components/Screen";
import { MenuItem } from "@/types/profile";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft, LogOut, Shield, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Profile() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const profileMenuItems: MenuItem[] = [
    {
      icon: User,
      label: "Editar Perfil",
      href: "/edit-profile",
    },
    {
      icon: Shield,
      label: "Politica de Privacidad",
      href: "/privacy",
    },
    {
      icon: LogOut,
      label: "Cerrar Sesión",
      onPress: () => setShowLogoutModal(true),
    },
  ];

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

        if (!response.ok) {
          throw new Error("Error fetching user data");
        }
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Función para refrescar los datos
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getUserData();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const cerrarSesion = async () => {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("id_token");
    router.replace("/login");
  };

  return (
    <ScreenView className="flex-1 bg-white">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
      >
        {/* Header */}
        <View className="flex-row items-center justify-center px-6 py-4">
          <Text className="text-lg font-semibold">Perfil</Text>
          <View className="w-6" />
        </View>

        {/* Profile Info */}
        <View className="items-center px-6 py-8">
          <View className="w-24 h-24 bg-gray-200 rounded-full mb-4">
            <View className="w-24 h-24 bg-gray-200 rounded-full mb-4 overflow-hidden">
              {userData?.url_imagen ? (
                <Image
                  source={{ uri: userData?.url_imagen }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full rounded-full bg-blue-100 items-center justify-center">
                  <User size={32} color="#3B82F6" />
                </View>
              )}
            </View>
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-1">
            {userData?.nombre || ""}
          </Text>
          <Text className="text-gray-500">{userData?.gmail || ""} </Text>
        </View>

        {/* Menu Items */}
        <View className="flex-1 px-6">
          {profileMenuItems.map((item, index) => (
            <View key={index}>
              {item.href ? (
                <Link href={item.href} asChild>
                  <Pressable className="flex-row items-center py-4 border-b border-gray-100">
                    <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                      <item.icon size={20} color="#666" />
                    </View>
                    <Text className="flex-1 text-gray-900 font-medium">
                      {item.label}
                    </Text>
                    <ArrowLeft
                      size={16}
                      color="#666"
                      style={{ transform: [{ rotate: "180deg" }] }}
                    />
                  </Pressable>
                </Link>
              ) : (
                <Pressable
                  onPress={item.onPress}
                  className="flex-row items-center py-4 border-b border-gray-100"
                >
                  <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                    <item.icon size={20} color="#666" />
                  </View>
                  <Text className="flex-1 text-gray-900 font-medium">
                    {item.label}
                  </Text>
                  <ArrowLeft
                    size={16}
                    color="#666"
                    style={{ transform: [{ rotate: "180deg" }] }}
                  />
                </Pressable>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Logout Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-xl p-6 w-full max-w-sm">
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                <LogOut size={24} color="#EF4444" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Cerrar Sesión
              </Text>
              <Text className="text-gray-600 text-center">
                Estas seguro de Cerrar Sesion?
              </Text>
            </View>
            <View className="flex-row space-x-3">
              <Pressable
                onPress={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-100 py-3 rounded-lg"
              >
                <Text className="text-gray-700 text-center font-medium">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowLogoutModal(false);
                  cerrarSesion();
                }}
                className="flex-1 bg-red-500 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-medium">
                  Si, Cerrar Sesión
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenView>
  );
}
