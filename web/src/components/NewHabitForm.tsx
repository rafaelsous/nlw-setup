import { FormEvent, useState } from 'react'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'phosphor-react'

import clsx from 'clsx'
import { api } from '../lib/axios'

const availableWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]

export function NewHabitForm() {
  const [title, setTitle] = useState('')
  const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>([])
  
  const isInvalidData = !title || title.trim().length === 0 || selectedWeekDays.length === 0

  async function createNewHabit(event: FormEvent) {
    event.preventDefault()

    if (isInvalidData) {
      return
    }

    await api.post('habits', {
      title,
      weekDays: selectedWeekDays
    })

    setTitle('')
    setSelectedWeekDays([])

    alert('Hábito criado com sucesso!')
  }

  function handleToggleSelectedWeekDay(weekDayIndex: number) {
    if (selectedWeekDays.includes(weekDayIndex)) {
      setSelectedWeekDays(selectedWeekDays.filter(weekDay => weekDay !== weekDayIndex))
    } else {
      setSelectedWeekDays(oldValue => [...oldValue, weekDayIndex])
    }
  }

  return (
    <form 
      onSubmit={createNewHabit}
      className="w-full mt-6 flex flex-col"
    >
      <label
        htmlFor="title"
        className="font-semibold leading-tight"
      >
        Qual seu comprometimento?
      </label>

      <input
        type="text"
        id="title"
        placeholder="Exercício, dormir bem, etc..."
        autoFocus
        className="mt-3 bg-zinc-800 p-4 rounded-lg text-white border-2 border-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
        value={title}
        onChange={event => setTitle(event.target.value)}
      />

      <label
        htmlFor="title"
        className="mt-4 font-semibold leading-tight"
      >
        Qual a recorrência?
      </label>

      <div className="mt-3 flex flex-col gap-2">
        {availableWeekDays.map((weekDay, index) => (
          <Checkbox.Root
            key={weekDay}
            className="flex items-center gap-3 group focus:outline-none"
            onCheckedChange={() => handleToggleSelectedWeekDay(index)}
            checked={selectedWeekDays.includes(index)}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 rounded-lg group-data-[state=checked]:bg-blue-500 group-data-[state=checked]:border-0 transition-colors group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background">
              <Checkbox.Indicator>
                <Check size={20} weight="bold" />
              </Checkbox.Indicator>
            </div>

            <label className="text-base font-semibold text-white leading-tight">
              {weekDay}
            </label>
          </Checkbox.Root>
        ))}
      </div>

      <button
        type="submit"
        className={clsx('mt-6 p-4 flex items-center justify-center gap-3 bg-blue-600 rounded-lg text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-zinc-900', {
          'hover:bg-blue-500': !isInvalidData,
          'brightness-50 cursor-not-allowed': isInvalidData
        })}
        disabled={isInvalidData}
      >
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  )
}