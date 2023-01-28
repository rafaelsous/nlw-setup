import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated'
import colors from 'tailwindcss/colors';
import clsx from 'clsx';

interface CheckboxProps extends TouchableOpacityProps {
  title: string
  checked?: boolean
}

export function Checkbox({ checked = false, title, ...rest }: CheckboxProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-row items-center gap-3 py-2"
      {...rest}
    >
      <Animated.View 
        className={clsx('w-8 h-8 transition-colors', {
          'bg-zinc-900 border-2 border-zinc-800 rounded-lg': !checked,
          'items-center justify-center bg-blue-500 rounded-lg': checked
        })}
        entering={ZoomIn}
        exiting={ZoomOut}
      >
        {checked && <Feather name="check" size={20} color={colors.white} />}
      </Animated.View>

      <Text className="text-base text-white font-semibold leading-tight">
        {title}
      </Text>
    </TouchableOpacity>
  )
}