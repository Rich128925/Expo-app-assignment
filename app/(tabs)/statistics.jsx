import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import { useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";

const toDate = (raw) => {
  if (raw instanceof Timestamp) return raw.toDate();
  if (raw instanceof Date) return raw;
  return new Date(raw);
};

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const { width: SCREEN_W } = Dimensions.get("window");
const CHART_WIDTH = SCREEN_W - 20 * 2 - 16;

const PERIODS = ["Weekly", "Monthly", "Yearly"];

const Statistics = () => {
  const router = useRouter();
  const [period, setPeriod] = useState("Monthly");

  const transactions = [];
  const isLoading = false;

  const now = new Date();

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = toDate(t.date);
      if (period === "Weekly") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        return d >= sevenDaysAgo;
      }
      if (period === "Monthly") {
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(now.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);
        return d >= sixMonthsAgo;
      }
      const fiveYearsAgo = new Date(now);
      fiveYearsAgo.setFullYear(now.getFullYear() - 4);
      fiveYearsAgo.setMonth(0, 1);
      fiveYearsAgo.setHours(0, 0, 0, 0);
      return d >= fiveYearsAgo;
    });
  }, [transactions, period]);

  const chartData = useMemo(() => {
    if (period === "Weekly") {
      const buckets = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const key = d.toDateString();
        buckets[key] = { income: 0, expense: 0 };
      }
      filteredTransactions.forEach((t) => {
        const key = toDate(t.date).toDateString();
        if (!buckets[key]) return;
        if (t.type === "income") buckets[key].income += t.amount;
        else buckets[key].expense += t.amount;
      });
      return Object.entries(buckets).map(([key, val]) => ({
        label: SHORT_DAYS[new Date(key).getDay()],
        income: val.income,
        expense: val.expense,
      }));
    }

    if (period === "Monthly") {
      const buckets = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        buckets.push({
          label: SHORT_MONTHS[d.getMonth()],
          year: d.getFullYear(),
          month: d.getMonth(),
          income: 0,
          expense: 0,
        });
      }
      filteredTransactions.forEach((t) => {
        const d = toDate(t.date);
        const bucket = buckets.find(
          (b) => b.year === d.getFullYear() && b.month === d.getMonth(),
        );
        if (!bucket) return;
        if (t.type === "income") bucket.income += t.amount;
        else bucket.expense += t.amount;
      });
      return buckets.map((b) => ({
        label: b.label,
        income: b.income,
        expense: b.expense,
      }));
    }

    const buckets = [];
    for (let i = 4; i >= 0; i--) {
      const yr = now.getFullYear() - i;
      buckets.push({ label: String(yr), year: yr, income: 0, expense: 0 });
    }
    filteredTransactions.forEach((t) => {
      const yr = toDate(t.date).getFullYear();
      const bucket = buckets.find((b) => b.year === yr);
      if (!bucket) return;
      if (t.type === "income") bucket.income += t.amount;
      else bucket.expense += t.amount;
    });
    return buckets.map((b) => ({
      label: b.label,
      income: b.income,
      expense: b.expense,
    }));
  }, [filteredTransactions, period]);

  const barChartBars = useMemo(() => {
    const result = [];
    chartData.forEach((item, idx) => {
      result.push({
        value: item.income,
        label: item.label,
        frontColor: "#22c55e",
        spacing: 4,
        labelTextStyle: { color: "#a3a3a3", fontSize: 10 },
      });
      result.push({
        value: item.expense,
        frontColor: "#f43f5e",
        spacing: idx === chartData.length - 1 ? 0 : 20,
        labelTextStyle: { color: "#a3a3a3", fontSize: 10 },
      });
    });
    return result;
  }, [chartData]);

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const netSavings = totalIncome - totalExpenses;

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      const aMs = toDate(a.date).getTime();
      const bMs = toDate(b.date).getTime();
      return bMs - aMs;
    });
  }, [filteredTransactions]);

  const maxVal = Math.max(
    ...chartData.flatMap((d) => [d.income, d.expense]),
    1,
  );

  const handleTransactionPress = (item) => {
    router.push({
      pathname: "/(modals)/transactionModal",
      params: { id: item.id },
    });
  };

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Typo size={24} fontWeight="700">
            Statistics
          </Typo>
        </View>

        <View style={styles.tabBar}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.tab, period === p && styles.tabActive]}
              onPress={() => setPeriod(p)}
              activeOpacity={0.8}
            >
              <Typo
                size={13}
                fontWeight="600"
                color={period === p ? "#000000" : "#a3a3a3"}
              >
                {p}
              </Typo>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryRow}>
          <SummaryCard
            label="Income"
            amount={totalIncome}
            color={"#22c55e"}
            icon="TrendUp"
          />
          <SummaryCard
            label="Expenses"
            amount={totalExpenses}
            color={"#f43f5e"}
            icon="TrendDown"
          />
          <SummaryCard
            label="Savings"
            amount={netSavings}
            color={netSavings >= 0 ? "#6C63FF" : "#f43f5e"}
            icon="PiggyBank"
          />
        </View>

        <View style={styles.chartCard}>
          <View style={styles.legend}>
            <View
              style={[styles.legendDot, { backgroundColor: "#22c55e" }]}
            />
            <Typo size={11} color={"#a3a3a3"}>
              Income
            </Typo>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: "#f43f5e" }]}
            />
            <Typo size={11} color={"#a3a3a3"}>
              Expense
            </Typo>
          </View>

          {barChartBars.length > 0 ? (
            <BarChart
              data={barChartBars}
              barWidth={12}
              spacing={period === "Yearly" ? 28 : 20}
              roundedTop
              roundedBottom={false}
              hideRules={false}
              rulesColor={"#404040"}
              rulesType="solid"
              noOfSections={4}
              maxValue={Math.ceil(maxVal * 1.2)}
              yAxisTextStyle={{ color: "#737373", fontSize: 9 }}
              xAxisLabelTextStyle={{ color: "#a3a3a3", fontSize: 10 }}
              xAxisColor={"#404040"}
              yAxisColor="transparent"
              hideYAxisText={false}
              backgroundColor="transparent"
              width={CHART_WIDTH}
              height={160}
              isAnimated
              animationDuration={600}
              disableScroll={period !== "Yearly"}
              scrollAnimation
            />
          ) : (
            <View style={styles.emptyChart}>
              <Icons.ChartBar size={40} color={"#525252"} weight="thin" />
              <Typo size={13} color={"#737373"}>
                No data for this period
              </Typo>
            </View>
          )}
        </View>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Typo size={18} fontWeight="600">
              Transactions
            </Typo>
            <Typo size={12} color={"#737373"}>
              {sortedTransactions.length} records
            </Typo>
          </View>

          {isLoading ? (
            <View style={styles.emptyList}>
              <Icons.CircleNotch size={28} color={"#6C63FF"} weight="bold" />
            </View>
          ) : sortedTransactions.length === 0 ? (
            <View style={styles.emptyList}>
              <Icons.ReceiptX size={44} color={"#525252"} weight="thin" />
              <Typo size={14} color={"#737373"}>
                No transactions in this period
              </Typo>
            </View>
          ) : (
            <View style={styles.listGap}>
              {sortedTransactions.map((item) => (
                <TouchableOpacity
                  key={item.id ?? `${item.date}-${item.amount}`}
                  onPress={() => handleTransactionPress(item)}
                  style={styles.txRow}
                >
                  <Typo size={14}>{item.description ?? item.type}</Typo>
                  <Typo
                    size={14}
                    color={item.type === "income" ? "#22c55e" : "#f43f5e"}
                  >
                    {item.type === "income" ? "+" : "-"}$
                    {item.amount.toFixed(2)}
                  </Typo>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const SummaryCard = ({ label, amount, color, icon }) => {
  // eslint-disable-next-line import/namespace
  const IconComp = Icons[icon] ?? Icons.CurrencyDollarSimple;
  return (
    <View style={[styles.summaryCard, { borderColor: color + "30" }]}>
      <View style={[styles.summaryIconBg, { backgroundColor: color + "18" }]}>
        <IconComp size={16} color={color} weight="bold" />
      </View>
      <Typo size={10} color={"#a3a3a3"} style={{ marginTop: 6 }}>
        {label}
      </Typo>
      <Typo size={14} fontWeight="700" color={color} numberOfLines={1}>
        ${Math.abs(amount).toFixed(0)}
      </Typo>
    </View>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
    gap: 20,
  },
  header: {
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#171717",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#6C63FF",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#171717",
    borderRadius: 15,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  summaryIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  chartCard: {
    backgroundColor: "#171717",
    borderRadius: 15,
    padding: 15,
    paddingBottom: 10,
    overflow: "hidden",
  },
  legend: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyChart: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  listSection: {
    gap: 12,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listGap: {
    gap: 10,
  },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#262626",
    borderRadius: 10,
    padding: 12,
  },
  emptyList: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 35,
  },
});