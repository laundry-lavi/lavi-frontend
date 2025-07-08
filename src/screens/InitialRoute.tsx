import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Chat from "./chat/ChatRoute";
import Home from "./home/HomeRoute";
import Map from "./map/MapRoute";
import Profile from "./profile/ProfileRoute";

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default function InitialRoute() {
  return (
    <Tab.Navigator
      initialRouteName="HomeRoute"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="HomeRoute"
        component={Home}
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MapRoute"
        component={Map}
        options={{
          title: "Map",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome name="map-marker" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ChatRoute"
        component={Chat}
        options={{
          title: "Chat",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileRoute"
        component={Profile}
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
