import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"

type Props = {
  className?: string
}

export function TypographyH1({
  children,
  className,
}: PropsWithChildren<Props>) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
    >
      {children}
    </h1>
  )
}
