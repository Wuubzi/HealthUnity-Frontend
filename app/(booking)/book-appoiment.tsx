import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import { Calendar, Clock, MapPin, Shield, Star } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState("15");
  const [selectedTime, setSelectedTime] = useState("9:00 AM");

  const dates = [
    { day: "13", date: "Mon" },
    { day: "14", date: "Tue" },
    { day: "15", date: "Wed" },
    { day: "16", date: "Thu" },
    { day: "17", date: "Fri" },
    { day: "18", date: "Sat" },
  ];

  const morningTimes = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM"];
  const afternoonTimes = ["1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM"];

  return (
    <ScreenView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Text className="text-lg font-semibold">Book Appointment</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1">
        {/* Doctor Info */}
        <View className="mx-6 mb-6">
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-start">
              <View className="w-16 h-16 bg-gray-200 rounded-full mr-4" />
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Shield size={14} color="#3B82F6" />
                  <Text className="text-blue-500 text-xs ml-1">
                    Professional Doctor
                  </Text>
                </View>
                <Text className="font-semibold text-gray-900 mb-1">
                  Dr. Jenny Wilson
                </Text>
                <Text className="text-gray-500 text-sm mb-2">
                  Orthopedic Surgeon
                </Text>
                <View className="flex-row items-center">
                  <Star size={14} color="#FFA500" fill="#FFA500" />
                  <Text className="text-sm text-gray-600 ml-1">
                    4.9 (49 Reviews)
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Date Selection */}
        <View className="mx-6 mb-6">
          <Text className="text-lg font-semibold mb-4">Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {dates.map((date) => (
                <Pressable
                  key={date.day}
                  onPress={() => setSelectedDate(date.day)}
                  className={`px-4 py-3 rounded-xl items-center min-w-[60px] ${
                    selectedDate === date.day ? "bg-blue-500" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedDate === date.day ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {date.date}
                  </Text>
                  <Text
                    className={`text-lg font-semibold ${
                      selectedDate === date.day ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {date.day}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View className="mx-6 mb-6">
          <Text className="text-lg font-semibold mb-4">Select Time</Text>

          {/* Morning */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-600 mb-2">
              Morning
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {morningTimes.map((time) => (
                <Pressable
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedTime === time ? "bg-blue-500" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedTime === time ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {time}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Afternoon */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-600 mb-2">
              Afternoon
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {afternoonTimes.map((time) => (
                <Pressable
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedTime === time ? "bg-blue-500" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedTime === time ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {time}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Appointment Details */}
        <View className="mx-6 mb-6">
          <Text className="text-lg font-semibold mb-4">
            Appointment Details
          </Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <Calendar size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-2">Wed, 15 Nov 2023</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Clock size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-2">{selectedTime}</Text>
            </View>
            <View className="flex-row items-center">
              <MapPin size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-2">
                Orthopedic Consultation
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Book Button */}
      <View className="px-6 pb-6">
        <Link href="/select-package" asChild>
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
