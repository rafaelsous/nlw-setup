interface ProgressBarProps {
  progress: number
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div
      className="h-3 mt-4 bg-zinc-700 rounded-xl"
      role="progressbar"
      aria-label="Progresso de hábitos completados nesse dia"
      aria-valuenow={progress}
    >
      <div
        className="h-3 bg-violet-600 rounded-xl transition-all"
        style={{ width: `${progress}%` }}  
      />
    </div>
  )
}