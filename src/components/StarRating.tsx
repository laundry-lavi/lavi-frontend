import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// --- INTERFACE ATUALIZADA ---
// Adicionamos a prop opcional 'onRatingChange'
interface StarRatingProps {
  rating: number;
  starSize?: number;
  color?: string;
  onRatingChange?: (rating: number) => void;
}

function StarRating({
  rating,
  starSize = 24,
  color = "#FFD700",
  onRatingChange, // Nova prop
}: StarRatingProps) {
  const stars = [];
  const totalStars = 5;

  for (let i = 1; i <= totalStars; i++) {
    // A lógica de qual ícone mostrar (cheio, meio, vazio) é usada para o estado ATUAL
    let starName: "star" | "star-half-sharp" | "star-outline" = "star-outline";
    if (i <= rating) {
      starName = "star";
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      // Meia estrela só faz sentido se o componente for apenas para exibição
      // Se for interativo, o usuário selecionará uma estrela inteira.
      starName = onRatingChange ? "star-outline" : "star-half-sharp";
    }

    // Se a função onRatingChange foi passada, cada estrela se torna um botão
    if (onRatingChange) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onRatingChange(i)} // Chama a função com a nota (número da estrela)
          activeOpacity={0.7}
        >
          {/* Para o input, mostramos apenas estrelas cheias ou vazias */}
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={starSize}
            color={color}
          />
        </TouchableOpacity>
      );
    } else {
      // Se não houver onRatingChange, funciona como antes (apenas exibição)
      stars.push(
        <Ionicons key={i} name={starName} size={starSize} color={color} />
      );
    }
  }

  return <View style={styles.container}>{stars}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4, // Adiciona um pequeno espaçamento entre as estrelas
  },
});

export default StarRating;
