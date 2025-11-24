import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export const HomeIcon = (props: any) => (
  <FontAwesome name="home" size={24} {...props}></FontAwesome>
);

export const ExplorerIcon = (props: any) => (
  <Fontisto name="map-marker-alt" size={24} {...props} />
);

export const BotIcon = (props: any) => (
  <MaterialCommunityIcons name="robot" size={24} {...props} />
);

export const CalendarIcon = (props: any) => (
  <AntDesign name="calendar" size={24} {...props} />
);

export const FavoriteIcon = (props: any) => (
  <Fontisto name="favorite" size={24} {...props} />
);

export const FindIcon = (props: any) => (
  <Entypo name="magnifying-glass" size={24} {...props} />
);
export const ProfileIcon = (props: any) => (
  <FontAwesome6 name="user-circle" size={24} {...props} />
);
