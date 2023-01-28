import * as Notifications from 'expo-notifications';

import './src/lib/dayjs';

import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold, useFonts
} from '@expo-google-fonts/inter';
import { Button, StatusBar } from 'react-native';

import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';
import { useEffect } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  });

  async function scheduleNotification() {
    const schedules = await Notifications.getAllScheduledNotificationsAsync()
    console.log('Notificações agendadas:', schedules)

    if (schedules.length > 0) {
      await Notifications.cancelAllScheduledNotificationsAsync()
    }

    const trigger = new Date(Date.now())
    trigger.setHours(trigger.getHours() + 5)
    trigger.setSeconds(0)

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Olá, Rafael! 😍',
        body: 'Você praticou seus hábitos hoje?'
      },
      trigger,
    })
  }

  useEffect(() => {
    scheduleNotification()
  }, [])

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Routes />
    </>
  );
}
