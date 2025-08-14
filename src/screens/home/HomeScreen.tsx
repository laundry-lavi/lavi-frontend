import {
  View,
  ScrollView,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";

import { Text, Header, SmallLaundryCard } from "@/components";

import { laundrys } from "@/types";

type Lavanderia = {
  id: number;
  nome: string;
  rating: number;
  categoria: string;
  tempo?: string; // Opcional
  chegada?: string; // Opcional
  imagem: ImageSourcePropType;
  promocao: boolean;
};

type Colaborador = {
  id: number;
  name: string;
  img: ImageSourcePropType;
};

type FilterButtonProps = {
  text: string;
  isSelected: boolean;
  hasIcon?: boolean; // Opcional
};

type LavanderiaCardProps = {
  item: Lavanderia;
};

type ColaboradorAvatarProps = {
  item: Colaborador;
};

const colaboradores: Colaborador[] = [
  { id: 1, name: "Lava", img: require("assets/img1.png") },
  { id: 2, name: "Anda", img: require("assets/img2.png") },
  { id: 3, name: "Lavand", img: require("assets/img3.png") },
  {
    id: 4,
    name: "Lava Fun",
    img: require("assets/img4.png"),
  },
  { id: 5, name: "Super", img: require("assets/img5.png") },
];

const ColaboradorAvatar = ({ item }: { item: Colaborador }) => (
  <View className="items-center mr-4">
    <Image
      source={item.img}
      className="w-20 h-20 rounded-full border-2 border-gray-200"
    />
    {/* <View className="w-20 h-20 bg-amber-500 rounded-full border-2 border-gray-200"></View> */}
    <Text className="mt-2 text-sm text-gray-700">{item.name}</Text>
  </View>
);

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View>
      <Header />
      <View className="p-4">
        <Image
          className="h-[28vh] w-full rounded-xl mb-3"
          source={require("assets/promo.png")}
          resizeMode="cover"
        />
        <Text className="text-lg text-[#210030] font-sansBold">
          Lavanderias em alta
        </Text>
        <FlatList
          className="w-screen -ml-2 mb-4"
          showsHorizontalScrollIndicator={false}
          data={laundrys}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate("LaundryRoute")}
              >
                <SmallLaundryCard item={item} />
              </TouchableOpacity>
            );
          }}
          horizontal={true}
          keyExtractor={(item) => item.id.toString()}
        />

        <Text className="text-lg text-[#210030] font-sansBold">
          Colaboradores
        </Text>
        <FlatList
          className="w-screen -ml-2 mb-4"
          showsHorizontalScrollIndicator={false}
          data={colaboradores}
          renderItem={ColaboradorAvatar}
          horizontal={true}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
}

// const FilterButton = ({ text, isSelected, hasIcon }) => (
//   <TouchableOpacity
//     className={`py-2 px-4 rounded-lg border border-gray-200 ${
//       isSelected ? "bg-purple-100 border-purple-500" : "bg-white"
//     }`}
//   >
//     <View className="flex-row items-center">
//       {hasIcon && (
//         <Icon
//           name="checkmark"
//           size={16}
//           color={isSelected ? "#8B5CF6" : "#6B7280"}
//         />
//       )}
//       <Text
//         className={`ml-2 ${isSelected ? "text-purple-600 font-bold" : "text-gray-600"}`}
//       >
//         {text}
//       </Text>
//     </View>
//   </TouchableOpacity>
// );
