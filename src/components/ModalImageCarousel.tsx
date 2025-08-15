import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageSourcePropType,
} from "react-native";
import Modal, { ModalProps } from "react-native-modal";
import Feather from "@expo/vector-icons/Feather";

import Text from "./MyText";

interface ModalImageProps {
  source: ImageSourcePropType[];
  resizeMode: "contain" | "cover" | "center";
}

export default function ModalImageCarousel({
  source,
  resizeMode,
}: ModalImageProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View>
      <Modal
        isVisible={isModalVisible}
        coverScreen={true}
        animationIn="slideInDown"
        animationOut="slideInDown"
        backdropOpacity={0.5}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        style={{
          flex: 1,
          margin: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={toggleModal}
          className="absolute right-4 top-5 z-10 p-1 rounded-[50%] bg-gray-500"
        >
          <Feather name="x" size={32} color="white" />
        </TouchableOpacity>
        <FlatList
          className="w-screen"
          showsHorizontalScrollIndicator={false}
          data={source}
          renderItem={(img) => {
            return (
              <Image
                source={img.item}
                className="w-screen h-screen"
                resizeMode="contain"
              />
            );
          }}
          pagingEnabled
          horizontal={true}
        />
      </Modal>
      <View className="flex-row h-48 w-full">
        <TouchableOpacity
          className="w-1/2 h-full rounded-lg mr-2"
          onPress={toggleModal}
        >
          <Image
            source={source[0]}
            className="w-full h-full rounded-lg"
            resizeMode={resizeMode}
          />
        </TouchableOpacity>
        {source.length > 1 && (
          <View className="w-1/2 h-full flex-col">
            <TouchableOpacity
              className="h-[48%] w-full rounded-lg mb-2"
              onPress={toggleModal}
            >
              <Image
                source={source[1]}
                className="h-full w-full rounded-lg"
                resizeMode={resizeMode}
              />
            </TouchableOpacity>
            {source.length > 2 && (
              <View className="h-[48%] w-full relative">
                <TouchableOpacity
                  className="h-full w-full rounded-lg"
                  onPress={toggleModal}
                >
                  <Image
                    source={source[2]}
                    className="h-full w-full rounded-lg"
                    resizeMode={resizeMode}
                  />
                </TouchableOpacity>
                {source.length > 3 && (
                  <View className="absolute inset-0 bg-black/50 rounded-lg justify-center items-center">
                    <Text className="text-white text-2xl font-sansBold">
                      +{source.length - 2}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
