"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Resume } from '@/utils/schema/ResumeSchema';

interface User {
  id: string;
  name: string;
  email: string;
  goal: string;
}

interface GlobalContextType {
  user: User | null;
  setUser: (user: User) => void;
  resumeList: Resume[];
  setResumeList: (resumes: Resume[]) => void;
  achievements: string[];
  setAchievements: (achievements: string[]) => void;
  masterResumeText: string;
  setMasterResumeText: (text: string) => void;
  masterResume: File | null;
  setMasterResume: (file: File) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [resumeList, setResumeList] = useState<Resume[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [masterResume, setMasterResume] = useState<File | null>(null);
  const [masterResumeText, setMasterResumeText] = useState<string>("");
  

  return (
    <GlobalContext.Provider value={{ user, setUser, resumeList, setResumeList, achievements, setAchievements, masterResume, setMasterResume, masterResumeText, setMasterResumeText }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};