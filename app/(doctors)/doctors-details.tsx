import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import { Heart, MapPin, Search, Star } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function DoctorDetailScreen() {
  const [isFavorite, setIsFavorite] = useState(false);

  const workingHours = [
    { day: "Monday", time: "09:00 - 17:00" },
    { day: "Tuesday", time: "09:00 - 17:00" },
    { day: "Wednesday", time: "09:00 - 17:00" },
    { day: "Thursday", time: "09:00 - 17:00" },
    { day: "Friday", time: "09:00 - 17:00" },
    { day: "Saturday", time: "09:00 - 12:00" },
    { day: "Sunday", time: "Closed" },
  ];

  const reviews = [
    {
      id: 1,
      name: "John Doe",
      date: "2 days ago",
      rating: 5,
      comment: "Very professional and caring doctor. Highly recommend!",
      avatar: "https://via.placeholder.com/40x40",
    },
    {
      id: 2,
      name: "Emily Johnson",
      date: "1 week ago",
      rating: 5,
      comment: "Excellent service and very knowledgeable. Great experience.",
      avatar: "https://via.placeholder.com/40x40",
    },
  ];

  const clinicPhotos = [
    "https://via.placeholder.com/120x80",
    "https://via.placeholder.com/120x80",
    "https://via.placeholder.com/120x80",
  ];

  return (
    <ScreenView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Text className="text-lg font-semibold">Doctor Details</Text>
          <View className="flex-row items-center">
            <Link href="/" asChild>
              <Pressable className="mr-3">
                <Search size={24} color="#000" />
              </Pressable>
            </Link>
            <Pressable onPress={() => setIsFavorite(!isFavorite)}>
              <Heart
                size={24}
                color={isFavorite ? "#EF4444" : "#000"}
                fill={isFavorite ? "#EF4444" : "none"}
              />
            </Pressable>
          </View>
        </View>

        {/* Doctor Info */}
        <View className="px-6 mb-6">
          <View className="items-center mb-4">
            <View className="w-24 h-24 bg-gray-200 rounded-full mb-3" />
            <Text className="text-xl font-bold text-gray-900">
              Dr. Jenny Wilson
            </Text>
            <Text className="text-gray-500">Orthopedic Surgeon</Text>
            <View className="flex-row items-center mt-2">
              <MapPin size={14} color="#666" />
              <Text className="text-gray-600 text-sm ml-1">New York, USA</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            About
          </Text>
          <Text className="text-gray-600 leading-6">
            Dr. Jenny Wilson is a skilled orthopedic surgeon with over 15 years
            of experience in treating musculoskeletal conditions. She
            specializes in joint replacement, sports medicine, and trauma
            surgery.
          </Text>
        </View>

        {/* Working Hours */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Working Hours
          </Text>
          <View className="bg-gray-50 rounded-lg p-4">
            {workingHours.map((schedule, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center py-1"
              >
                <Text className="text-gray-700">{schedule.day}</Text>
                <Text
                  className={`${schedule.time === "Closed" ? "text-red-500" : "text-gray-600"}`}
                >
                  {schedule.time}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Services */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Services
          </Text>
          <Text className="text-gray-600">
            Joint Replacement, Sports Medicine, Trauma Surgery, Arthroscopy,
            Fracture Care
          </Text>
        </View>

        {/* Location */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Location
          </Text>
          <View className="bg-gray-100 rounded-lg h-32 items-center justify-center">
            <MapPin size={32} color="#666" />
            <Text className="text-gray-600 mt-2">Map View</Text>
          </View>
        </View>

        {/* Reviews */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-gray-900">Reviews</Text>
            <Link href="/" asChild>
              <Pressable>
                <Text className="text-blue-500">See All</Text>
              </Pressable>
            </Link>
          </View>

          {reviews.map((review) => (
            <View key={review.id} className="mb-4">
              <View className="flex-row items-center mb-2">
                <View className="w-10 h-10 bg-gray-200 rounded-full mr-3" />
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    {review.name}
                  </Text>
                  <Text className="text-gray-500 text-sm">{review.date}</Text>
                </View>
                <View className="flex-row">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      color={i < review.rating ? "#FFA500" : "#E5E7EB"}
                      fill={i < review.rating ? "#FFA500" : "none"}
                    />
                  ))}
                </View>
              </View>
              <Text className="text-gray-600 ml-13">{review.comment}</Text>
            </View>
          ))}
        </View>

        {/* Clinic Photos */}
        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Clinic Photos
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {clinicPhotos.map((photo, index) => (
              <Pressable key={index} className="mr-3">
                <View className="w-32 h-24 bg-gray-200 rounded-lg" />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-6 py-4 bg-white border-t border-gray-100">
        <Link href="/" asChild>
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
