import Loading from '@/components/Loading'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { useRouter } from 'expo-router'
import * as Icons from 'phosphor-react-native'
import React, { useState } from 'react'
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

const Wallet = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Placeholder data — replace with real data source later
  const wallets = []

  const totalBalance = wallets.reduce((sum, w) => sum + (w.amount ?? 0), 0)
  const totalIncome = wallets.reduce((sum, w) => sum + (w.totalIncome ?? 0), 0)
  const totalExpenses = wallets.reduce((sum, w) => sum + (w.totalExpenses ?? 0), 0)

 

  const handleDelete = (wallet) => {
    Alert.alert(
      'Delete Wallet',
      `Are you sure you want to delete "${wallet.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // TODO: wire up real delete logic once walletService is available
            console.log('Delete wallet:', wallet.id)
          },
        },
      ]
    )
  }

  return (
    <ScreenWrapper style={{ backgroundColor: '#000000' }}>
      <View style={styles.container}>
        {/** ── Balance panel ── */}
        <View style={styles.balancePanel}>
          <View style={styles.balanceCenter}>
            <Typo size={14} color={'#a3a3a3'}>
              Total Balance
            </Typo>
            <Typo size={42} fontWeight={'700'} color={'#6C63FF'}>
              ${totalBalance.toFixed(2)}
            </Typo>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIcon}>
                <Icons.ArrowCircleDown
                  size={20}
                  color={'#22c55e'}
                  weight="fill"
                />
              </View>
              <View>
                <Typo size={12} color={'#a3a3a3'}>Income</Typo>
                <Typo size={16} fontWeight={'600'} color={'#22c55e'}>
                  +${totalIncome.toFixed(2)}
                </Typo>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <View style={styles.summaryIcon}>
                <Icons.ArrowCircleUp
                  size={20}
                  color={'#f43f5e'}
                  weight="fill"
                />
              </View>
              <View>
                <Typo size={12} color={'#a3a3a3'}>Expenses</Typo>
                <Typo size={16} fontWeight={'600'} color={'#f43f5e'}>
                  -${totalExpenses.toFixed(2)}
                </Typo>
              </View>
            </View>
          </View>
        </View>

        {/** ── Wallets panel ── */}
        <View style={styles.walletsPanel}>
          <View style={styles.panelHeader}>
            <Typo size={20} fontWeight={'600'}>My Wallets</Typo>
            <TouchableOpacity
              onPress={() => router.push('/(modals)/walletModal')}
              style={styles.addBtn}
            >
              <Icons.PlusCircle
                weight="fill"
                color={'#6C63FF'}
                size={32}
              />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.centered}>
              <Loading />
            </View>
          ) : (
            <FlatList
              data={wallets}
              keyExtractor={(item) => item.id ?? item.name}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.walletItem}
                  onPress={() =>
                    router.push({
                      pathname: '/(modals)/walletModal',
                      params: { walletId: item.id },
                    })
                  }
                  onLongPress={() => handleDelete(item)}
                >
                  <Typo size={16} fontWeight="600">{item.name}</Typo>
                  <Typo size={14} color={'#a3a3a3'}>${(item.amount ?? 0).toFixed(2)}</Typo>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Icons.Wallet
                    size={52}
                    color={'#525252'}
                    weight="thin"
                  />
                  <Typo size={16} color={'#737373'}>No wallets yet</Typo>
                  <Typo size={13} color={'#525252'}>
                    Tap + to add your first wallet
                  </Typo>
                </View>
              }
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Wallet

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  balancePanel: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 25,
    gap: 20,
  },
  balanceCenter: {
    alignItems: 'center',
    gap: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: '#171717',
    borderRadius: 17,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#404040',
    marginHorizontal: 10,
  },
  walletsPanel: {
    flex: 1,
    backgroundColor: '#171717',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addBtn: {
    padding: 2,
  },
  list: {
    gap: 12,
    paddingBottom: 30,
  },
  walletItem: {
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyState: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 60,
  },
})