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
import React, { useEffect, useState } from "react";
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

interface Customer {
  birthDate: string;
  doc: string;
  email: string;
  gender: string;
  isPj: boolean;
  name: string;
  password: string;
  profileUrl: string | null;
}

const data = [
  { label: "Masculino", value: "1" },
  { label: "Feminino", value: "2" },
  { label: "Prefiro não dizer", value: "3" },
];

const dados = {
  name: "Arthur",
  lastName: "Rolemberg",
  email: "teste@gmail.com",
  cpf: "79454368036",
  cep: "38413165",
  bairro: "Planalto",
  cidade: "Uberlândia",
  endereco: "rua ya nasso",
  senha: "12345678",
};

export default function ClientSignin() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasEightChar, setHasEightChar] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [doc, setDoc] = useState("");
  const [isPj, setIsPj] = useState(false);
  const cpfMask = [
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ];
  const cnpjMask = [
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    "/",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ];
  const cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/];
  const birthDateMask = [
    /\d/,
    /\d/,
    "/",
    /\d/,
    /\d/,
    "/",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];

  useEffect(() => {
    setBirthDate(date.toLocaleString());
    setHasEightChar(false);
    if (password.length >= 8) setHasEightChar(true);
  }, [password]);

  const createCustomer = async ({
    name,
    email,
    isPj,
    doc,
    birthDate,
    gender,
    password,
    profileUrl,
  }: Customer) => {
    await fetch("http://52.67.221.152/customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: {
          profile_url: profileUrl,
          name: dados.name + " " + dados.lastName,
          email: dados.email,
          is_pj: isPj,
          doc: dados.cpf,
          birth_date: birthDate,
          gender: gender,
          password: dados.senha,
        },
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body);
        // navigation.navigate("InitialRoute");
      })
      .catch((err) => {
        console.error(err);
      });
    // fetch("http://52.67.221.152/customers").then((response) => {
    //   console.log(response);
    // });
  };

  const checkingCep = async (cep: string) => {
    fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`)
      .then((response) => response.json())
      .then((body) => {
        setCity(body.city);
        setNeighborhood(body.neighborhood);
        setAddress(body.street);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const validateFields = () => {
    const newErrors: { [key: string]: string | null } = {};

    // Validação de campos obrigatórios
    if (!name.trim()) newErrors.name = "O nome é obrigatório.";
    if (!lastName.trim()) newErrors.lastName = "O sobrenome é obrigatório.";
    if (!address.trim()) newErrors.address = "O endereço é obrigatório.";
    if (!email.trim() || !email.includes("@"))
      newErrors.email = "O email é obrigatório.";

    // Validação de CPF
    if (!doc) {
      newErrors.doc = "O CPF/CNPJ é obrigatório.";
    }

    // Validação de CEP
    if (!cep) {
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

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (!selectedDate) return;
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    setBirthDate(currentDate.toLocaleString().slice(0, 10));
  };

  const showMode = (currentMode: string) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const handleSubmit = () => {
    const isFormValid = validateFields();
    if (isFormValid) {
      Alert.alert("Sucesso!", "Formulário preenchido corretamente.");
      // Aqui você enviaria os dados para a sua API
      const customer: Customer = {
        name: `${name} ${lastName}`,
        email: email,
        password: password,
        birthDate: birthDate.slice(0, 10),
        doc: doc,
        gender: gender,
        isPj: isPj,
        profileUrl: null,
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
        <Text className="text-[#5b5265] text-3xl font-sansBold text-center">
          Bem vindo!
        </Text>

        {/* CONTAINER DO FORMS */}
        {/* TODO: Adicionar verificação de preenchimento dos campos e termos */}
        <ScrollView className="w-[95vw] h-[74vh] mx-auto my-3 p-4 pb-10 bg-white border rounded-xl border-[#d9d9d9]">
          {/* CAMPO DE NOME E SOBRENOME */}
          <View className="flex flex-row gap-2 mb-3">
            {/* CAMPO DE NOME */}
            <TextInput
              className={`w-[49%] p-4 pl-2 text-xl border rounded-xl ${errors.name ? "border-red-500" : "border-[#d9d9d9]"}`}
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Nome"
              placeholderTextColor="#d9d9d9"
            />

            {/* CAMPO DE SOBRENOME */}
            <TextInput
              className={`w-[49%] p-4 pl-2 text-xl border rounded-xl ${errors.lastName ? "border-red-500" : "border-[#d9d9d9]"}`}
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              placeholder="Sobrenome"
              placeholderTextColor="#d9d9d9"
            />
          </View>

          {/* CAMPO DE EMAIL */}
          <View
            className={`flex flex-row items-center gap-2 p-1 pl-2 mb-2 border rounded-xl ${errors.email ? "border-red-500" : "border-[#d9d9d9]"}`}
          >
            <MaterialCommunityIcons
              name="mail"
              size={24}
              color={errors.email ? "red" : "#d9d9d9"}
            />
            <TextInput
              className="flex-1 text-xl"
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email"
              placeholderTextColor="#d9d9d9"
            />
          </View>

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
          <View className="flex flex-row gap-2 mb-1">
            {/* CAMPO DE CPF/CNPJ */}
            <MaskInput
              className={`w-[49%] p-4 pl-2 text-xl border rounded-xl ${errors.doc ? "border-red-500" : "border-[#d9d9d9]"}`}
              value={doc}
              onChangeText={(text) => setDoc(text)}
              placeholderTextColor="#d9d9d9"
              mask={isPj ? cnpjMask : cpfMask}
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
                  borderColor: "#d9d9d9",
                },
                isFocus && { borderColor: "#822083" },
              ]}
              data={data}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Seu gênero" : "..."}
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setGender(item.label);
                setValue(item.value);
                setIsFocus(false);
              }}
            />
          </View>
          <BouncyCheckbox
            useBuiltInState={false}
            isChecked={isPj}
            size={16}
            textComponent={
              <Text className="text-sm ml-2">Sou PJ (Pessoa Jurídica)</Text>
            }
            fillColor="purple"
            bounceEffectIn={0.95}
            onPress={(checked: boolean) => {
              setIsPj(!isPj);
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
          <View className="flex flex-row gap-2 mb-3">
            {/* CAMPO DE ANIVERSÁRIO */}
            <TouchableOpacity
              onPress={showDatepicker}
              className={`w-[49%] justify-center border rounded-xl border-[#d9d9d9]`}
            >
              <MaskInput
                className="p-4 pl-2 text-xl"
                value={birthDate}
                onChangeText={(text) => setBirthDate(text)}
                placeholder="Aniversário"
                placeholderTextColor="#d9d9d9"
                editable={false}
                mask={birthDateMask}
              />
            </TouchableOpacity>
            <MaskInput
              className={`w-[49%] justify-center border rounded-xl ${errors.cep ? "border-red-500" : "border-[#d9d9d9]"} p-4 pl-2 text-xl`}
              value={cep}
              onChangeText={(text) => {
                checkingCep(text);
                setCep(text);
              }}
              placeholderTextColor="#d9d9d9"
              mask={cepMask}
            />
          </View>

          {/* CAMPOS DE MUNICIPIO E CIDADE */}
          <View className="flex flex-row gap-2 mb-3">
            {/* CAMPO DE MUNICÍPIO */}
            {/* TODO: adicionar api de localização?? */}
            <TextInput
              className="w-[49%] p-4 pl-2 text-xl border rounded-xl border-[#d9d9d9]"
              value={neighborhood}
              onChangeText={(text) => setNeighborhood(text)}
              placeholder="Município"
              placeholderTextColor="#d9d9d9"
            />

            {/* CAMPO DE CIDADE */}
            {/* TODO: adicionar api de localização?? */}
            <TextInput
              className="w-[49%] p-4 pl-2 text-xl border rounded-xl border-[#d9d9d9]"
              value={city}
              onChangeText={(text) => setCity(text)}
              placeholder="Cidade"
              placeholderTextColor="#d9d9d9"
            />
          </View>

          {/* CAMPO DE ENDEREÇO */}
          <View
            className={`flex flex-row items-center gap-2 p-1 pl-2 mb-2 border rounded-xl ${errors.address ? "border-red-500" : "border-[#d9d9d9]"}`}
          >
            <FontAwesome6
              name="location-dot"
              size={24}
              color={errors.address ? "red" : "#d9d9d9"}
            />
            <TextInput
              className="flex-1 text-xl"
              value={address}
              onChangeText={(text) => setAddress(text)}
              placeholder="Endereço"
              placeholderTextColor="#d9d9d9"
            />
          </View>

          {/* CAMPO DE SENHA */}
          <Text className="text-[#737373] font-sansBold">Defina sua senha</Text>
          <PasswordInput
            style={`flex flex-row items-center gap-2 p-2 mb-1 border rounded-xl ${errors.password ? "border-red-500" : "border-[#d9d9d9]"}`}
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
            style={`flex flex-row items-center gap-2 p-2 mb-1 border rounded-xl ${errors.confirmPassword ? "border-red-500" : "border-[#d9d9d9]"}`}
            password={confirmPassword}
            setPassword={setConfirmPassword}
          />
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
