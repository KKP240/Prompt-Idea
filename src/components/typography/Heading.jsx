import { cn } from "@/lib/utils"

const headingClasses = {
  '1': 'text-4xl',
  '2': 'text-3xl',
  '3': 'text-2xl',
  '4': 'text-xl',
  '5': 'text-lg',
  '6': 'text-base'
}

export default function Heading({ level = '1', className = '', children }){
  const HeadingEl = `h${level}`

  return (
    <HeadingEl className={cn('font-semibold', headingClasses[level], className)}>
      {children}
    </HeadingEl>
  )
}