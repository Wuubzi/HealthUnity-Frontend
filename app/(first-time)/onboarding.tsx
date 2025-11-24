import { useRouter } from "expo-router";
import { Dimensions, Image } from "react-native";
import Onboarding from "react-native-onboarding-swiper";

const { width, height } = Dimensions.get("window");

export default function OnBoarding() {
  const router = useRouter();
  return (
    <Onboarding
      bottomBarColor="#fff"
      pages={[
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("../../assets/images/first-onboarding-removebg-preview.png")}
              style={{
                width: width * 0.8,
                height: height * 0.4,
                resizeMode: "contain",
              }}
            />
          ),
          title: "Conoce Médicos de Confianza",
          subtitle:
            "Encuentra profesionales con experiencia listos para ayudarte en tu camino hacia una mejor salud.",
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("../../assets/images/second-onboarding-removebg-preview.png")}
              style={{
                width: width * 0.8,
                height: height * 0.4,
                resizeMode: "contain",
              }}
            />
          ),
          title: "Reserva Tus Citas en Segundos",
          subtitle:
            "Agenda fácilmente desde tu celular, sin llamadas ni filas, en cualquier momento y lugar.",
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("../../assets/images/doctors-search.png")}
              style={{
                width: width * 0.8,
                height: height * 0.4,
                resizeMode: "contain",
              }}
            />
          ),
          title: "Infórmate Sobre Tu Médico",
          subtitle:
            "Revisa perfiles, especialidades y opiniones antes de reservar tu próxima cita.",
        },
      ]}
      onSkip={() => {
        router.replace("/");
      }}
      onDone={() => {
        router.replace("/");
      }}
    />
  );
}
