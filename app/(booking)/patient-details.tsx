import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import { ArrowLeft, Calendar, Mail, Phone, User } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

export default function PatientDetails() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    reason: "",
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ScreenView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Link href="/" asChild>
          <Pressable>
            <ArrowLeft size={24} color="#000" />
          </Pressable>
        </Link>
        <Text className="text-lg font-semibold">Patient Details</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Form */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">
            Personal Information
          </Text>

          {/* Full Name */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
              <User size={20} color="#6B7280" />
              <TextInput
                value={formData.fullName}
                onChangeText={(value) => handleInputChange("fullName", value)}
                placeholder="Enter your full name"
                className="flex-1 ml-3 text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
              <Mail size={20} color="#6B7280" />
              <TextInput
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                className="flex-1 ml-3 text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Phone */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
              <Phone size={20} color="#6B7280" />
              <TextInput
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                className="flex-1 ml-3 text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Date of Birth */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
              <Calendar size={20} color="#6B7280" />
              <TextInput
                value={formData.dateOfBirth}
                onChangeText={(value) =>
                  handleInputChange("dateOfBirth", value)
                }
                placeholder="DD/MM/YYYY"
                className="flex-1 ml-3 text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Reason for Visit */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Reason for Visit *
            </Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <TextInput
                value={formData.reason}
                onChangeText={(value) => handleInputChange("reason", value)}
                placeholder="Brief description of your health concern"
                multiline
                numberOfLines={3}
                className="text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Additional Notes */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <TextInput
                value={formData.notes}
                onChangeText={(value) => handleInputChange("notes", value)}
                placeholder="Any additional information you'd like to share"
                multiline
                numberOfLines={4}
                className="text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        {/* Summary */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">
            Appointment Summary
          </Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Doctor:</Text>
              <Text className="font-medium text-gray-900">
                Dr. Jenny Wilson
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Date:</Text>
              <Text className="font-medium text-gray-900">
                Wed, 15 Nov 2023
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Time:</Text>
              <Text className="font-medium text-gray-900">9:00 AM</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Type:</Text>
              <Text className="font-medium text-gray-900">
                Standard Consultation
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View className="px-6 pb-6">
        <Link href="/service-summary" asChild>
          <Pressable className="bg-blue-500 py-4 rounded-full">
            <Text className="text-white text-center font-semibold text-lg">
              Book Appointment
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScreenView>
  );
}
