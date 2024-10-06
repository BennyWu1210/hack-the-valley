import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CardWithButton({heading, description, buttonText}: {heading: string, description: string, buttonText: string}) {
  return (
    <Card className="w-[340px] h-[180px]">
      <CardHeader>
        <CardTitle className="text-2xl">{heading}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>{buttonText}</Button>
      </CardContent>

    </Card>
  )
}
