import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import BottomSheetCard from "./BottomSheetCard";

// 1. Pegamos a altura da tela para fazer nossos cálculos
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// 2. Definimos a altura máxima que nosso BottomSheet pode ter.
// Aqui, 80% da tela.
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.53;

export default function BottomSheet() {
  // 3. Este shared value vai guardar a posição Y atual do nosso sheet.
  // O valor inicial é 0, que significa que ele está na sua posição inicial (minimizado).
  const translateY = useSharedValue(0);

  // 4. Este 'context' é importante. Ele guarda a posição do sheet
  // QUANDO o gesto de arrastar COMEÇA.
  const context = useSharedValue({ y: 0 });

  // 5. Criamos o gesto de Pan (arrastar).
  const gesture = Gesture.Pan()
    .onStart(() => {
      // Guardamos a posição inicial no contexto.
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      // Atualizamos a posição do sheet somando a posição inicial (contexto)
      // com o quanto o dedo se moveu (event.translationY).
      translateY.value = event.translationY + context.value.y;

      // Garantimos que o sheet não possa ser arrastado mais para cima que o nosso limite.
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd((event) => {
      // 6. Quando o usuário solta o dedo, decidimos para onde o sheet deve ir.
      // Se ele arrastou para baixo com força (velocityY > 500) OU
      // se arrastou para baixo além de um certo ponto...
      if (event.velocityY > 500 || translateY.value > MAX_TRANSLATE_Y / 4) {
        // ...mandamos ele de volta para a posição inicial (minimizado).
        translateY.value = withSpring(0, { damping: 50 });
      } else {
        // Senão, mandamos ele para a posição final (maximizado).
        translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
      }
    });

  // 7. Criamos o estilo animado. Ele vai aplicar a transformação 'translateY'.
  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // 8. (Bônus) Criamos um estilo para o fundo ficar escuro conforme o sheet sobe.
  const rBackdropStyle = useAnimatedStyle(() => {
    // interpolate vai mapear a posição do sheet (de 0 a MAX_TRANSLATE_Y)
    // para a opacidade do fundo (de 0 a 0.8).
    const opacity = interpolate(
      translateY.value,
      [0, MAX_TRANSLATE_Y],
      [0, 0.8]
    );
    return {
      opacity,
    };
  });

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <View style={styles.line} />
          <Text style={styles.title}>Lavanderias mais próximas</Text>
          <FlatList
            data={laundryData}
            renderItem={({ item }) => <LaundryCard item={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingTop: 0 }}
          />
          <BottomSheetCard />
        </Animated.View>
      </GestureDetector>
    </>
  );
}

// --- TIPAGEM (TYPESCRIPT) ---

type Laundry = {
  id: string;
  name: string;
  rating: number;
  maxRating: number;
  descriptionPart1: string;
  descriptionPart2: string; // Parte em negrito
  descriptionPart3: string;
  imageUrl: ImageSourcePropType;
  eta: string;
  arrivalTime: string;
};

// --- DADOS DE EXEMPLO (MOCK DATA) ---

const laundryData: Laundry[] = [
  {
    id: "1",
    name: "Lave-bem",
    rating: 4.5,
    maxRating: 5,
    descriptionPart1:
      "...Serviço rápido e eficiente para quem não tem tempo a perder. ",
    descriptionPart2: "Ideal para o dia a dia, ",
    descriptionPart3: "garantindo suas roupas limpas e passadas com agilidade.",
    imageUrl: {
      uri: "https://images.pexels.com/photos/8991475/pexels-photo-8991475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    eta: "15 Minutos",
    arrivalTime: "Chega às 13:01",
  },
  {
    id: "2",
    name: "Prima Clean",
    rating: 4.8, // Rating ligeiramente diferente
    maxRating: 5,
    descriptionPart1:
      "...Especialistas em lavagem a seco e cuidados com tecidos delicados. ",
    descriptionPart2: "Suas roupas de festa e peças finas ",
    descriptionPart3: "tratadas com a atenção e os produtos que elas merecem.",
    imageUrl: {
      uri: "https://images.pexels.com/photos/8991474/pexels-photo-8991474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    eta: "20 Minutos", // ETA diferente
    arrivalTime: "Chega às 13:06",
  },
  {
    id: "3",
    name: "Super Wash",
    rating: 4.2, // Rating ligeiramente diferente
    maxRating: 5,
    descriptionPart1: "...A solução perfeita para lavagem de grandes volumes. ",
    descriptionPart2: "Lavamos edredons, cobertores e tapetes, ",
    descriptionPart3:
      "deixando tudo limpo e cheiroso com nosso sistema industrial.",
    imageUrl: {
      uri: "https://images.pexels.com/photos/8991478/pexels-photo-8991478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    eta: "18 Minutos", // ETA diferente
    arrivalTime: "Chega às 13:04",
  },
];
// --- COMPONENTES ---

const StarRating: React.FC<{ rating: number; maxRating: number }> = ({
  rating,
  maxRating,
}) => {
  return (
    <View className="flex-row">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starNumber = index + 1;
        let iconName: "star-outline" | "star" | "star-half-sharp" =
          "star-outline";
        if (starNumber <= rating) {
          iconName = "star";
        } else if (starNumber - 0.5 <= rating) {
          iconName = "star-half-sharp";
        }
        return (
          <Ionicons key={index} name={iconName} size={16} color="#D1D5DB" />
        );
      })}
    </View>
  );
};

const LaundryCard: React.FC<{ item: Laundry }> = ({ item }) => (
  <View className="flex-row bg-white p-4 rounded-xl shadow-md mb-4 overflow-hidden">
    {/* Seção de Informações (Esquerda) */}
    <View className="flex-1 pr-4">
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-xs text-purple-600 font-semibold uppercase">
            Lavanderia express
          </Text>
          <Text className="text-xl font-bold text-gray-800 mt-1">
            {item.name}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center my-2">
        <Text className="text-sm font-bold text-gray-600 mr-2">
          {item.rating}
        </Text>
        <StarRating rating={item.rating} maxRating={item.maxRating} />
      </View>

      <View className="flex-row mt-2">
        <View className="w-0.5 bg-purple-200 mr-3" />
        <Text className="text-sm text-gray-500 flex-1 leading-5">
          {item.descriptionPart1}
          <Text className="font-bold">{item.descriptionPart2}</Text>
          {item.descriptionPart3}
        </Text>
      </View>
    </View>

    {/* Seção da Imagem (Direita) */}
    <View className="w-32 h-40 rounded-lg">
      <Image
        source={item.imageUrl}
        className="w-full h-full absolute rounded-lg"
      />
      <View className="absolute inset-0 bg-black/50 rounded-lg p-2 flex-col justify-center items-center">
        <Ionicons name="location-sharp" size={20} color="white" />
        <Text className="text-white text-[10px] text-center font-bold mt-2">
          0.7km de distância, Taboão da Serra-SP, 06784-000
        </Text>
        <View className="bg-white/90 rounded-md py-1 px-2 mt-2">
          <Text className="text-purple-900 text-[10px] font-bold">
            {item.eta}
          </Text>
          <Text className="text-purple-900 text-[10px]">
            {item.arrivalTime}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  mainText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  bottomSheetContainer: {
    height: SCREEN_HEIGHT, // Altura total da tela
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    // A mágica: translateY irá controlar a posição a partir do topo.
    // Começa em SCREEN_HEIGHT * 0.3, o que significa que 70% está para fora
    // da tela para baixo.
    top: SCREEN_HEIGHT * 0.62,
    borderRadius: 25,
    // Adicionamos uma sombra para dar um efeito de elevação
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4, // Sombra para cima
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 10,
    color: "#555",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject, // Ocupa a tela inteira
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: 1, // Fica entre o conteúdo principal e o sheet
  },
});
