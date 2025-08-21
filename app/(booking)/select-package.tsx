import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import { ArrowLeft, Check, Clock } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function SelectPackage() {
  const [selectedPackage, setSelectedPackage] = useState("standard");

  const packages = [
    {
      id: "basic",
      name: "Basic Consultation",
      duration: "30 min",
      features: [
        "Initial consultation",
        "Basic examination",
        "Prescription if needed",
      ],
      recommended: false,
    },
    {
      id: "standard",
      name: "Standard Consultation",
      duration: "45 min",
      features: [
        "Comprehensive consultation",
        "Detailed examination",
        "Treatment plan",
        "Follow-up recommendations",
      ],
      recommended: true,
    },
    {
      id: "premium",
      name: "Premium Consultation",
      duration: "60 min",
      features: [
        "Extended consultation",
        "Complete health assessment",
        "Personalized treatment plan",
        "Follow-up scheduling",
        "Health monitoring",
      ],
      recommended: false,
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
        <Text className="text-lg font-semibold">Select Package</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Doctor Info */}
        <View className="mb-6">
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-gray-200 rounded-full mr-3" />
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">
                  Dr. Jenny Wilson
                </Text>
                <Text className="text-gray-500 text-sm">
                  Orthopedic Surgeon
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Package Selection */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">
            Choose Consultation Type
          </Text>

          {packages.map((pkg) => (
            <Pressable
              key={pkg.id}
              onPress={() => setSelectedPackage(pkg.id)}
              className={`mb-4 rounded-xl p-4 border-2 ${
                selectedPackage === pkg.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-1">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text
                        className={`font-semibold text-lg ${
                          selectedPackage === pkg.id
                            ? "text-blue-600"
                            : "text-gray-900"
                        }`}
                      >
                        {pkg.name}
                      </Text>
                      {pkg.recommended && (
                        <View className="bg-orange-100 px-2 py-1 rounded-full ml-2">
                          <Text className="text-orange-600 text-xs font-medium">
                            Recommended
                          </Text>
                        </View>
                      )}
                    </View>
                    <View className="flex-row items-center">
                      <Clock size={14} color="#6B7280" />
                      <Text className="text-gray-600 text-sm ml-1">
                        {pkg.duration}
                      </Text>
                    </View>
                  </View>
                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                      selectedPackage === pkg.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedPackage === pkg.id && (
                      <Check size={12} color="white" />
                    )}
                  </View>
                </View>
              </View>

              <View className="mt-3">
                {pkg.features.map((feature, index) => (
                  <View key={index} className="flex-row items-center mb-1">
                    <View className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                    <Text className="text-gray-600 text-sm">{feature}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Selected Package Summary */}
        <View className="mb-6">
          <View className="bg-gray-50 rounded-xl p-4">
            <Text className="font-semibold text-gray-900 mb-2">
              Selected Package
            </Text>
            <Text className="text-blue-600 font-medium">
              {packages.find((pkg) => pkg.id === selectedPackage)?.name}
            </Text>
            <Text className="text-gray-600 text-sm">
              Duration:{" "}
              {packages.find((pkg) => pkg.id === selectedPackage)?.duration}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View className="px-6 pb-6">
        <Link href="/patient-details" asChild>
          <Pressable className="bg-blue-500 py-4 rounded-full">
            <Text className="text-white text-center font-semibold text-lg">
              Continue
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScreenView>
  );
}
