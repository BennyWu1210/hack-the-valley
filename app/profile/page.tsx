 "use client"

import React from 'react'
import { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
    Bell,
    CircleUser,
    Home,
    LineChart,
    Menu,
    Package,
    Package2,
    Search,
    ShoppingCart,
    Users,
  } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { TrendingUp } from "lucide-react"
import Nav from '@/components/nav/Nav'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { Progress } from "@/components/ui/progress"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "Communication", desktop: 186 },
  { month: "Teamwork", desktop: 305 },
  { month: "Problem-solving", desktop: 237 },
  { month: "Adaptability", desktop: 273 },
  { month: "Time Management", desktop: 209 },
  { month: "Leadership", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig


const Achievements = ({title, description, progress, level}) => {
    return (
        <Card className="w-full flex-1 p-8 flex flex-row gap-8">
            <CardContent className='p-0 flex flex-col gap-2 min-w-fit'>
                <div className="rounded-sm aspect-square bg-primary"></div>
                <CardDescription>Level {level}</CardDescription>
            </CardContent>
            <CardContent className='pb-0 flex flex-col gap-2 w-full p-0 '>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                <Progress value={(progress)*100} className="w-full" />
                <CardDescription>{progress*100}%</CardDescription>
            </CardContent>
        </Card>
    );
}

const page = () => {
    const [progress, setProgress] = React.useState(13)
 
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])
  return (
    <div>
        <div className="grid min-h-screen w-full md:grid-cols-[260px_1fr] lg:grid-cols-[320px_1fr]">
        <Nav></Nav>

        {/* Right Side */}
        <div>

            {/* Header */}
            <header className="flex w-full justify-end h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </header>


            {/* Body */}
            <div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>

                {/* Cards */}
                <div className="flex w-full gap-4">
                    <Card className='w-fit flex-1 flex gap-8 py-4 px-8'>
                        <div className="rounded-full bg-slate-100 aspect-square h-full">
                            <CircleUser className="w-full h-full aspect-square" />
                        </div>
                        <div className='flex flex-col justify-center gap-2'>
                            <CardTitle className='text-4xl'>Colin Ng</CardTitle>
                            <CardDescription>AWS Cloud Engineer</CardDescription>
                            <Separator/>
                            <div className='border rounded-sm w-fit px-4 py-1'>2540 XP</div>
                        </div>
                    </Card>


                    <Card>
                        <CardContent className="pb-0">
                            <div className='flex flex-1 flex-row min-w-[300px] items-center gap-4'>
                                {/* <div className='flex flex-col gap-2 py-4'>
                                    <CardHeader className='px-0 py-0'>Soft Skills</CardHeader>
                                    <CardDescription>       
                                        <span className="text-green-500">↑ 2%</span> Soft skill 1 ababababaa<br />
                                        <span className="text-red-500">↓ 10%</span> Soft skill 2<br />
                                        — Soft skill 1<br />
                                        <span className="text-red-500">↓ 10%</span> Soft skill 2<br />
                                        <span className="text-green-500">↑ 2%</span> Soft skill 1<br />
                                        <span className="text-red-500">↓ 10%</span> Soft skill 2
                                    </CardDescription>
                                </div> */}
                                <div className='flex-1 min-h-full'>
                                    <ChartContainer
                                    config={chartConfig}
                                    className="mx-auto h-[220px]"
                                    >
                                    <RadarChart data={chartData}>
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <PolarAngleAxis dataKey="month" />
                                        <PolarGrid />
                                        <Radar
                                        dataKey="desktop"
                                        fill="var(--color-desktop)"
                                        fillOpacity={0.6}
                                        />
                                    </RadarChart>
                                    </ChartContainer>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="profile" className="w-full flex flex-col items-start">
                    <TabsList>
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="achievements">Achievements</TabsTrigger>
                    </TabsList>

                    {/* PROFILE */}
                    <TabsContent value="profile">
                        <div className='flex flex-col mt-8 gap-8'>
                            <div className='flex gap-20'>
                                <div className="grid w-96 items-center gap-1.5">
                                <Label htmlFor="email">First Name</Label>
                                <Input className='w-72' type="email" id="email" placeholder="Colin" />
                                </div>

                                <div className="grid w-96 items-center gap-1.5">
                                <Label htmlFor="email">Last Name</Label>
                                <Input className='w-72' type="email" id="email" placeholder="Ng" />
                                </div>  
                            </div>

                            <div className="grid w-96 items-center gap-1.5">
                                <Label htmlFor="email">Goals</Label>
                                <Input className='w-72' type="email" id="email" placeholder="AWS Cloud Engineer" />
                            </div>  
                        </div>

                    </TabsContent>

                    {/* ACHIEVEMENTS */}
                    <TabsContent value="achievements" className="flex-1 w-full">
                        <div className='grid grid-cols-2 gap-4 w-full flex-1'>
                            <Achievements title="Stylish" description="Take the CSS quiz and achieve a score of 1400" level="2" progress={2/5} />
                            <Achievements title="Stylish" description="Take the CSS quiz and achieve a score of 1400" level="2" progress={2/5} />
                            <Achievements title="Stylish" description="Take the CSS quiz and achieve a score of 1400" level="2" progress={2/5} />
                            <Achievements title="Stylish" description="Take the CSS quiz and achieve a score of 1400" level="2" progress={2/5} />
                            <Achievements title="Stylish" description="Take the CSS quiz and achieve a score of 1400" level="2" progress={2/5} />
                            <Achievements title="Stylish" description="Take the CSS quiz and achieve a score of 1400" level="2" progress={2/5} />
                        </div>
                    </TabsContent>
                </Tabs>


            </div>
            </div>
        </div>
    </div>
  )
}

export default page