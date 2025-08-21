import ScreenView from "@/components/Screen";
import { Camera, User } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function EditProfileScreen() {
  return (
    <ScreenView className="flex-1 bg-white">
      {/* Profile Photo */}
      <View className="items-center px-6 py-8">
        <View className="relative">
          <View className="w-24 h-24 bg-gray-200 rounded-full mb-4">
            <View className="w-full h-full rounded-full bg-blue-100 items-center justify-center">
              <User size={32} color="#3B82F6" />
            </View>
          </View>
          <Pressable className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full items-center justify-center">
            <Camera size={16} color="#fff" />
          </Pressable>
        </View>
        <Pressable>
          <Text className="text-blue-500 font-medium">Change Photo</Text>
        </Pressable>
      </View>

      {/* Form Fields */}
      <ScrollView className="flex-1 px-6">
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
          <View className="border border-gray-200 rounded-lg p-4">
            <Text className="text-gray-900">Gabriel Hamster</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Email</Text>
          <View className="border border-gray-200 rounded-lg p-4">
            <Text className="text-gray-900">gabriel.hamster@example.com</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Phone Number</Text>
          <View className="border border-gray-200 rounded-lg p-4">
            <Text className="text-gray-900">+1 (555) 123-4567</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Date of Birth</Text>
          <View className="border border-gray-200 rounded-lg p-4">
            <Text className="text-gray-900">January 15, 1990</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Gender</Text>
          <View className="border border-gray-200 rounded-lg p-4">
            <Text className="text-gray-900">Male</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Address</Text>
          <View className="border border-gray-200 rounded-lg p-4">
            <Text className="text-gray-900">
              123 Main St, New York, NY 10001
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="px-6 py-4 bg-white border-t border-gray-100">
        <Pressable className="bg-blue-500 py-4 rounded-lg">
          <Text className="text-white text-center font-semibold text-lg">
            Save Changes
          </Text>
        </Pressable>
      </View>
    </ScreenView>
  );
}
