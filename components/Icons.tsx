import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";

export const HomeIcon = (props: any) => (
  <FontAwesome name="home" size={24} {...props}></FontAwesome>
);

export const ExplorerIcon = (props: any) => (
  <Fontisto name="map-marker-alt" size={24} {...props} />
);

export const CalendarIcon = (props: any) => (
  <AntDesign name="calendar" size={24} {...props} />
);

export const FavoriteIcon = (props: any) => (
  <Fontisto name="favorite" size={24} {...props} />
);

export const ProfileIcon = (props: any) => (
  <FontAwesome6 name="user-circle" size={24} {...props} />
);
