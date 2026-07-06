import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { auth } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Alert, Share, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const Profile = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Fetch the current ID token to display
    auth.currentUser
      ?.getIdToken(false)
      .then(setToken)
      .catch(() => {});
  }, [user]);

  const accountOptions = [
    {
      title: "Edit Profile",
      icon: <Icons.User size={26} color={"#ffffff"} weight="fill" />,
      routeName: "/(modals)/profileModal",
      bgColor: "#6366f1",
    },
    {
      title: "Setting",
      icon: <Icons.GearSix size={26} color={"#ffffff"} weight="fill" />,
      bgColor: "#059669",
    },
    {
      title: "Privacy Policy",
      icon: <Icons.Lock size={26} color={"#ffffff"} weight="fill" />,
      bgColor: "#525252",
    },
    {
      title: "Logout",
      icon: <Icons.Power size={26} color={"#ffffff"} weight="fill" />,
      bgColor: "#e11d48",
    },
  ];

  const showLogoutAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          const result = await logout();
          if (result.success) {
            router.replace("/(auth)/login");
          }
        },
      },
    ]);
  };

  const handlePress = (item) => {
    if (item.title === "Logout") {
      showLogoutAlert();
      return;
    }

    if (item.routeName) {
      router.push(item.routeName);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Profile" style={{ marginVertical: 10 }} />

        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                user?.image
                  ? { uri: user.image }
                  : require("@/assets/images/defaultAvatar.png")
              }
              style={styles.avatar}
              contentFit="cover"
              transition={1000}
            />

            <View style={styles.editIcon}>
              <Icons.PencilSimple size={18} color={"#171717"} weight="fill" />
            </View>
          </View>

          <View style={styles.nameContainer}>
            <Typo style={styles.nameText}>{user?.name || "No Name"}</Typo>
            <Typo style={styles.emailText}>{user?.email || "No Email"}</Typo>

            {/* UID */}
            <View style={styles.infoRow}>
              <Typo size={12} color={"#737373"}>
                UID:{" "}
              </Typo>
              <Typo size={12} color={"#a3a3a3"} style={styles.infoValue}>
                {user?.uid || "—"}
              </Typo>
              <TouchableOpacity
                onPress={() => Alert.alert("UID", user?.uid || "")}
              >
                <Icons.Info size={14} color={"#737373"} />
              </TouchableOpacity>
            </View>

            {/* Token */}
            {token && (
              <View style={styles.infoRow}>
                <Typo size={12} color={"#737373"}>
                  Token:{" "}
                </Typo>
                <Typo size={12} color={"#a3a3a3"} style={styles.infoValue}>
                  {token.slice(0, 20)}…
                </Typo>
                <TouchableOpacity
                  onPress={() => Share.share({ message: token })}
                >
                  <Icons.ShareNetwork size={14} color={"#737373"} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => (
            <Animated.View
              key={item.title}
              entering={FadeInDown.delay(index * 50)
                .springify()
                .damping(14)}
              style={styles.listItem}
            >
              <TouchableOpacity
                style={styles.flexRow}
                onPress={() => handlePress(item)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.listIcon, { backgroundColor: item.bgColor }]}
                >
                  {item.icon}
                </View>

                <Typo size={16} style={styles.optionText} fontWeight="500">
                  {item.title}
                </Typo>

                <Icons.CaretRight size={20} weight="bold" color={"#ffffff"} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userInfo: {
    marginTop: 30,
    alignItems: "center",
    gap: 15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: "#d4d4d4",
    height: 135,
    width: 135,
    borderRadius: 200,
    overflow: "hidden",
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: "#f5f5f5",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  nameContainer: {
    gap: 4,
    alignItems: "center",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#f5f5f5",
  },
  emailText: {
    fontSize: 16,
    color: "#a3a3a3",
  },
  accountOptions: {
    marginTop: 35,
  },
  listItem: {
    marginBottom: 17,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  listIcon: {
    height: 44,
    width: 44,
    backgroundColor: "#737373",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  optionText: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  infoValue: {
    flex: 1,
  },
});
