import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import {
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  User,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function AppointmentConfirmation() {
  return (
    <ScreenView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-8">
        {/* Success Icon */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-4">
            <CheckCircle size={48} color="#10B981" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Appointment Booked!
          </Text>
          <Text className="text-gray-600 text-center">
            Your appointment has been successfully scheduled
          </Text>
        </View>

        {/* Appointment Details Card */}
        <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Appointment Details
          </Text>

          {/* Doctor Info */}
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-gray-200 rounded-full mr-3" />
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">
                Dr. Jenny Wilson
              </Text>
              <Text className="text-gray-500 text-sm">Orthopedic Surgeon</Text>
            </View>
          </View>

          {/* Appointment Info */}
          <View className="space-y-3">
            <View className="flex-row items-center">
              <Calendar size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-3">
                Wednesday, 15 November 2023
              </Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-3">9:00 AM - 9:45 AM</Text>
            </View>
            <View className="flex-row items-center">
              <MapPin size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-3">Standard Consultation</Text>
            </View>
            <View className="flex-row items-center">
              <User size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-3">Patient: John Doe</Text>
            </View>
          </View>
        </View>

        {/* Appointment ID */}
        <View className="bg-blue-50 rounded-xl p-4 mb-6">
          <Text className="text-blue-600 font-medium mb-1">Appointment ID</Text>
          <Text className="text-blue-900 font-semibold text-lg">
            #APT-2023-001
          </Text>
        </View>

        {/* Important Notes */}
        <View className="bg-amber-50 rounded-xl p-4 mb-6">
          <Text className="text-amber-800 font-medium mb-2">
            Important Notes
          </Text>
          <View className="space-y-1">
            <Text className="text-amber-700 text-sm">
              • Please arrive 15 minutes before your appointment
            </Text>
            <Text className="text-amber-700 text-sm">
              • Bring your ID and any relevant medical records
            </Text>
            <Text className="text-amber-700 text-sm">
              • Youll receive a reminder 24 hours before your appointment
            </Text>
          </View>
        </View>

        {/* Contact Info */}
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="font-medium text-gray-900 mb-2">
            Need to make changes?
          </Text>
          <Text className="text-gray-600 text-sm mb-1">
            Call us at: +1 (555) 123-4567
          </Text>
          <Text className="text-gray-600 text-sm">
            Email: appointments@healthcare.com
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 pb-6 space-y-3">
        <Link href="/(tabs)/bookings" asChild>
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
