import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import { Camera, User } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function CompleteProfile() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  //   const [gender, setGender] = useState("");

  return (
    <ScreenView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {/* Content */}
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-bold text-center mb-2">
            Complete Your Profile
          </Text>
          <Text className="text-gray-500 text-center mb-8 px-4">
            Complete your details or continue with social media
          </Text>

          {/* Profile Picture */}
          <View className="items-center mb-8">
            <View className="relative">
              <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center">
                <User size={40} color="#666" />
              </View>
              <Pressable className="absolute -bottom-1 -right-1 bg-blue-500 w-8 h-8 rounded-full items-center justify-center">
                <Camera size={16} color="white" />
              </Pressable>
            </View>
          </View>

          {/* Name Input */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="John Doe"
            />
          </View>

          {/* Phone Number Input */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Phone Number</Text>
            <View className="flex-row">
              <View className="border border-gray-300 rounded-l-lg px-3 py-3 bg-gray-50">
                <Text className="text-gray-600">+1</Text>
              </View>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                className="flex-1 border border-l-0 border-gray-300 rounded-r-lg px-4 py-3"
                placeholder="Enter Phone Number"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Gender Input */}
          <View className="mb-8">
            <Text className="text-gray-700 mb-2 font-medium">Gender</Text>
            <View className="border border-gray-300 rounded-lg px-4 py-3">
              <Text className="text-gray-400">Select</Text>
            </View>
          </View>

          {/* Complete Profile Button */}
          <Link href="/(location)/location-permission" asChild>
            <Pressable className="bg-blue-500 w-full py-4 rounded-full">
              <Text className="text-white text-center font-semibold text-lg">
                Complete Profile
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScreenView>
  );
}
