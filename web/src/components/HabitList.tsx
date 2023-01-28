import { useEffect, useState } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'phosphor-react';

import { api } from '../lib/axios';
import dayjs from 'dayjs';

interface HabitListProps {
  date: Date
  onChangeCompletedHabits: (completed: number) => void
}

interface HabitInfo {
  possibleHabits: {
    id: string
    title: string
  }[],
  completedHabits: string[]
}
export function HabitList({ date, onChangeCompletedHabits }: HabitListProps) {
  const [habitInfoList, setHabitInfoList] = useState<HabitInfo>()

  const isDateInPast = dayjs(date).isBefore(new Date(), 'day')

  useEffect(() => {
    api.get('habits/day', {
      params: {
        date: date.toISOString()
      }
    }).then(response => setHabitInfoList(response.data))
  }, [])

  async function handleToggleHabitCompleted(habitId: string) {
    const isHabitAlreadyCompleted = habitInfoList?.completedHabits.includes(habitId)

    await api.patch(`habits/${habitId}/toggle-completed`)

    let completedHabitList: string[] = []
    if (isHabitAlreadyCompleted) {
      completedHabitList = habitInfoList!.completedHabits.filter(id => id !== habitId)
    } else {
      completedHabitList = [...habitInfoList!.completedHabits, habitId]
    }

    setHabitInfoList({
      possibleHabits: habitInfoList!.possibleHabits,
      completedHabits: completedHabitList
    })

    onChangeCompletedHabits(completedHabitList.length)
  }

  if (habitInfoList?.possibleHabits.length === 0) {
    return (
      <div className="mt-6 p-6 border border-zinc-800 rounded-lg text-center text-base text-zinc-400">
        <span>Nenhum hábito cadastrado para este dia</span>
      </div>
    )
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {
        habitInfoList?.possibleHabits.map(({ id, title }) => (
          <Checkbox.Root
            key={id}
            className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
            checked={habitInfoList.completedHabits.includes(id)}
            onCheckedChange={() => handleToggleHabitCompleted(id)}
            disabled={isDateInPast}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 rounded-lg group-data-[state=checked]:bg-blue-500 group-data-[state=checked]:border-0 transition-colors group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background">
              <Checkbox.Indicator>
                <Check size={20} weight="bold" />
              </Checkbox.Indicator>
            </div>

            <label className="text-xl font-semibold text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
              {title}
            </label>
          </Checkbox.Root>
        ))
      }
    </div>
  )
}