import { useFocusEffect, useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'

import { api } from '../lib/axios'
import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates'

import { HabitDay, HABIT_DAY_SIZE } from '../components/HabitDay'
import { Header } from '../components/Header'
import { Loading } from '../components/Loading'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSize = 18 * 7
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length

type Summary = {
  id: string
  date: string
  completed: number
  amount: number
}[]

export function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<Summary | null>(null)

  const { navigate } = useNavigation()

  async function fetchData() {
    try {
      setIsLoading(true)

      const { data } = await api.get('/summary')
      setSummary(data)
    } catch (error) {
      Alert.alert('Ops', 'Não foi possível carregar o sumário dos hábitos')
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchData()
  }, []))

  if (isLoading) {
    return <Loading />
  }

  return (
    <View className="flex-1 px-8 pt-[108px] bg-background">
      <Header />

      <View className="mt-6 mb-2 flex-row">
        {weekDays.map((weekDay, index) => (
          <Text
            key={`${weekDay}-${index}`}
            className="m-1 text-zinc-400 text-xl font-bold text-center"
            style={{ width: HABIT_DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {
          summary &&
          <View className="flex-row flex-wrap">
            {
              datesFromYearStart.map(date => {
                const dayWithHabits = summary.find(day => {
                  return dayjs(date).isSame(day.date, 'day')
                })

                return (
                  <HabitDay
                    key={date.toISOString()}
                    date={date}
                    completed={dayWithHabits?.completed}
                    amount={dayWithHabits?.amount}
                    onPress={() => navigate('habit', { date: date.toISOString() } )}
                  />
                )
              })
            }

            {
              amountOfDaysToFill > 0 && Array
                .from({ length: amountOfDaysToFill })
                .map((_, index) => (
                  <View
                    key={index}
                    className="flex-row flex-wrap border-2 border-zinc-800 bg-zinc-900 rounded-lg m-1 opacity-40"
                    style={{ width: HABIT_DAY_SIZE, height: HABIT_DAY_SIZE }}
                  />
                ))
            }
          </View>
        }
      </ScrollView>
    </View>
  )
}