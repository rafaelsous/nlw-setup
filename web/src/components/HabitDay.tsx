import * as Popover from '@radix-ui/react-popover'
import dayjs from 'dayjs'
import clsx from 'clsx'

import { ProgressBar } from './ProgressBar'
import { HabitList } from './HabitList';
import { useState } from 'react';

interface HabitDayProps {
  date: Date;
  defaultCompleted?: number;
  amount?: number;
}

export function HabitDay({ defaultCompleted = 0, amount = 0, date }: HabitDayProps) {
  const [completed, setCompleted] = useState<number>(defaultCompleted)

  const completedPercentage = amount > 0 ? Math.round((completed / amount) * 100) : 0

  const today = dayjs().startOf('day').toDate()
  const parsedDate = dayjs(date)
  const weekDay = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM')
  const isCurrentDate = dayjs(date).isSame(today)

  function handleCompletedChanged(amountCompleted: number) {
    setCompleted(amountCompleted)
  }

  return (
    <Popover.Root>
      <Popover.Trigger className={clsx('w-10 h-10 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background', {
        'bg-zinc-900 border-zinc-800': completedPercentage === 0,
        'bg-violet-900 border-violet-700': completedPercentage > 0 && completedPercentage < 20,
        'bg-violet-800 border-violet-600': completedPercentage >= 20 && completedPercentage < 40,
        'bg-violet-700 border-violet-500': completedPercentage >= 40 && completedPercentage < 60,
        'bg-violet-600 border-violet-500': completedPercentage >= 60 && completedPercentage < 80,
        'bg-violet-500 border-violet-400': completedPercentage >= 80,
        'border-4 border-white': isCurrentDate
      })} />

      <Popover.Portal>
        <Popover.Content className="min-w-[380px] p-6 flex flex-col rounded-2xl bg-zinc-900">
          <Popover.Arrow width={16} height={8} className="fill-zinc-900" />

          <span className="text-zinc-400 font-semibold">
            {weekDay}
          </span>
          <span className="mt-1 text-3xl leading-tight font-extrabold">
            {dayAndMonth}
          </span>

          <ProgressBar progress={completedPercentage} />

          <HabitList date={date} onChangeCompletedHabits={handleCompletedChanged} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}