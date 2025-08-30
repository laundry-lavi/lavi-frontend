import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  FlatList,
} from "react-native";
import Text from "./MyText";
import Modal, { ModalProps } from "react-native-modal";
import Feather from "@expo/vector-icons/Feather";

interface ModalImageProps {
  source: ImageSourcePropType;
  sourceArr?: ImageSourcePropType[];
  resizeMode: "contain" | "cover" | "center";
}

export default function ModalImage({
  source,
  sourceArr,
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
          className="bg-black"
          data={sourceArr}
          keyExtractor={(item, i) => i.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            console.log(item);
            return (
              <Image
                source={item}
                className="w-screen h-screen"
                resizeMode={resizeMode}
              />
            );
          }}
        />

        {/* <Image
          source={source}
          className="w-screen h-screen"
          resizeMode={resizeMode}
        /> */}
      </Modal>
      <TouchableOpacity onPress={toggleModal}>
        <Image
          source={source}
          className="w-screen h-60"
          resizeMode={resizeMode}
        />
      </TouchableOpacity>
    </View>
  );
}
