import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
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

// 1. Pegamos a altura da tela para fazer nossos cálculos
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// 2. Definimos a altura máxima que nosso BottomSheet pode ter.
// Aqui, 80% da tela.
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.74;

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
          <Text style={styles.title}>Sua Sidebar</Text>
          <Text style={styles.content}>Arraste para cima e para baixo!</Text>
          <Text style={styles.content}>
            Este conteúdo está dentro do Bottom Sheet.
          </Text>
        </Animated.View>
      </GestureDetector>
    </>
  );
}

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
    top: SCREEN_HEIGHT * 0.82,
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
