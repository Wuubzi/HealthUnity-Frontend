import LottieView from "lottie-react-native";
import { View } from "react-native";
import splash from "../assets/animations/splash.json";

export default function SplashScreen({ setIsAppReady }: any) {
  const handleAnimationFinished = () => {
    setIsAppReady(true);
  };
  return (
    <View className="flex-1 items-center justify-center bg-blue-600">
      <LottieView
        source={splash}
        autoPlay
        loop={false}
        speed={0.5}
        onAnimationFinish={handleAnimationFinished}
        resizeMode="contain"
        style={{
          flex: 1,
          width: "150%",
        }}
      />
    </View>
  );
}
