import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import { MapPin } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function LocationPermission() {
  return (
    <ScreenView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {/* Content */}
        <View className="flex-1 justify-center items-center">
          {/* Location Icon */}
          <View className="w-32 h-32 bg-blue-100 rounded-full items-center justify-center mb-8">
            <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center">
              <MapPin size={32} color="white" />
            </View>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-center mb-4">
            What is Your Location?
          </Text>

          {/* Description */}
          <Text className="text-gray-500 text-center mb-12 px-4 leading-6">
            We need to know your location in order to suggest{"\n"}
            nearby services.
          </Text>

          {/* Allow Location Button */}
          <Link href="/" asChild>
            <Pressable className="bg-blue-500 w-full py-4 rounded-full mb-4">
              <Text className="text-white text-center font-semibold text-lg">
                Allow Location Access
              </Text>
            </Pressable>
          </Link>

          {/* Manual Location Button */}
          <Link href="/enter-location" asChild>
            <Pressable className="w-full py-4">
              <Text className="text-blue-500 text-center font-semibold text-lg">
                Enter Location Manually
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScreenView>
  );
}
