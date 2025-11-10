import * as ImagePicker from "react-native-image-picker";

const pickImage = async (setImage: () => {}) => {
  let result = await ImagePicker.launchImageLibrary({
    mediaType: "photo",
    quality: 1,
  });

  if (!result.canceled) {
    setImage(result?.assets[0]?.uri);
  }
};
