import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ScreenView
      className="flex-1 bg-white"
      style={{ paddingTop: StatusBar.currentHeight }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mt-10 mb-10">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Sign In
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900 mb-2 mt-4">
              Email
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-4 text-base bg-gray-50"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />

            <Text className="text-base font-semibold text-gray-900 mb-2 mt-4">
              Password
            </Text>
            <View className="relative">
              <TextInput
                className="border border-gray-200 rounded-xl px-4 py-4 text-base bg-gray-50 pr-12"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#9CA3AF"
              />
              <Pressable
                className="absolute right-4 top-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text className="text-lg text-gray-600">
                  {showPassword ? "🙈" : "👁"}
                </Text>
              </Pressable>
            </View>

            <View className="flex-row justify-between items-center mt-4 mb-6">
              <Pressable
                className="flex-row items-center"
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${
                    rememberMe
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {rememberMe && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                  )}
                </View>
                <Text className="text-sm text-gray-600">Remember me</Text>
              </Pressable>

              <Link href={"/(auth)/change-password"} asChild>
                <Pressable>
                  <Text className="text-sm text-blue-500 font-semibold">
                    Forgot Password?
                  </Text>
                </Pressable>
              </Link>
            </View>

            <Pressable className="bg-blue-500 rounded-xl py-4 items-center mb-6">
              <Text className="text-white text-base font-semibold">
                Sign In
              </Text>
            </Pressable>

            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-4 text-sm text-gray-600">or</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            <View className="flex-row justify-center mb-6">
              <Pressable className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mx-2">
                <Text className="text-xl">🍎</Text>
              </Pressable>
              <Pressable className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mx-2">
                <Text className="text-xl font-bold text-red-500">G</Text>
              </Pressable>
              <Pressable className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mx-2">
                <Text className="text-xl font-bold text-blue-600">f</Text>
              </Pressable>
            </View>

            <View className="flex-row justify-center items-center">
              <Text className="text-sm text-gray-600">
                Dont have an account?{" "}
              </Text>
              <Link href="/(auth)/register" asChild>
                <Pressable>
                  <Text className="text-sm text-blue-500 font-semibold">
                    Sign Up
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenView>
  );
}
