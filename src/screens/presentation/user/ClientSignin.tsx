import React, { SetStateAction, useEffect, useState, useContext } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";

import BouncyCheckbox from "react-native-bouncy-checkbox";
import MaskInput from "react-native-mask-input";

import { Text, BackArrow, PasswordInput } from "@/components";
import { UserSignin, UserFormData } from "@/types";
import {
  cepMask,
  birthDateMask,
  cnpjMask,
  cpfMask,
} from "@/constants/inputMasks";
import { checkingCep } from "@/functions";
import { CustomerContext } from "@/contexts";
import { API_URL } from "@/constants/backend";

const dropdownData = [
  { label: "Masculino", value: "1" },
  { label: "Feminino", value: "2" },
  { label: "Prefiro não dizer", value: "3" },
];

const dados = {
  name: "Arthur",
  lastName: "Rolemberg",
  email: "teste@gmail.com",
  doc: "79454368036",
  cep: "38413165",
  neighbourhood: "Planalto",
  city: "Uberlândia",
  address: "rua ya nasso",
  password: "12345678",
  gender: "Masculino",
  birthDate: "2007-05-02",
  isPj: false,
};

export default function ClientSignin() {
  const { setCustomerData } = useContext(CustomerContext);
  const navigation = useNavigation<NavigationProp<any>>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasEightChar, setHasEightChar] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    lastName: "",
    email: "",
    cep: "",
    city: "",
    neighbourhood: "",
    address: "",
    birthDate: "",
    gender: "",
    doc: "",
    isPj: false,
  });
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<"date" | "time">("date");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      birthDate: date.toLocaleString().slice(0, 10),
    }));
    setHasEightChar(false);
    if (password.length >= 8) setHasEightChar(true);
  }, [password, date]);

  const createCustomer = async ({
    name,
    email,
    isPj,
    doc,
    birthDate,
    gender,
    password,
    profileUrl,
    address,
  }: UserSignin) => {
    await fetch(
      `${API_URL}/customer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            profile_url: profileUrl,
            name: name,
            email: email,
            is_pj: isPj,
            doc: doc,
            birth_date: date.toISOString().slice(0, 10),
            gender: gender,
            password: password,
            address: address,
          },
        }),
      }
    )
      .then((response) => response.json())
      .then((body) => {
        if (body.details === "E-mail já cadastrado!") {
          Alert.alert("Erro!", "E-mail já cadastrado!");
          return;
        }
        if (body.details === "Identidade já existe.") {
          Alert.alert("Erro!", "CPF ou CNPJ já cadastrado!");
          return;
        }

        console.log(body);

        setCustomerData({
          name: formData.name,
          email: formData.email,
          cpf: formData.doc,
          birthDate: date.toISOString().slice(0, 10),
          address: `${formData.address}, ${formData.neighbourhood}, ${formData.city}, ${formData.cep}`,
          gender: formData.gender,
          isPj: formData.isPj,
          password: password,
          profileUrl: null,
          memberId: body.customer_id,
          role: "customer",
        });
        //navigation.navigate("ClientLogin");
        Alert.alert(
          "Sucesso!",
          "Formulário preenchido corretamente, agora faça login com o email e senha cadastrados."
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const isOldEnough = (birthDate: string): boolean => {
    if (!birthDate) return false;

    const [day, month, year] = birthDate.split("/").map(Number);
    const birthDateObj = new Date(year, month - 1, day);
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

    return birthDateObj <= eighteenYearsAgo;
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string | null } = {};

    // Validação de campos obrigatórios
    if (!formData.name.trim()) newErrors.name = "O nome é obrigatório.";
    if (!formData.lastName.trim())
      newErrors.lastName = "O sobrenome é obrigatório.";
    if (!formData.gender.trim()) newErrors.gender = "O gênero é obrigatório.";
    if (!formData.address.trim())
      newErrors.address = "O endereço é obrigatório.";
    if (!formData.email.trim() || !formData.email.includes("@"))
      newErrors.email = "O email é obrigatório.";
    if (!isOldEnough(formData.birthDate))
      newErrors.birthDate = "Você deve ter pelo menos 18 anos.";

    // Validação de CPF
    if (!formData.doc) {
      newErrors.doc = "O CPF/CNPJ é obrigatório.";
    }

    // Validação de CEP
    if (!formData.cep) {
      newErrors.cep = "O CEP é obrigatório.";
    }

    // Validação de senha
    if (password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres.";
    }

    // Validação de confirmação de senha
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem.";
    }

    setErrors(newErrors);

    // Retorna true se não houver erros
    return Object.keys(newErrors).length === 0;
  };

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (!selectedDate) return;
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode: SetStateAction<"date" | "time">) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const handleSubmit = () => {
    if (validateFields()) {
      const customer: UserSignin = {
        name: `${formData.name} ${formData.lastName}`,
        email: formData.email,
        password: password,
        birthDate: formData.birthDate,
        doc: formData.doc,
        gender: formData.gender,
        isPj: formData.isPj,
        profileUrl: null,
        address: `${formData.address}, ${formData.neighbourhood}, ${formData.city}, ${formData.cep}`,
      };
      createCustomer(customer);
    } else {
      Alert.alert("Erro", "Por favor, corrija os campos destacados.");
    }
  };

  return (
    <View>
      <ImageBackground
        className="w-full h-full"
        source={require("assets/bubble-bg4.png")}
      >
        {/* SETA PARA VOLTAR */}
        <BackArrow />

        {/* HEADER DA TELA */}
        <Image
          className="h-[140] self-center"
          source={require("assets/logo.png")}
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={() => {
            formData.address = dados.address;
            formData.birthDate = dados.birthDate;
            formData.cep = dados.cep;
            formData.city = dados.city;
            formData.doc = dados.doc;
            formData.email = dados.email;
            formData.gender = dados.gender;
            formData.isPj = dados.isPj;
            formData.lastName = dados.lastName;
            formData.name = dados.name;
            formData.neighbourhood = dados.neighbourhood;
            setPassword(dados.password);
            setConfirmPassword(dados.password);
          }}
        >
          <Text className="text-[#5b5265] text-3xl font-sansBold text-center">
            Bem vindo!
          </Text>
        </TouchableOpacity>

        {/* CONTAINER DO FORMS */}
        <ScrollView className="w-[95vw] h-[74vh] mx-auto my-3 p-4 pb-10 bg-white border rounded-xl border-[#d9d9d9]">
          {/* CAMPO DE NOME E SOBRENOME */}
          <View className="flex flex-row gap-2 mb-3">
            {/* CAMPO DE NOME */}
            <TextInput
              className={`w-[49%] p-4 pl-2 text-xl border rounded-xl ${
                errors.name ? "border-red-500" : "border-[#d9d9d9]"
              }`}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Nome"
              placeholderTextColor="#d9d9d9"
            />

            {/* CAMPO DE SOBRENOME */}
            <TextInput
              className={`w-[49%] p-4 pl-2 text-xl border rounded-xl ${
                errors.lastName ? "border-red-500" : "border-[#d9d9d9]"
              }`}
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData({ ...formData, lastName: text })
              }
              placeholder="Sobrenome"
              placeholderTextColor="#d9d9d9"
            />
          </View>
          <View className="flex flex-row gap-2">
            {errors.name && (
              <Text className="w-[50%] text-red-500 -mt-1 mb-2">
                {errors.name}
              </Text>
            )}
            {errors.lastName && (
              <Text className="w-[50%] text-red-500 -mt-1 mb-2">
                {errors.lastName}
              </Text>
            )}
          </View>

          {/* CAMPO DE EMAIL */}
          <View
            className={`flex flex-row items-center gap-2 p-1 pl-2 mb-2 border rounded-xl ${
              errors.email ? "border-red-500" : "border-[#d9d9d9]"
            }`}
          >
            <MaterialCommunityIcons
              name="mail"
              size={24}
              color={errors.email ? "red" : "#d9d9d9"}
            />
            <TextInput
              className="flex-1 text-xl"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Email"
              placeholderTextColor="#d9d9d9"
            />
          </View>
          {errors.lastName && (
            <Text className="text-red-500 -mt-1 mb-2">{errors.lastName}</Text>
          )}

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
            />
          )}

          {/* CAMPO DE CPF/CNPJ E GÊNERO */}
          <Text className="w-[50%] text-[#737373] font-sansBold">
            CPF ou CNPJ:
          </Text>
          <View className="flex flex-row gap-2 mb-2">
            {/* CAMPO DE CPF/CNPJ */}
            <MaskInput
              className={`w-[49%] p-4 pl-2 text-xl border rounded-xl ${
                errors.doc ? "border-red-500" : "border-[#d9d9d9]"
              }`}
              value={formData.doc}
              onChangeText={(text) => setFormData({ ...formData, doc: text })}
              placeholderTextColor="#d9d9d9"
              mask={formData.isPj ? cnpjMask : cpfMask}
            />

            {/* CAMPO DE GÊNERO */}
            <Dropdown
              style={[
                {
                  width: "49%",
                  padding: 16,
                  paddingLeft: 8,
                  borderWidth: 1,
                  borderRadius: 12,
                  borderColor: errors.gender ? "red" : "#d9d9d9",
                },
                isFocus && { borderColor: "#822083" },
              ]}
              data={dropdownData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Seu gênero" : "..."}
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setFormData((prevData) => ({
                  ...prevData,
                  gender: item.label,
                }));
                setValue(item.value);
                setIsFocus(false);
              }}
            />
          </View>
          <View className="flex flex-row gap-2">
            {errors.doc && (
              <Text className="w-[50%] text-red-500 -mt-1 mb-2">
                {errors.doc}
              </Text>
            )}
            {errors.gender && (
              <Text className="w-[50%] text-red-500 -mt-1 mb-2">
                {errors.gender}
              </Text>
            )}
          </View>
          <BouncyCheckbox
            useBuiltInState={false}
            isChecked={formData.isPj}
            size={16}
            textComponent={
              <Text className="text-sm ml-2">Sou PJ (Pessoa Jurídica)</Text>
            }
            fillColor="purple"
            bounceEffectIn={0.95}
            onPress={(checked: boolean) => {
              setFormData((prevData) => ({
                ...prevData,
                isPj: !prevData.isPj,
              }));
            }}
            className="mb-3"
          />

          <View className="flex flex-row gap-2">
            <Text className="w-[50%] text-[#737373] font-sansBold">
              Data de nascimento:
            </Text>
            <Text className="w-[50%] text-[#737373] font-sansBold">
              Insira o seu CEP:
            </Text>
          </View>
          {/* CAMPO DE CEP E ANIVERSÁRIO */}
          <View className="flex flex-row gap-2 mb-2">
            {/* CAMPO DE ANIVERSÁRIO */}
            <TouchableOpacity
              onPress={showDatepicker}
              className={`w-[49%] justify-center border rounded-xl ${errors.birthDate ? "border-red-500" : "border-[#d9d9d9]"}`}
            >
              <MaskInput
                className="p-4 pl-2 text-xl"
                value={formData.birthDate}
                onChangeText={(text) =>
                  setFormData({ ...formData, birthDate: text })
                }
                placeholder="Data de nascimento"
                placeholderTextColor="#d9d9d9"
                editable={false}
                mask={birthDateMask}
              />
            </TouchableOpacity>
            <MaskInput
              className={`w-[49%] justify-center border rounded-xl ${
                errors.cep ? "border-red-500" : "border-[#d9d9d9]"
              } p-4 pl-2 text-xl`}
              value={formData.cep}
              onChangeText={(text) => {
                checkingCep(setFormData, text);
                setFormData({ ...formData, cep: text });
              }}
              placeholderTextColor="#d9d9d9"
              mask={cepMask}
            />
          </View>
          <View className="flex flex-row gap-2">
            {errors.birthDate && (
              <Text className="w-[49%] text-red-500 -mt-1 mb-2">
                {errors.birthDate}
              </Text>
            )}
            {errors.cep && (
              <Text className="w-[50%] text-red-500 -mt-1 mb-2">
                {errors.cep}
              </Text>
            )}
          </View>

          {/* CAMPOS DE MUNICIPIO E CIDADE */}
          <View className="flex flex-row gap-2 mb-3">
            {/* CAMPO DE MUNICÍPIO */}
            {/* TODO: adicionar api de localização?? */}
            <TextInput
              className="w-[49%] p-4 pl-2 text-xl border rounded-xl border-[#d9d9d9]"
              value={formData.neighbourhood}
              onChangeText={(text) =>
                setFormData({ ...formData, neighbourhood: text })
              }
              placeholder="Município"
              placeholderTextColor="#d9d9d9"
            />

            {/* CAMPO DE CIDADE */}
            {/* TODO: adicionar api de localização?? */}
            <TextInput
              className="w-[49%] p-4 pl-2 text-xl border rounded-xl border-[#d9d9d9]"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              placeholder="Cidade"
              placeholderTextColor="#d9d9d9"
            />
          </View>

          {/* CAMPO DE ENDEREÇO */}
          <View
            className={`flex flex-row items-center gap-2 p-1 pl-2 mb-2 border rounded-xl ${
              errors.address ? "border-red-500" : "border-[#d9d9d9]"
            }`}
          >
            <FontAwesome6
              name="location-dot"
              size={24}
              color={errors.address ? "red" : "#d9d9d9"}
            />
            <TextInput
              className="flex-1 text-xl"
              value={formData.address}
              onChangeText={(text) =>
                setFormData({ ...formData, address: text })
              }
              placeholder="Endereço (rua, número)"
              placeholderTextColor="#d9d9d9"
            />
          </View>

          {/* CAMPO DE SENHA */}
          <Text className="text-[#737373] font-sansBold">Defina sua senha</Text>
          <PasswordInput
            style={`flex flex-row items-center gap-2 p-2 mb-1 border rounded-xl ${
              errors.password ? "border-red-500" : "border-[#d9d9d9]"
            }`}
            password={password}
            setPassword={setPassword}
          />
          <BouncyCheckbox
            useBuiltInState={false}
            isChecked={hasEightChar}
            size={16}
            textComponent={
              <Text className="text-sm ml-2">Possui 8 carateres</Text>
            }
            fillColor="purple"
            bounceEffectIn={1}
            className="mb-2"
          />

          {/* CAMPO DE CONFIRMAÇÃO DE SENHA */}
          <Text className="text-[#737373] font-sansBold">
            Confirme sua senha
          </Text>
          <PasswordInput
            style={`flex flex-row items-center gap-2 p-2 mb-1 border rounded-xl ${
              errors.confirmPassword ? "border-red-500" : "border-[#d9d9d9]"
            }`}
            password={confirmPassword}
            setPassword={setConfirmPassword}
          />
          {errors.confirmPassword && (
            <Text className="w-[50%] text-red-500 -mt-1 mb-2">
              {errors.confirmPassword}
            </Text>
          )}
          <BouncyCheckbox
            useBuiltInState={false}
            isChecked={agreeTerms}
            size={16}
            textComponent={
              <Text className="text-sm ml-2">
                Li e concordo com os
                <Text className="font-sansBold"> termos e condições</Text>
              </Text>
            }
            fillColor="purple"
            bounceEffectIn={0.95}
            onPress={(checked: boolean) => {
              setAgreeTerms(!agreeTerms);
            }}
            className="mb-3"
          />

          {/* BOTÃO DE CONFIRMAÇÃO DO FORMS */}
          <TouchableOpacity
            className="w-full py-3 items-center border-2 border-black rounded-lg"
            onPress={handleSubmit}
          >
            <Text className="text-black text-lg font-sansBold">
              Cadastrar-se
            </Text>
          </TouchableOpacity>

          {/* TEXTO PARA LEVAR AO LOGIN DE CLIENTE */}
          <View className="flex flex-row items-center justify-center mb-6">
            <Text className="text-[#545454]">Já tem uma conta ? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("ClientLogin")}
            >
              <Text className="text-[#822083] font-sansBold underline">
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
