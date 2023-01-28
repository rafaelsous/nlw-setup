import { useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'
import clsx from 'clsx'

import { BackButton } from '../components/BackButton'
import { Checkbox } from '../components/Checkbox'
import { api } from '../lib/axios'

export const availableWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]

export function New() {
  const [title, setTitle] = useState('')
  const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const isInvalidData = !title || title.trim().length === 0 || selectedWeekDays.length === 0

  function handleToggleWeekDay(weekDayIndex: number) {
    if (selectedWeekDays.includes(weekDayIndex)) {
      setSelectedWeekDays(selectedWeekDays.filter(weekDay => weekDay !== weekDayIndex))
    } else {
      setSelectedWeekDays(oldValue => [...oldValue, weekDayIndex])
    }
  }

  async function handleNewHabit() {
    try {
      setIsLoading(true)
      
      if (isInvalidData) {
        return
      }

      await api.post('habits', {
        title,
        weekDays: selectedWeekDays
      })

      setTitle('')
      setSelectedWeekDays([])

      Alert.alert('Novo hábito registrado com sucesso')
    } catch (error) {
      Alert.alert('Não foi possível registrar o novo hábito')
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1 px-8 pt-16 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 32
        }}
      >
        <BackButton />

        <Text className="mt-4 text-white text-3xl font-extrabold leading-tight">
          Criar hábito
        </Text>

        <Text className="mt-6 text-white font-semibold text-base leading-tight">
          Qual seu comprometimento?
        </Text>

        <TextInput
          className="mt-3 p-4 bg-zinc-900 border-2 border-zinc-800 rounded-lg text-white focus:border-blue-600"
          placeholder="Exercícios, dormir bem, etc..."
          placeholderTextColor={colors.zinc[400]}
          value={title}
          onChangeText={setTitle}
        />

        <Text className="mt-4 mb-3 text-white font-semibold text-base leading-tight">
          Qual a recorrência?
        </Text>

        {availableWeekDays.map((weekDay, index) => (
          <Checkbox
            key={weekDay}
            title={weekDay}
            checked={selectedWeekDays.includes(index)}
            onPress={() => handleToggleWeekDay(index)}
          />
        ))}

        <TouchableOpacity
          activeOpacity={0.7}
          className={clsx('mt-6 p-4 flex-row items-center justify-center bg-blue-600 rounded-lg', {
            'opacity-50': isInvalidData
          })}
          disabled={isInvalidData || isLoading}
          onPress={handleNewHabit}
        >
          {isLoading
            ? <ActivityIndicator size={24} color={colors.white} />
            : (
              <>
                <Feather
                  name="check"
                  size={20}
                  color={colors.white}
                />

                <Text className="ml-3 text-white font-semibold text-base leading-tight">
                  Confirmar
                </Text>
              </>
            )
          }
        </TouchableOpacity>
      </ScrollView>
    </View >
  )
}