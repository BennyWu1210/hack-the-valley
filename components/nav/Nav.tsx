import { Badge, Bell } from "lucide-react";
import { Button } from "@/components/ui/button"
import Link from "next/link";

import { Kodchasan } from 'next/font/google';
import { usePathname } from "next/navigation";
const kodchasan = Kodchasan({
  weight: '600',
  subsets: ['latin']
});


const defaultStyling = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
const activeStyling = "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
const links = [
  { name: "Resume", path: "/" }, 
  { name: "Self Assessment", path: "/self-assessment" }, 
  { name: "Peer Resume Grader", path: "/peer-resume-grader"}, 
  { name: "Master Resume", path: "/master-resume"}, 
  { name: "Profile", path: "/profile"}]

export default function Nav() {
  const path = usePathname();
  return <div className="hidden border-r bg-muted/40 md:block">
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className={`"text-primary font-semibold text-3xl ${kodchasan.className}`}>RESUMATOR</span>
        </Link>
        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {links.map((link, index) => <Link key={index} href={link.path} className={link.path === path ? activeStyling : defaultStyling}>{link.name}</Link>)}
        </nav>
      </div>
    </div>
  </div>
}