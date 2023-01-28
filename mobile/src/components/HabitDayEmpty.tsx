import { Text, View } from 'react-native'

export function HabitDayEmpty() {
  return (
    <View className="mt-6 px-3 py-6 border border-zinc-800 rounded-lg">
      <Text className="text-center text-base text-zinc-400">
        Nenhum hábito cadastrado para este dia
      </Text>
    </View>
  )
}