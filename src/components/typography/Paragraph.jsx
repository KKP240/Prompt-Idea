import { cn } from "@/lib/utils";

export default function Paragraph({ className, children }){
  return (
    <p className={cn(
      'text-sm text-gray-500 leading-7', 
      className
    )}>
      {children}
    </p>
  )
}