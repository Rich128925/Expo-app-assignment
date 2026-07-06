import * as Icons from "phosphor-react-native";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const labels = {
  index: "Home",
  statistics: "Stats",
  wallet: "Wallet",
  profile: "Profile",
};

export default function CustomTabs({ state, descriptors, navigation }) {
  const tabbarIcons = {
    index: (isFocused) => (
      <Icons.House
        size={24}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? "#16a34a" : "#a3a3a3"}
      />
    ),
    statistics: (isFocused) => (
      <Icons.ChartBar
        size={24}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? "#16a34a" : "#a3a3a3"}
      />
    ),
    wallet: (isFocused) => (
      <Icons.Wallet
        size={24}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? "#16a34a" : "#a3a3a3"}
      />
    ),
    profile: (isFocused) => (
      <Icons.User
        size={24}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? "#16a34a" : "#a3a3a3"}
      />
    ),
  };

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key] || {};
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={
              options?.tabBarAccessibilityLabel || labels[route.name]
            }
            testID={options?.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
            {tabbarIcons[route.name]?.(isFocused)}
            <Text style={[styles.label, isFocused && styles.activeLabel]}>
              {labels[route.name] || route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    width: "100%",
    height: Platform.OS === "ios" ? 74 : 58,
    backgroundColor: "#262626",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: "#404040",
    borderTopWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 8 : 4,
  },
  tabbarItem: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: 2,
  },
  label: {
    color: "#a3a3a3",
    fontSize: 11,
    marginTop: 2,
  },
  activeLabel: {
    color: "#16a34a",
    fontWeight: "600",
  },
});
