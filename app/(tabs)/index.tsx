import ScreenView from "@/components/Screen";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import {
  Bell,
  Calendar,
  ChevronDown,
  Clock,
  Heart,
  Info,
  MapPin,
  Star,
  User,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isLogged = await SecureStore.getItemAsync("id_token");
      console.log("Token almacenado:", isLogged);
      if (!isLogged) {
         router.replace("/login");
        return;
      }

      const decoded: { exp: number } = jwtDecode(isLogged as string) as { exp: number };
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
         await SecureStore.deleteItemAsync("id_token");
         router.replace("/login");
      }
    };
    checkAuth();
  }, [router]);


  const [selectedTab, setSelectedTab] = useState("Home");

  const specialists = [
    {
      id: 1,
      name: "Dr. Anna Copper",
      specialty: "Orthopedic Surgeon",
      rating: 4.9,
      reviews: 5.0,
      image: "https://via.placeholder.com/80x80",
      available: true,
    },
    {
      id: 2,
      name: "Dr. Robert Fox",
      specialty: "Cardiologist",
      rating: 4.8,
      reviews: 4.9,
      image: "https://via.placeholder.com/80x80",
      available: true,
    },
    {
      id: 3,
      name: "Dr. Cody Fisher",
      specialty: "Neurologist",
      rating: 4.7,
      reviews: 4.8,
      image: "https://via.placeholder.com/80x80",
      available: true,
    },
  ];

  const specialties = [
    { name: "Dental", icon: "🦷" },
    { name: "Cardio", icon: "❤️" },
    { name: "Orthopedic", icon: "🦴" },
    { name: "Pediatric", icon: "👶" },
  ];

  const nearbyHospitals = [
    {
      id: 1,
      name: "Sunrise Health Clinic",
      address: "123 Oak Street, Downtown",
      distance: "2.5 km",
      image: "https://via.placeholder.com/120x80",
    },
    {
      id: 2,
      name: "Golden Care Medical Center",
      address: "456 Pine Avenue, Midtown",
      distance: "3.1 km",
      image: "https://via.placeholder.com/120x80",
    },
  ];

  return (
    <ScreenView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 bg-white">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <MapPin size={16} color="#3B82F6" />
              <Text className="ml-1 text-blue-600 font-medium">
                New York, USA
              </Text>
              <ChevronDown size={16} color="#3B82F6" className="ml-1" />
            </View>
            <Link href="/" asChild>
              <Pressable className="relative">
                <Bell size={24} color="#000" />
                <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </Pressable>
            </Link>
          </View>

          <Text className="text-2xl font-bold text-gray-900">
            Hi Handwerker 👋
          </Text>
        </View>

        {/* Upcoming Schedule */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center mb-3">
            <Text className="text-lg font-semibold text-gray-900">
              Upcoming Schedule
            </Text>
            <Info size={16} color="#3B82F6" className="ml-2" />
          </View>

          <View className="bg-blue-500 rounded-xl p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-3">
                  <User size={24} color="#3B82F6" />
                </View>
                <View>
                  <Text className="text-white font-semibold">
                    Dr. Anna Copper
                  </Text>
                  <Text className="text-blue-100 text-sm">
                    Orthopedic Surgeon
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <View className="flex-row items-center mb-1">
                  <Calendar size={14} color="white" />
                  <Text className="text-white text-sm ml-1">
                    Sunday, Jan 25
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Clock size={14} color="white" />
                  <Text className="text-white text-sm ml-1">
                    10:00 - 11:00 AM
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Doctor Specialty */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Doctor Specialty
          </Text>
          <View className="flex-row justify-between">
            {specialties.map((specialty, index) => (
              <Link key={index} href={`/`} asChild>
                <Pressable className="items-center">
                  <View className="w-16 h-16 bg-blue-50 rounded-2xl items-center justify-center mb-2">
                    <Text className="text-2xl">{specialty.icon}</Text>
                  </View>
                  <Text className="text-gray-700 text-sm">
                    {specialty.name}
                  </Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        {/* Nearby Hospital */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Nearby Hospital
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {nearbyHospitals.map((hospital) => (
              <Link key={hospital.id} href={`/`} asChild>
                <Pressable className="mr-4 w-64">
                  <View className="bg-gray-100 rounded-xl overflow-hidden">
                    <View className="h-20 bg-gray-200" />
                    <View className="p-3">
                      <Text className="font-semibold text-gray-900 mb-1">
                        {hospital.name}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {hospital.address}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            ))}
          </ScrollView>
        </View>

        {/* Top Specialists */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Top Specialists
          </Text>
          {specialists.map((specialist) => (
            <Link
              key={specialist.id}
              href={`/(doctors)/doctors-details`}
              asChild
            >
              <Pressable className="flex-row items-center bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
                <View className="w-16 h-16 bg-gray-200 rounded-full mr-4" />
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 mb-1">
                    {specialist.name}
                  </Text>
                  <Text className="text-gray-500 text-sm mb-2">
                    {specialist.specialty}
                  </Text>
                  <View className="flex-row items-center">
                    <Star size={14} color="#FFA500" fill="#FFA500" />
                    <Text className="text-sm text-gray-600 ml-1">
                      {specialist.rating} ({specialist.reviews} Reviews)
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Pressable className="mb-2">
                    <Heart size={20} color="#E5E7EB" />
                  </Pressable>
                  <Link href={`/(booking)/book-appoiment`} asChild>
                    <Pressable className="bg-blue-500 px-4 py-2 rounded-full">
                      <Text className="text-white text-sm font-medium">
                        Make Appointment
                      </Text>
                    </Pressable>
                  </Link>
                </View>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </ScreenView>
  );
}
