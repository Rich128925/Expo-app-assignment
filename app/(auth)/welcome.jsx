import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'

const Welcome = () => {
  const router = useRouter()

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={styles.loginButton}
          >
            <Typo fontWeight={"500"}>Sign in</Typo>
          </TouchableOpacity>

          <Animated.Image
            entering={FadeIn.duration(1000)}
            source={require("../../assets/images/welcome.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        {/** Footer */}
        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(12)}
            style={{ alignItems: 'center' }}
          >
            <Typo size={30} fontWeight={"800"}>
              Always take control
            </Typo>
            <Typo size={30} fontWeight={"800"}>
              of your finances
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000).delay(100).springify().damping(12)}
            style={{ alignItems: 'center', gap: 2 }}
          >
            <Typo size={17} color={'#e0e0e0'}>
              Finances must be arranged to set a better
            </Typo>
            <Typo size={17} color={'#e0e0e0'}>
              lifestyle in future
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(200)
              .springify()
              .damping(12)}
            style={styles.buttonContainer}>
            <Button
              onPress={() => router.push('/(auth)/register')}>
              <Typo size={22} color={'#171717'} fontWeight={"600"}>
                Get Started
              </Typo>
            </Button>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 7,
  },
  welcomeImage: {
    width: "100%",
    height: 300,
    alignSelf: "center",
    marginTop: 100,
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: 20,
  },
  footer: {
    backgroundColor: '#171717',
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 45,
    gap: 20,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15,
  },
  textContainer: {
    alignItems: "center",
  },
  subTextContainer: {
    alignItems: "center",
    gap: 2,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 25,
  },
})