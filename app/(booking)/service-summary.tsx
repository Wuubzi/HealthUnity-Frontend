import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function ServiceSummary() {
  return (
    <ScreenView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Link href="/" asChild>
          <Pressable>
            <ArrowLeft size={24} color="#000" />
          </Pressable>
        </Link>
        <Text className="text-lg font-semibold">Service Summary</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Service Details */}
        <View className="mb-6">
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Appointment Summary
            </Text>

            {/* Doctor Info */}
            <View className="flex-row items-center mb-4">
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

            {/* Appointment Details */}
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
                <Text className="text-gray-600 ml-3">
                  Standard Consultation
                </Text>
              </View>
              <View className="flex-row items-center">
                <User size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-3">Duration: 45 minutes</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Service Type */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">Service Type</Text>
          <View className="bg-blue-50 rounded-xl p-4">
            <Text className="text-blue-600 font-semibold text-lg mb-2">
              Standard Consultation
            </Text>
            <Text className="text-blue-700 text-sm mb-3">
              45 minutes comprehensive consultation
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                <Text className="text-blue-700 text-sm">
                  Comprehensive consultation
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                <Text className="text-blue-700 text-sm">
                  Detailed examination
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                <Text className="text-blue-700 text-sm">Treatment plan</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                <Text className="text-blue-700 text-sm">
                  Follow-up recommendations
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Patient Information */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">
            Patient Information
          </Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Name:</Text>
              <Text className="font-medium text-gray-900">John Doe</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Email:</Text>
              <Text className="font-medium text-gray-900">
                john.doe@email.com
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Phone:</Text>
              <Text className="font-medium text-gray-900">
                +1 (555) 123-4567
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Reason:</Text>
              <Text className="font-medium text-gray-900">
                Knee pain evaluation
              </Text>
            </View>
          </View>
        </View>

        {/* Important Notes */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">Important Notes</Text>
          <View className="bg-amber-50 rounded-xl p-4">
            <View className="space-y-2">
              <View className="flex-row items-start">
                <View className="w-2 h-2 bg-amber-500 rounded-full mr-2 mt-2" />
                <Text className="text-amber-700 text-sm flex-1">
                  Please arrive 15 minutes before your scheduled appointment
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-2 h-2 bg-amber-500 rounded-full mr-2 mt-2" />
                <Text className="text-amber-700 text-sm flex-1">
                  Bring a valid ID and any relevant medical records
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-2 h-2 bg-amber-500 rounded-full mr-2 mt-2" />
                <Text className="text-amber-700 text-sm flex-1">
                  You will receive a confirmation email shortly
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 pb-6 space-y-3">
        <Link href="/(booking)/appoiment-confirmation" asChild>
          <Pressable className="bg-blue-500 py-4 rounded-full">
            <Text className="text-white text-center font-semibold text-lg">
              Confirm Appointment
            </Text>
          </Pressable>
        </Link>

        <Link href="/" asChild>
          <Pressable className="bg-gray-100 py-4 rounded-full">
            <Text className="text-gray-700 text-center font-semibold text-lg">
              Modify Appointment
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScreenView>
  );
}
