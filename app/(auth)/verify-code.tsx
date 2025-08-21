import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function VerifyCode() {
  const [code, setCode] = useState(["", "", "", ""]);

  const handleCodeChange = (value: any, index: any) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  return (
    <ScreenView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {/* Content */}
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-center mb-2">
            Verify Code
          </Text>
          <Text className="text-gray-500 text-center mb-8 px-4">
            Please enter the code we just sent to email{"\n"}
            example@gmail.com
          </Text>

          {/* Code Input */}
          <View className="flex-row justify-center space-x-4 mb-8">
            {code.map((digit, index) => (
              <TextInput
                key={index}
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
                className="w-12 h-12 border-2 border-gray-200 rounded-lg text-center text-xl font-semibold"
                keyboardType="numeric"
                maxLength={1}
              />
            ))}
          </View>

          {/* Resend Code */}
          <View className="flex-row justify-center mb-8">
            <Text className="text-gray-500">Didnt receive code? </Text>
            <Link href="/" asChild>
              <Pressable>
                <Text className="text-blue-500 font-medium">Resend code</Text>
              </Pressable>
            </Link>
          </View>

          {/* Verify Button */}
          <Link href="/(auth)/complete-profile" asChild>
            <Pressable className="bg-blue-500 w-full py-4 rounded-full">
              <Text className="text-white text-center font-semibold text-lg">
                Verify
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScreenView>
  );
}
