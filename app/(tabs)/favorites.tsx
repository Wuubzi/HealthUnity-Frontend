import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import { Heart, MapPin, Search, Shield, Star } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

export default function Favorites() {
  const [activeTab, setActiveTab] = useState("Doctors");
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  type Doctor = (typeof favoriteDoctors)[number];
  type Hospital = (typeof favoriteHospitals)[number];
  const [selectedItem, setSelectedItem] = useState<Doctor | Hospital | null>(
    null
  );

  const favoriteDoctors = [
    {
      id: 1,
      name: "Dr. Jane Cooper",
      specialty: "Orthopedic Surgeon",
      rating: 4.9,
      reviews: 49,
      image: "https://via.placeholder.com/60x60",
      badge: "Professional Doctor",
    },
    {
      id: 2,
      name: "Dr. Guy Hawkins",
      specialty: "Dentist",
      rating: 4.8,
      reviews: 49,
      image: "https://via.placeholder.com/60x60",
      badge: "Professional Doctor",
    },
    {
      id: 3,
      name: "Dr. Jacob Jones",
      specialty: "Dentist",
      rating: 4.8,
      reviews: 49,
      image: "https://via.placeholder.com/60x60",
      badge: "Professional Doctor",
    },
  ];

  const favoriteHospitals = [
    {
      id: 1,
      name: "Serenity Wellness Clinic",
      location: "Seattle, Washington",
      address: "8502 Preston Rd. Inglewood, Maine 98380",
      rating: 4.8,
      reviews: 184,
      image: "https://via.placeholder.com/120x80",
      distance: "2.5 km",
    },
    {
      id: 2,
      name: "Radiant Health Family Clinic",
      location: "Seattle, Washington",
      address: "8502 Preston Rd. Inglewood, Maine 98380",
      rating: 4.8,
      reviews: 184,
      image: "https://via.placeholder.com/120x80",
      distance: "1.8 km",
    },
  ];

  const handleRemoveFavorite = (item: any) => {
    setSelectedItem(item);
    setShowRemoveModal(true);
  };

  const confirmRemove = () => {
    // Aquí iría la lógica para remover el item
    setShowRemoveModal(false);
    setSelectedItem(null);
  };

  return (
    <ScreenView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Text className="text-lg font-semibold">Favourites</Text>
        <Link href="/" asChild>
          <Pressable>
            <Search size={24} color="#000" />
          </Pressable>
        </Link>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row mx-6 mb-6">
        <Pressable
          onPress={() => setActiveTab("Doctors")}
          className={`flex-1 py-3 ${
            activeTab === "Doctors" ? "border-b-2 border-blue-500" : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "Doctors" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Doctors
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("Hospitals")}
          className={`flex-1 py-3 ${
            activeTab === "Hospitals" ? "border-b-2 border-blue-500" : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "Hospitals" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Hospitals
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6">
        {activeTab === "Doctors" ? (
          // Doctors List
          <View>
            {favoriteDoctors.map((doctor) => (
              <View
                key={doctor.id}
                className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
              >
                <View className="flex-row items-start">
                  <View className="w-16 h-16 bg-gray-200 rounded-full mr-4" />
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Shield size={14} color="#3B82F6" />
                      <Text className="text-blue-500 text-xs ml-1">
                        {doctor.badge}
                      </Text>
                    </View>
                    <Text className="font-semibold text-gray-900 mb-1">
                      {doctor.name}
                    </Text>
                    <Text className="text-gray-500 text-sm mb-2">
                      {doctor.specialty}
                    </Text>
                    <View className="flex-row items-center">
                      <Star size={14} color="#FFA500" fill="#FFA500" />
                      <Text className="text-sm text-gray-600 ml-1">
                        {doctor.rating} ({doctor.reviews} Reviews)
                      </Text>
                    </View>
                  </View>
                  <Pressable onPress={() => handleRemoveFavorite(doctor)}>
                    <Heart size={20} color="#EF4444" fill="#EF4444" />
                  </Pressable>
                </View>
                <Link href={`/`} asChild>
                  <Pressable className="bg-blue-500 py-3 rounded-full mt-4">
                    <Text className="text-white text-center font-medium">
                      Make Appointment
                    </Text>
                  </Pressable>
                </Link>
              </View>
            ))}
          </View>
        ) : (
          // Hospitals List
          <View>
            {favoriteHospitals.map((hospital) => (
              <View
                key={hospital.id}
                className="bg-white rounded-xl overflow-hidden mb-4 shadow-sm border border-gray-100"
              >
                <View className="relative">
                  <View className="h-32 bg-gray-200" />
                  <Pressable
                    onPress={() => handleRemoveFavorite(hospital)}
                    className="absolute top-3 right-3 bg-white rounded-full p-2"
                  >
                    <Heart size={16} color="#EF4444" fill="#EF4444" />
                  </Pressable>
                </View>
                <View className="p-4">
                  <Text className="font-semibold text-gray-900 mb-1">
                    {hospital.name}
                  </Text>
                  <Text className="text-gray-500 text-sm mb-2">
                    {hospital.location}
                  </Text>
                  <View className="flex-row items-center mb-2">
                    <MapPin size={14} color="#666" />
                    <Text className="text-gray-600 text-sm ml-1 flex-1">
                      {hospital.address}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Star size={14} color="#FFA500" fill="#FFA500" />
                      <Text className="text-sm text-gray-600 ml-1">
                        {hospital.rating} ({hospital.reviews} Reviews)
                      </Text>
                    </View>
                    <Text className="text-blue-500 text-sm font-medium">
                      {hospital.distance}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Remove Confirmation Modal */}
      <Modal
        visible={showRemoveModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRemoveModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-gray-200 rounded-full mb-4" />
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                Remove from Favourite?
              </Text>
              <Text className="text-gray-500 text-center">
                {selectedItem?.name}
              </Text>
            </View>

            <View className="flex-row space-x-3">
              <Pressable
                onPress={() => setShowRemoveModal(false)}
                className="flex-1 bg-gray-100 py-3 rounded-full"
              >
                <Text className="text-gray-700 text-center font-medium">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={confirmRemove}
                className="flex-1 bg-blue-500 py-3 rounded-full"
              >
                <Text className="text-white text-center font-medium">
                  Yes, Remove
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenView>
  );
}
