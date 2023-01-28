import { Dimensions, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import dayjs from 'dayjs'
import clsx from 'clsx'

import { generateProgressPercentage } from '../utils/generate-progress-percentage'

const TOTAL_WEEK_DAYS = 7
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5

export const HABIT_DAY_MARGIN_BETWEEN = 8
export const HABIT_DAY_SIZE = (Dimensions.get('screen').width / TOTAL_WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5)

interface HabitDayProps extends TouchableOpacityProps {
  date: Date
  completed?: number
  amount?: number
}

export function HabitDay({ completed = 0, amount = 0, date, ...rest }: HabitDayProps) {
  const amountAccomplishedPercentage = amount > 0 ? generateProgressPercentage(amount, completed) : 0
  const today = dayjs().startOf('day').toDate()
  const isCurrentDate = dayjs(date).isSame(today)

  return (
    <TouchableOpacity
      className={clsx('border-2 rounded-lg m-1', {
        'bg-zinc-900 border-zinc-800': amountAccomplishedPercentage === 0,
        'bg-violet-900 border-violet-700': amountAccomplishedPercentage > 0 && amountAccomplishedPercentage < 20,
        'bg-violet-800 border-violet-600': amountAccomplishedPercentage >= 20 && amountAccomplishedPercentage < 40,
        'bg-violet-700 border-violet-500': amountAccomplishedPercentage >= 40 && amountAccomplishedPercentage < 60,
        'bg-violet-600 border-violet-500': amountAccomplishedPercentage >= 60 && amountAccomplishedPercentage < 80,
        'bg-violet-500 border-violet-400': amountAccomplishedPercentage >= 80,
        'border-4 border-white': isCurrentDate
      })}
      style={{ width: HABIT_DAY_SIZE, height: HABIT_DAY_SIZE }}  
      activeOpacity={0.7}
      {...rest}
    />
  )
}