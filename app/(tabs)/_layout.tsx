import {
  BotIcon,
  CalendarIcon,
  FavoriteIcon,
  FindIcon,
  HomeIcon,
  ProfileIcon,
} from "@/components/Icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />

      <Tabs.Screen
        name="encontrar"
        options={{
          headerTitle: "",
          headerTransparent: true,
          title: "Encontrar",
          tabBarIcon: ({ color }) => <FindIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="asistente"
        options={{
          headerTitle: "",
          headerTransparent: true,
          title: "Asistente",
          tabBarIcon: ({ color }) => <BotIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          headerTitle: "",
          headerTransparent: true,
          title: "Citas",
          tabBarIcon: ({ color }) => <CalendarIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          headerTitle: "",
          headerTransparent: true,
          title: "Favoritos",
          tabBarIcon: ({ color }) => <FavoriteIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "",
          headerTransparent: true,
          title: "Perfil",
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
