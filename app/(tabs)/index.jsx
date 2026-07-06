import HomeCard from "@/components/HomeCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Home = () => {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const firstName = user?.name?.split(" ")[0]?.trim() || "there";

  // Placeholder data — replace with real data source later
  const wallets = [];
  const transactions = [];

  const totalBalance = wallets.reduce((s, w) => s + (w.amount ?? 0), 0);
  const totalIncome = wallets.reduce((s, w) => s + (w.totalIncome ?? 0), 0);
  const totalExpenses = wallets.reduce((s, w) => s + (w.totalExpenses ?? 0), 0);

  const recentTransactions = [...transactions]
    .sort((a, b) => {
      const aMs = a.date?.toMillis?.() ?? new Date(a.date).getTime();
      const bMs = b.date?.toMillis?.() ?? new Date(b.date).getTime();
      return bMs - aMs;
    })
    .filter((t) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.description?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q)
      );
    })
    .slice(0, 10);

  const handleLogout = async () => {
    const result = await logout();
    if (!result.success) {
      console.log("Logout failed:", result.msg);
      return;
    }
    router.replace("/(auth)/login");
  };

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/** ── Header ── */}
        <View style={styles.header}>
          <View>
            <Typo size={14} color={"#a3a3a3"}>
              Hello,
            </Typo>
            <Typo size={22} fontWeight="700">
              {firstName} 👋
            </Typo>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => setShowSearch((v) => !v)}
            >
              <Icons.MagnifyingGlass
                size={20}
                color={showSearch ? "#6C63FF" : "#d4d4d4"}
                weight="bold"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.searchBtn} onPress={handleLogout}>
              <Icons.SignOut size={20} color={"#ef4444"} weight="bold" />
            </TouchableOpacity>
          </View>
        </View>

        {/** Inline search bar */}
        {showSearch && (
          <View style={styles.searchBar}>
            <Icons.MagnifyingGlass size={18} color={"#a3a3a3"} weight="bold" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
              placeholderTextColor={"#737373"}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Icons.X size={16} color={"#a3a3a3"} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/** Balance card */}
        <HomeCard
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />

        {/** ── Quick actions ── */}
        <View style={styles.quickActions}>
          <QuickAction
            icon={
              <Icons.ArrowCircleUp size={22} color={"#f43f5e"} weight="fill" />
            }
            label="Send"
            bg="rgba(239,68,68,0.12)"
          />
          <QuickAction
            icon={
              <Icons.ArrowCircleDown
                size={22}
                color={"#22c55e"}
                weight="fill"
              />
            }
            label="Receive"
            bg="rgba(22,163,74,0.12)"
          />
          <QuickAction
            icon={<Icons.Wallet size={22} color={"#6C63FF"} weight="fill" />}
            label="Wallets"
            onPress={() => router.push("/(tabs)/wallet")}
            bg="rgba(163,230,53,0.1)"
          />
          <QuickAction
            icon={<Icons.ChartBar size={22} color="#818cf8" weight="fill" />}
            label="Stats"
            onPress={() => router.push("/(tabs)/statistics")}
            bg="rgba(129,140,248,0.12)"
          />
        </View>

        {/** ── Recent transactions (placeholder list) ── */}
        <View style={{ gap: 10 }}>
          <Typo size={16} fontWeight="600">
            Recent Transactions
          </Typo>
          {recentTransactions.length === 0 ? (
            <Typo size={14} color={"#a3a3a3"}>
              No transactions yet. Add one!
            </Typo>
          ) : (
            recentTransactions.map((item, index) => (
              <TouchableOpacity
                key={item.id ?? index}
                onPress={() => console.log("tx pressed:", item.id)}
              >
                <Typo size={14}>{item.description ?? item.type}</Typo>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/** ── FAB — Add transaction ── */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push("/(modals)/transactionModal")}
      >
        <Icons.Plus size={26} color={"#000000"} weight="bold" />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

/** ── Quick action button ─────────────────────────── */
const QuickAction = ({ icon, label, bg, onPress }) => (
  <TouchableOpacity style={styles.qaItem} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.qaIcon, { backgroundColor: bg ?? "#262626" }]}>
      {icon}
    </View>
    <Typo size={11} color={"#a3a3a3"}>
      {label}
    </Typo>
  </TouchableOpacity>
);

export default Home;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
    gap: 25,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchBtn: {
    backgroundColor: "#262626",
    padding: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#404040",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#262626",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: "#404040",
    marginTop: -10,
  },
  searchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
    padding: 0,
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  qaItem: {
    alignItems: "center",
    gap: 7,
  },
  qaIcon: {
    width: 52,
    height: 52,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  fab: {
    position: "absolute",
    bottom: 28,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 100,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
});
