import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import { CheckCircle, Download, Share } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function AppointmentSuccess() {
  return (
    <ScreenView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-8">
        {/* Success Animation/Icon */}
        <View className="items-center mb-8">
          <View className="w-32 h-32 bg-green-100 rounded-full items-center justify-center mb-6">
            <CheckCircle size={64} color="#10B981" />
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-3">
            Payment Successful!
          </Text>
          <Text className="text-gray-600 text-center text-lg">
            Your appointment has been confirmed
          </Text>
        </View>

        {/* Appointment Summary Card */}
        <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
          <View className="items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Appointment Confirmed
            </Text>
            <Text className="text-blue-600 font-medium text-lg">
              #APT-2023-001
            </Text>
          </View>

          <View className="bg-gray-50 rounded-xl p-4">
            <View className="flex-row items-center mb-3">
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

            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Date:</Text>
                <Text className="font-medium text-gray-900">
                  Wed, 15 Nov 2023
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Time:</Text>
                <Text className="font-medium text-gray-900">9:00 AM</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Duration:</Text>
                <Text className="font-medium text-gray-900">45 minutes</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Type:</Text>
                <Text className="font-medium text-gray-900">
                  Standard Consultation
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3 mb-6">
          <Pressable className="bg-blue-500 py-4 rounded-full flex-row items-center justify-center">
            <Download size={20} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">
              Download Receipt
            </Text>
          </Pressable>

          <Pressable className="bg-gray-100 py-4 rounded-full flex-row items-center justify-center">
            <Share size={20} color="#374151" />
            <Text className="text-gray-700 font-semibold text-lg ml-2">
              Share Appointment
            </Text>
          </Pressable>
        </View>

        {/* Next Steps */}
        <View className="bg-blue-50 rounded-xl p-4 mb-6">
          <Text className="text-blue-800 font-semibold mb-3">Whats Next?</Text>
          <View className="space-y-2">
            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2" />
              <Text className="text-blue-700 text-sm flex-1">
                Youll receive a confirmation email with all the details
              </Text>
            </View>
            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2" />
              <Text className="text-blue-700 text-sm flex-1">
                A reminder will be sent 24 hours before your appointment
              </Text>
            </View>
            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2" />
              <Text className="text-blue-700 text-sm flex-1">
                Please arrive 15 minutes early at the clinic
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="font-semibold text-gray-900 mb-2">Need Help?</Text>
          <Text className="text-gray-600 text-sm mb-1">
            Call us: +1 (555) 123-4567
          </Text>
          <Text className="text-gray-600 text-sm">
            Email: support@healthcare.com
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="px-6 pb-6 space-y-3">
        <Link href="/" asChild>
          <Pressable className="bg-blue-500 py-4 rounded-full">
            <Text className="text-white text-center font-semibold text-lg">
              View My Appointments
            </Text>
          </Pressable>
        </Link>

        <Link href="/" asChild>
          <Pressable className="bg-gray-100 py-4 rounded-full">
            <Text className="text-gray-700 text-center font-semibold text-lg">
              Back to Home
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScreenView>
  );
}
