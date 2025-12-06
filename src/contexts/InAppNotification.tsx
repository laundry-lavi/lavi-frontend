import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo, // <--- Importante
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  PanResponder,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// --- TIPOS ---
type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationOptions {
  title: string;
  message: string;
  type?: NotificationType;
  onPress?: () => void;
  duration?: number;
}

interface NotificationContextData {
  showNotification: (options: NotificationOptions) => void;
}

// --- CONTEXTO ---
const NotificationContext = createContext<NotificationContextData>(
  {} as NotificationContextData
);

// --- COMPONENTE VISUAL DA NOTIFICAÇÃO ---
const { width } = Dimensions.get("window");

const NotificationComponent = ({
  data,
  onHide,
  translateY,
}: {
  data: NotificationOptions;
  onHide: () => void;
  translateY: Animated.Value;
}) => {
  // CORREÇÃO: Usar useMemo para criar o PanResponder apenas uma vez
  // Isso evita que o PanResponder.create rode dentro do render phase
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy < 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy < -40 || gestureState.vy < -0.5) {
            onHide();
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [onHide, translateY]
  );

  const getColors = () => {
    switch (data.type) {
      case "error":
        return {
          bg: "#FEF2F2",
          border: "#EF4444",
          icon: "alert-circle",
          iconColor: "#DC2626",
        };
      case "success":
        return {
          bg: "#F0FDF4",
          border: "#22C55E",
          icon: "checkmark-circle",
          iconColor: "#16A34A",
        };
      case "warning":
        return {
          bg: "#FFFBEB",
          border: "#F59E0B",
          icon: "warning",
          iconColor: "#D97706",
        };
      default:
        return {
          bg: "#FFFFFF",
          border: "#513191",
          icon: "information-circle",
          iconColor: "gray",
        };
    }
  };

  const stylesColors = getColors();

  return (
    <Animated.View
      style={[styles.notificationContainer, { transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      {/* CORREÇÃO: Removido SafeAreaView interno que causa conflito com Animated */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: stylesColors.bg,
            borderLeftColor: stylesColors.border,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            if (data.onPress) data.onPress();
            onHide();
          }}
          style={styles.contentContainer}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={stylesColors.icon as any}
              size={28}
              color={stylesColors.iconColor}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {data.title}
            </Text>
            <Text style={styles.message} numberOfLines={2}>
              {data.message}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.handleIndicator} />
      </View>
    </Animated.View>
  );
};

// --- PROVIDER ---
export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notification, setNotification] = useState<NotificationOptions | null>(
    null
  );

  const translateY = useRef(new Animated.Value(-200)).current;
  const timeoutRef = useRef<NodeJS.Timeout>();

  const hideNotification = useCallback(() => {
    Animated.timing(translateY, {
      toValue: -200,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setNotification(null);
    });
  }, [translateY]);

  const showNotification = useCallback(
    (options: NotificationOptions) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setNotification(options);

      // Pequeno timeout para garantir que o componente montou antes de animar
      // Ajuda a evitar conflitos de layout
      setTimeout(() => {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 8,
          speed: 12,
        }).start();
      }, 10);

      const duration = options.duration || 4000;
      timeoutRef.current = setTimeout(() => {
        hideNotification();
      }, duration);
    },
    [hideNotification, translateY]
  );

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <NotificationComponent
          data={notification}
          onHide={hideNotification}
          translateY={translateY}
        />
      )}
    </NotificationContext.Provider>
  );
};

// --- HOOK CUSTOMIZADO ---
export const useInAppNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useInAppNotification deve ser usado dentro de um NotificationProvider"
    );
  }
  return context;
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  notificationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
    // Ajuste seguro para iOS e Android manualmente
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 10) + 10 : 50,
  },
  card: {
    flexDirection: "column",
    borderRadius: 16,
    borderLeftWidth: 5,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: "#4B5563",
  },
  handleIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
  },
});
