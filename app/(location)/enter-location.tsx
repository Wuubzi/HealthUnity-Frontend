import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import { MapPin, Navigation, Search } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

export default function EnterLocation() {
  const [searchText, setSearchText] = useState("");
  const [suggestions] = useState([
    {
      id: 1,
      name: "Golden Avenue",
      address: "8502 Preston Rd. Inglewood, Maine 98380",
      icon: "location",
    },
  ]);

  return (
    <ScreenView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Search Input */}
        <View className="px-6 py-4">
          <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3">
            <Search size={20} color="#666" className="mr-3" />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Golden Avenue"
              className="flex-1 text-gray-700"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Current Location Button */}
        <View className="px-6 mb-4">
          <Link href="/" asChild>
            <Pressable className="flex-row items-center bg-blue-50 rounded-lg px-4 py-4">
              <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3">
                <Navigation size={16} color="white" />
              </View>
              <Text className="text-blue-600 font-medium">
                Use my current location
              </Text>
            </Pressable>
          </Link>
        </View>

        {/* Location Suggestions */}
        <ScrollView className="flex-1 px-6">
          {suggestions.map((suggestion) => (
            <Link key={suggestion.id} href={`/`} asChild>
              <Pressable className="flex-row items-start py-4 border-b border-gray-100">
                <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center mr-3 mt-1">
                  <MapPin size={16} color="#EF4444" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium mb-1">
                    {suggestion.name}
                  </Text>
                  <Text className="text-gray-500 text-sm leading-5">
                    {suggestion.address}
                  </Text>
                </View>
              </Pressable>
            </Link>
          ))}
        </ScrollView>
      </View>
    </ScreenView>
  );
}
