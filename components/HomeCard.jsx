import Typo from '@/components/Typo'
import * as Icons from 'phosphor-react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const HomeCard = ({
  totalBalance,
  totalIncome,
  totalExpenses,
  onAddPress,
}) => {
  return (
    <View style={styles.card}>
      {/* Decorative background circles */}
      <View style={styles.circleLarge} />
      <View style={styles.circleSmall} />

      {/* Top row */}
      <View style={styles.topRow}>
        <Typo size={13} color="rgba(255,255,255,0.6)" fontWeight="500">
          Total Balance
        </Typo>
        <Icons.DotsThreeOutline
          size={20}
          color="rgba(255,255,255,0.5)"
          weight="fill"
        />
      </View>

      {/* Balance amount */}
      <Typo size={38} fontWeight="700" color={'#ffffff'} style={styles.balance}>
        ${totalBalance.toFixed(2)}
      </Typo>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Income / Expense row */}
      <View style={styles.statsRow}>
        {/* Income */}
        <View style={styles.statItem}>
          <View style={[styles.statIconBg, { backgroundColor: 'rgba(22,163,74,0.25)' }]}>
            <Icons.ArrowCircleDown
              size={18}
              color={'#22c55e'}
              weight="fill"
            />
          </View>
          <View>
            <Typo size={11} color="rgba(255,255,255,0.5)">Income</Typo>
            <Typo size={16} fontWeight="700" color={'#22c55e'}>
              +${totalIncome.toFixed(2)}
            </Typo>
          </View>
        </View>

        <View style={styles.verticalDivider} />

        {/* Expense */}
        <View style={styles.statItem}>
          <View style={[styles.statIconBg, { backgroundColor: 'rgba(239,68,68,0.2)' }]}>
            <Icons.ArrowCircleUp
              size={18}
              color={'#f43f5e'}
              weight="fill"
            />
          </View>
          <View>
            <Typo size={11} color="rgba(255,255,255,0.5)">Expense</Typo>
            <Typo size={16} fontWeight="700" color={'#f43f5e'}>
              -${totalExpenses.toFixed(2)}
            </Typo>
          </View>
        </View>
      </View>
    </View>
  )
}

export default HomeCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1c2333',
    borderRadius: 20,
    padding: 20,
    paddingVertical: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163,230,53,0.15)',
    gap: 12,
    position: 'relative',
  },
  
  circleLarge: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(163,230,53,0.06)',
    top: -60,
    right: -40,
  },
  circleSmall: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: 'rgba(163,230,53,0.04)',
    bottom: -30,
    left: -20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balance: {
    marginVertical: 5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: 34,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 12,
  },
})