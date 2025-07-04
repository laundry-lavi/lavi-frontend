import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Chat from "./chat/ChatRoute";
import Home from "./home/HomeRoute";
import Map from "./map/MapRoute";
import Profile from "./profile/ProfileRoute";

const Tab = createBottomTabNavigator();

export default function InitialRoute() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
