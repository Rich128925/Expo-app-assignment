import { useRouter } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

const BackButton = ({ style, iconSize = 26 }) => {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(auth)/welcome");
    }
  };

  return (
    <TouchableOpacity onPress={handleBack} style={[styles.button, style]}>
      <CaretLeft size={iconSize} color={"#ffffff"} weight="bold" />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#525252",
    alignSelf: "flex-start",
    borderRadius: 12,
    borderCurve: "continuous",
    padding: 5,
  },
});
