import { useAuth } from "@/contexts/authContext";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

// This screen handles initial splash + redirect based on auth state.
export default function Index() {
  const { user, initializing } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), 1200);
    return () => clearTimeout(timeout);
  }, []);

  if (initializing || showSplash) {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require("../assets/images/splashImage.png")}
        />
      </View>
    );
  }

  if (user) return <Redirect href="/(tabs)" />;
  return <Redirect href="/(auth)/welcome" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#171717",
  },
  logo: {
    height: "20%",
    aspectRatio: 1,
  },
});
