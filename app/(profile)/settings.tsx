import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import { ArrowLeft, Bell, CreditCard, Shield } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function SettingsScreen() {
  const settingsMenuItems = [
    {
      icon: Bell,
      label: "Notification Settings",
      href: "/notifications",
    },
    {
      icon: CreditCard,
      label: "Payment Settings",
      href: "/payment",
    },
    {
      icon: Shield,
      label: "Privacy Account",
      href: "/privacy",
    },
  ];

  return (
    <ScreenView className="flex-1 bg-white">
      {/* Settings Menu */}
      <View className="flex-1 px-6 pt-4">
        {settingsMenuItems.map((item, index) => (
          <Link key={index} href={"/"} asChild>
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
        ))}
      </View>
    </ScreenView>
  );
}
