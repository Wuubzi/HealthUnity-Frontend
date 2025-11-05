import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import { ArrowLeft, LogOut, Settings, Shield, User } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

export default function Profile() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  type MenuItem = {
    icon: React.ComponentType<{ size?: number; color?: string }>;
    label: string;
    href?: "/edit-profile" | "/settings" | "/privacy";
    onPress?: () => void;
  };



  const profileMenuItems: MenuItem[] = [
    {
      icon: User,
      label: "Account Setting",
      href: "/edit-profile",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
    },
    {
      icon: Shield,
      label: "Privacy Policy",
      href: "/privacy",
    },
    {
      icon: LogOut,
      label: "Log Out",
      onPress: () => setShowLogoutModal(true),
    },
  ];

  return (
    <ScreenView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Link href="/" asChild>
          <Pressable>
            <ArrowLeft size={24} color="#000" />
          </Pressable>
        </Link>
        <Text className="text-lg font-semibold">Profile</Text>
        <View className="w-6" />
      </View>

      {/* Profile Info */}
      <View className="items-center px-6 py-8">
        <View className="w-24 h-24 bg-gray-200 rounded-full mb-4">
          <View className="w-full h-full rounded-full bg-blue-100 items-center justify-center">
            <User size={32} color="#3B82F6" />
          </View>
        </View>
        <Text className="text-xl font-bold text-gray-900 mb-1">
          Gabriel Hamster
        </Text>
        <Text className="text-gray-500">gabriel.hamster@example.com</Text>
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
                Logout
              </Text>
              <Text className="text-gray-600 text-center">
                Are you sure you want to log out?
              </Text>
            </View>
            <View className="flex-row space-x-3">
              <Pressable
                onPress={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-100 py-3 rounded-lg"
              >
                <Text className="text-gray-700 text-center font-medium">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowLogoutModal(false);
                  // Handle logout logic here
                }}
                className="flex-1 bg-red-500 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-medium">
                  Yes, Logout
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenView>
  );
}
