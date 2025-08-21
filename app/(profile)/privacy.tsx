import ScreenView from "@/components/Screen";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function PrivacyScreen() {
  return (
    <ScreenView className="flex-1 bg-white">
      {/* Privacy Content */}
      <ScrollView className="flex-1 px-6 pt-4">
        <Text className="text-gray-900 text-base leading-6 mb-4">
          This Privacy Policy describes how we collect, use, and protect your
          personal information when you use our mobile application and services.
        </Text>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Information We Collect
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-3">
            We collect information you provide directly to us, such as when you
            create an account, make a booking, or contact us for support. This
            may include:
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            • Personal information (name, email, phone number)
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            • Profile information and preferences
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            • Payment information
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            • Communication records
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            How We Use Your Information
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-3">
            We use the information we collect to:
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            • Provide, maintain, and improve our services
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            • Process transactions and send related information
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            • Send you technical notices and support messages
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            • Respond to your comments and questions
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Information Sharing
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            We do not sell, trade, or otherwise transfer your personal
            information to third parties without your consent, except as
            described in this policy or as required by law.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Data Security
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Your Rights
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-3">
            You have the right to:
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            • Access your personal information
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            • Correct inaccurate information
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            • Request deletion of your information
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            • Object to processing of your information
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Contact Us
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            If you have any questions about this Privacy Policy, please contact
            us at privacy@example.com
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-gray-500 text-sm">
            This Privacy Policy was last updated on January 1, 2024.
          </Text>
        </View>
      </ScrollView>
    </ScreenView>
  );
}
