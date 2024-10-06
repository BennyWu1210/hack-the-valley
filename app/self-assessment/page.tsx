"use client";

import Link from "next/link"
import {
  CircleUser,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { useState } from "react";
import { Resume } from "@/utils/schema/ResumeSchema";
import CardWithButton from "@/components/cards/Card";
import Nav from "@/components/nav/Nav";
import Hamburger from "@/components/nav/Hamburger";

export const description =
  "Resume Dashbaord"

const quizData = [
  {
    heading: "Python Basics",
    description: "A beginner-friendly quiz to test your Python fundamentals.",
    buttonText: "Take Quiz"
  },
  {
    heading: "JavaScript Essentials",
    description: "Test your knowledge of JavaScript core concepts and syntax.",
    buttonText: "Take Quiz"
  },
  {
    heading: "Java Fundamentals",
    description: "Dive into Java basics with this introductory quiz.",
    buttonText: "Take Quiz"
  },
  {
    heading: "C++ Introduction",
    description: "Challenge yourself with the basics of C++.",
    buttonText: "Take Quiz"
  },
  {
    heading: "HTML Basics",
    description: "Explore the structure of web pages with this HTML quiz.",
    buttonText: "Take Quiz"
  },
  {
    heading: "CSS for Beginners",
    description: "Learn how CSS styles the web with this simple quiz.",
    buttonText: "Take Quiz"
  },
  {
    heading: "SQL Fundamentals",
    description: "Test your SQL skills with queries in this quiz.",
    buttonText: "Take Quiz"
  },
  {
    heading: "Python Advanced",
    description: "Take on more challenging Python topics in this quiz.",
    buttonText: "Take Quiz"
  },
  {
    heading: "React Basics",
    description: "Get started with React by testing your understanding of components and state.",
    buttonText: "Take Quiz"
  }
];



export default function Dashboard() {
  const [resumeList, setResumeList] = useState<Resume[]>([]); // should be global context later????

  const addNewResume = (newItem: Resume) => {
    setResumeList(prev => [...prev, newItem]);
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[260px_1fr] lg:grid-cols-[320px_1fr]">
      <Nav />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Hamburger />
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
        <main className="flex flex-1 flex-col gap-8 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Self-Assessment</h1>
          </div>
          <div
            className="flex flex-1 p-8 rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
          >
            <div className="w-full grid grid-cols-3">
            {quizData.map((quiz, index) => <CardWithButton key={index} {...quiz} />)}
            </div>
            
          </div>
        </main>
      </div>
    </div>
  )
}
