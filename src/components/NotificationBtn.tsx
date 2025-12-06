import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, Appearance } from "react-native";
import Modal, { ModalProps } from "react-native-modal";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";

import Text from "./MyText";

export default function NotificationBtn({ color }: { color?: string }) {
  const theme = Appearance.getColorScheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <>
      <Modal
        isVisible={isModalVisible}
        coverScreen={false}
        animationIn="slideInRight"
        animationOut="slideInRight"
        backdropOpacity={0.5}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        style={{
          margin: 0,
          justifyContent: "flex-start",
          alignItems: "flex-end",
        }}
      >
        <View className="w-[85%] h-screen bg-[#f2f2f2]">
          <View className="flex flex-row justify-between p-5 bg-white">
            <View className="flex flex-row gap-3">
              <MaterialCommunityIcons
                className="opacity-75"
                name="bell"
                size={32}
                color="#080030"
              />
              <View>
                <Text>Notificações</Text>
                <Text>Fique de olho nas atualizações</Text>
              </View>
            </View>
            <TouchableOpacity onPress={toggleModal}>
              <Feather
                className="opacity-75"
                name="x"
                size={32}
                color="#4c4669"
              />
            </TouchableOpacity>
          </View>
          <ScrollView className="p-4">
            {/* TODO: Criar o componente de card de notificação */}
            <Text>MODAL TESTANDO</Text>
          </ScrollView>
        </View>
      </Modal>
      <TouchableOpacity onPress={toggleModal}>
        <MaterialCommunityIcons
          name="bell"
          size={32}
          color={theme === "dark" ? "white" : color || "black"}
        />
      </TouchableOpacity>
    </>
  );
}
