import { useEffect, useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'

import { BackButton } from '../components/BackButton'
import { ProgressBar } from '../components/ProgressBar'
import { Checkbox } from '../components/Checkbox'
import { Loading } from '../components/Loading'
import { api } from '../lib/axios'
import { generateProgressPercentage } from '../utils/generate-progress-percentage'
import { HabitDayEmpty } from '../components/HabitDayEmpty'

interface HabitParams {
  date: Date,
}

interface HabitDayResponse {
  possibleHabits: {
    id: string
    title: string
  }[],
  completedHabits: string[]
}

export function Habit() {
  const [isLoading, setIsLoading] = useState(true)
  const [habitDayInfo, setHabitDayInfo] = useState<HabitDayResponse | null>(null)
  const [completedHabits, setCompletedHabits] = useState<string[]>([])

  const { params } = useRoute()
  const { date } = params as HabitParams

  const parsedDate = dayjs(date)
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
  const weekDay = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM')

  const habitsProgress = habitDayInfo?.possibleHabits.length ? generateProgressPercentage(habitDayInfo.possibleHabits.length, completedHabits.length) : 0

  async function fetchHabits() {
    try {
      setIsLoading(true)

      const { data } = await api.get<HabitDayResponse>('habits/day', {
        params: {
          date,
        }
      })

      setHabitDayInfo(data)
      setCompletedHabits(data.completedHabits ?? [])
    } catch (error) {
      console.log(error)
      Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  async function handleToggleCompletedHabit(habitId: string) {
    try {
      await api.patch(`habits/${habitId}/toggle-completed`)

      if (completedHabits?.includes(habitId)) {
        setCompletedHabits(oldValue => oldValue.filter(id => id !== habitId))
      } else {
        setCompletedHabits(oldValue => [...oldValue, habitId])
      }
    } catch (error) {
      Alert.alert('Ops', 'Não foi possível atualizar o status do seu hábito')
      console.log(error)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <View className="flex-1 px-8 pt-16 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-4 text-base text-zinc-400 font-semibold leading-none">{weekDay}</Text>
        <Text className="mt-2 text-white text-3xl font-extrabold leading-tight">{dayAndMonth}</Text>

        <ProgressBar progress={habitsProgress} />

        {habitDayInfo?.possibleHabits.length === 0
          ? (
            <HabitDayEmpty />
          ) : (
            <View className="mt-6">
              {
                habitDayInfo?.possibleHabits.map(({ id, title }) => {
                  return (
                    <Checkbox
                      key={id}
                      title={title}
                      checked={completedHabits.includes(id)}
                      disabled={isDateInPast}
                      onPress={() => handleToggleCompletedHabit(id)}
                    />
                  )
                })
              }
              {
                habitDayInfo?.possibleHabits && isDateInPast && (
                  <Text className="text-zinc-400 mt-10 text-center">
                    Você não pode editar hábitos de uma data passada.
                  </Text>
                )
              }
            </View>
          )
        }
      </ScrollView>
    </View>
  )
}