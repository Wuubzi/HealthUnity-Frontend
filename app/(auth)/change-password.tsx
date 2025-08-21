import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <ScreenView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {/* Content */}
        <View className="flex-1 pt-10">
          <Text className="text-2xl font-bold text-center mb-2">
            New Password
          </Text>
          <Text className="text-gray-500 text-center mb-8 px-4">
            Your new password must be unique from those{"\n"}
            previously used.
          </Text>

          {/* Password Input */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="border border-gray-300 rounded-lg px-4 py-3 pr-12"
                placeholder="Enter your password"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3"
              >
                {showPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </Pressable>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View className="mb-8">
            <Text className="text-gray-700 mb-2 font-medium">
              Confirm Password
            </Text>
            <View className="relative">
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                className="border border-gray-300 rounded-lg px-4 py-3 pr-12"
                placeholder="Re-enter your password"
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </Pressable>
            </View>
          </View>

          {/* Create Password Button */}
          <Link href="/complete-profile" asChild>
            <Pressable className="bg-blue-500 w-full py-4 rounded-full">
              <Text className="text-white text-center font-semibold text-lg">
                Create New Password
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScreenView>
  );
}
