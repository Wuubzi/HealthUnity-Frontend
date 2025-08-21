import ScreenView from "@/components/Screen";
import { Link } from "expo-router";
import { ArrowLeft, MapPin, Search } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function Booking() {
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "completed" | "cancelled"
  >("upcoming");

  const upcomingBookings = [
    {
      id: 1,
      date: "Aug 25, 2023",
      time: "10:00 AM",
      doctor: {
        name: "Dr. Jenny Wilson",
        specialty: "Orthopedic Surgeon",
        image: "https://via.placeholder.com/60x60",
      },
      status: "upcoming",
      isConfirmed: false,
    },
    {
      id: 2,
      date: "Aug 25, 2023",
      time: "10:00 AM",
      doctor: {
        name: "Dr. Guy Hawkins",
        specialty: "Orthopedic Surgeon",
        image: "https://via.placeholder.com/60x60",
      },
      status: "upcoming",
      isConfirmed: false,
    },
    {
      id: 3,
      date: "Aug 25, 2023",
      time: "10:00 AM",
      doctor: {
        name: "Dr. Jenny Wilson",
        specialty: "Orthopedic Surgeon",
        image: "https://via.placeholder.com/60x60",
      },
      status: "upcoming",
      isConfirmed: false,
    },
  ];

  const completedBookings = [
    {
      id: 4,
      date: "Aug 25, 2023",
      time: "10:00 AM",
      doctor: {
        name: "Dr. Jenny Wilson",
        specialty: "Orthopedic Surgeon",
        image: "https://via.placeholder.com/60x60",
      },
      status: "completed",
      isConfirmed: true,
    },
    {
      id: 5,
      date: "Aug 25, 2023",
      time: "10:00 AM",
      doctor: {
        name: "Dr. Guy Hawkins",
        specialty: "Orthopedic Surgeon",
        image: "https://via.placeholder.com/60x60",
      },
      status: "completed",
      isConfirmed: true,
    },
    {
      id: 6,
      date: "Aug 25, 2023",
      time: "10:00 AM",
      doctor: {
        name: "Dr. Jenny Wilson",
        specialty: "Orthopedic Surgeon",
        image: "https://via.placeholder.com/60x60",
      },
      status: "completed",
      isConfirmed: true,
    },
  ];

  const cancelledBookings = [
    {
      id: 7,
      date: "Aug 25, 2023",
      time: "10:00 AM",
      doctor: {
        name: "Dr. Jenny Wilson",
        specialty: "Orthopedic Surgeon",
        image: "https://via.placeholder.com/60x60",
      },
      status: "cancelled",
      isConfirmed: false,
    },
    {
      id: 8,
      date: "Aug 25, 2023",
      time: "10:00 AM",
      doctor: {
        name: "Dr. Guy Hawkins",
        specialty: "Orthopedic Surgeon",
        image: "https://via.placeholder.com/60x60",
      },
      status: "cancelled",
      isConfirmed: false,
    },
    {
      id: 9,
      date: "Aug 25, 2023",
      time: "10:00 AM",
      doctor: {
        name: "Dr. Jenny Wilson",
        specialty: "Orthopedic Surgeon",
        image: "https://via.placeholder.com/60x60",
      },
      status: "cancelled",
      isConfirmed: false,
    },
  ];

  const getBookingsByTab = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingBookings;
      case "completed":
        return completedBookings;
      case "cancelled":
        return cancelledBookings;
      default:
        return upcomingBookings;
    }
  };

  const getStatusColor = (status: string, isConfirmed: boolean) => {
    switch (status) {
      case "upcoming":
        return isConfirmed
          ? "bg-green-100 text-green-800"
          : "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string, isConfirmed: boolean) => {
    switch (status) {
      case "upcoming":
        return isConfirmed ? "Confirmed" : "Pending";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const renderActionButtons = (status: string) => {
    if (status === "upcoming") {
      return (
        <View className="flex-row space-x-2 mt-4">
          <Pressable className="flex-1 bg-gray-100 py-3 px-4 rounded-lg">
            <Text className="text-gray-700 text-center font-medium">
              Cancel
            </Text>
          </Pressable>
          <Pressable className="flex-1 bg-blue-500 py-3 px-4 rounded-lg">
            <Text className="text-white text-center font-medium">
              Reschedule
            </Text>
          </Pressable>
        </View>
      );
    } else if (status === "completed") {
      return (
        <View className="flex-row space-x-2 mt-4">
          <Pressable className="flex-1 bg-gray-100 py-3 px-4 rounded-lg">
            <Text className="text-gray-700 text-center font-medium">
              Re-Book
            </Text>
          </Pressable>
          <Pressable className="flex-1 bg-blue-500 py-3 px-4 rounded-lg">
            <Text className="text-white text-center font-medium">
              Add Review
            </Text>
          </Pressable>
        </View>
      );
    } else {
      return (
        <View className="flex-row space-x-2 mt-4">
          <Pressable className="flex-1 bg-gray-100 py-3 px-4 rounded-lg">
            <Text className="text-gray-700 text-center font-medium">
              Re-Book
            </Text>
          </Pressable>
          <Pressable className="flex-1 bg-blue-500 py-3 px-4 rounded-lg">
            <Text className="text-white text-center font-medium">
              Add Review
            </Text>
          </Pressable>
        </View>
      );
    }
  };

  return (
    <ScreenView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white">
        <Link href="/" asChild>
          <Pressable>
            <ArrowLeft size={24} color="#000" />
          </Pressable>
        </Link>
        <Text className="text-lg font-semibold">My Bookings</Text>
        <Link href="/" asChild>
          <Pressable>
            <Search size={24} color="#000" />
          </Pressable>
        </Link>
      </View>

      {/* Tabs */}
      <View className="flex-row px-6 py-4 bg-white border-b border-gray-100">
        <Pressable
          onPress={() => setActiveTab("upcoming")}
          className={`flex-1 py-2 ${activeTab === "upcoming" ? "border-b-2 border-blue-500" : ""}`}
        >
          <Text
            className={`text-center font-medium ${activeTab === "upcoming" ? "text-blue-500" : "text-gray-500"}`}
          >
            Upcoming
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("completed")}
          className={`flex-1 py-2 ${activeTab === "completed" ? "border-b-2 border-blue-500" : ""}`}
        >
          <Text
            className={`text-center font-medium ${activeTab === "completed" ? "text-blue-500" : "text-gray-500"}`}
          >
            Completed
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("cancelled")}
          className={`flex-1 py-2 ${activeTab === "cancelled" ? "border-b-2 border-blue-500" : ""}`}
        >
          <Text
            className={`text-center font-medium ${activeTab === "cancelled" ? "text-blue-500" : "text-gray-500"}`}
          >
            Cancelled
          </Text>
        </Pressable>
      </View>

      {/* Booking List */}
      <ScrollView className="flex-1 px-6 pt-4">
        {getBookingsByTab().map((booking) => (
          <View
            key={booking.id}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm"
          >
            {/* Date and Status */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                <Text className="text-gray-600 font-medium">
                  {booking.date} • {booking.time}
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${getStatusColor(booking.status, booking.isConfirmed)}`}
              >
                <Text className="text-xs font-medium">
                  {getStatusText(booking.status, booking.isConfirmed)}
                </Text>
              </View>
            </View>

            {/* Doctor Info */}
            <View className="flex-row items-center mb-4">
              <View className="w-14 h-14 bg-gray-200 rounded-full mr-3" />
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  {booking.doctor.name}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {booking.doctor.specialty}
                </Text>
                <View className="flex-row items-center mt-1">
                  <MapPin size={12} color="#666" />
                  <Text className="text-gray-500 text-xs ml-1">
                    Golden Gate Hospital
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            {renderActionButtons(booking.status)}
          </View>
        ))}
      </ScrollView>
    </ScreenView>
  );
}
