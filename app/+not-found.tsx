import LottieView from "lottie-react-native";
import { View } from "react-native";
import not_found from "../assets/animations/not-found.json";

export default function NotFound() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <LottieView
        source={not_found}
        autoPlay
        loop={true}
        resizeMode="contain"
        style={{ flex: 1, width: "100%" }}
      />
    </View>
  );
}
