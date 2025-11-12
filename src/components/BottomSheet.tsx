import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import Text from "./MyText";
import StarRating from "./StarRating";
import { NavigationProp, useNavigation } from "@react-navigation/native";

// --- TIPAGEM E PROPS ---

export type BottomSheetRef = {
  open: () => void;
};

interface BottomSheetProps {
  laundriesList: any[];
  selectedLaundryId: string | null;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.53;

// --- COMPONENTE PRINCIPAL ---

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ laundriesList, selectedLaundryId }, ref) => {
    const flatListRef = useRef<FlatList<any>>(null);
    const translateY = useSharedValue(0);
    const context = useSharedValue({ y: 0 });

    const openBottomSheet = () => {
      translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
    };

    useImperativeHandle(ref, () => ({
      open: openBottomSheet,
    }));

    useEffect(() => {
      if (!selectedLaundryId) return;
      const index = laundriesList.findIndex(
        (laundry) => laundry.id === selectedLaundryId
      );
      if (index !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }, [selectedLaundryId, laundriesList]);

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      })
      .onEnd((event) => {
        if (event.velocityY > 500 || translateY.value > MAX_TRANSLATE_Y / 4) {
          translateY.value = withSpring(0, { damping: 50 });
        } else {
          translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
        }
      });

    const rBottomSheetStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    return (
      <GestureDetector gesture={gesture}>
        {/*
          Estilos dinâmicos (como 'top' calculado) e estilos de animação
          permanecem na prop 'style'. Estilos estáticos vão para 'className'.
        */}
        <Animated.View
          style={[
            { top: SCREEN_HEIGHT * 0.62, height: SCREEN_HEIGHT },
            rBottomSheetStyle,
          ]}
          className="absolute w-full bg-white rounded-t-[25px] shadow-lg"
        >
          <View className="w-[75px] h-1 bg-gray-400 self-center my-4 rounded-full" />
          <Text className="text-2xl font-bold text-center mb-5">
            Lavanderias mais próximas
          </Text>
          <FlatList
            ref={flatListRef}
            data={laundriesList}
            renderItem={({ item }) => (
              <LaundryCard
                item={item}
                isSelected={item.id === selectedLaundryId}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingTop: 0 }}
          />
        </Animated.View>
      </GestureDetector>
    );
  }
);

export default BottomSheet;

// --- COMPONENTES FILHOS ---

function LaundryCard({ item, isSelected }: { item: any; isSelected: boolean }) {
  const navigation = useNavigation<NavigationProp<any>>();
  const makeRate = (grade: number[]) => {
    if (!grade || grade.length === 0) return "0 avaliações";
    const rate = grade.reduce((acc, g) => acc + g, 0) / grade.length;
    return rate.toFixed(1);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("LaundryRoute", { ...item });
      }}
    >
      <View
        className={`
        flex-row bg-white p-4 rounded-xl shadow-md mb-4 overflow-hidden
        ${isSelected && "border-2 border-purple-600 bg-purple-50"}
      `}
      >
        {/* Seção de Informações (Esquerda) */}
        <View className="flex-1 pr-4">
          <View className="flex-row justify-between items-start">
            <Text className="text-xl font-bold text-gray-800">{item.name}</Text>
          </View>

          <View className="flex-row items-center my-2">
            <Text className="text-sm font-bold text-gray-600 mr-2">
              {makeRate(item.grade)}
            </Text>
            <StarRating rating={Number(makeRate(item.grade))} />
          </View>

          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Seção da Imagem (Direita) */}

        <View className="w-32 h-auto rounded-lg bg-[#a391c2] p-2 flex justify-center items-center">
          <Ionicons name="location-sharp" size={20} color="white" />
          <Text className="text-white text-[11px] text-center font-bold mt-1">
            {item.distance ? `${item.distance.toFixed(1)}km` : "Calculando..."}
          </Text>
          <View className="bg-white/90 rounded-md py-1 px-2 mt-2">
            <Text className="text-indigo-900 text-[11px] font-bold">
              {item.duration || ""}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
