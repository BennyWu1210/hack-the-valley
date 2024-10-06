import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadialChart } from "@/components/RadialChart";
import DraggableList from "./DraggableList";
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react";

interface Info {
  job_title: string;
  company: string;
  job_description: string;
  salary: string;
  location: string;
  application_link: string;
  requirements: string[];
}

interface Scores {
  overallScore: number;
  contentAccuracy: number;
  creativity: number;
  organizationClarity: number;
  technicalSkills: number;
}

interface EditorSidebarProps {
  items: string[];
  setItems: (newItems: string[]) => void;
  info: Info | null;
  isLoading: boolean;
  scores: Scores;
  handleRegenerate: () => void;
}

export default function EditorSidebar({
  items,
  setItems,
  info,
  isLoading,
  scores,
  handleRegenerate
}: EditorSidebarProps) {
  const handleListUpdate = (newOrder: string[]) => {
    setItems(newOrder);
    console.log("Updated order in parent:", newOrder);
  };

  // useEffect to print info when loading is complete
  useEffect(() => {
    if (!isLoading && info) {
      console.log("Info loaded:", info);
    }
  }, [isLoading, info]);

  return (
    <div className="bg-gray-100 border w-full h-full p-10 justify-start">
      <Tabs defaultValue="info" className="min-w-full">
        <TabsList>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="evaluate">Evaluate</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <div className="pb-5 pt-2">
            {isLoading ? (
              <Skeleton className="h-5 w-1/2 mb-4 bg-slate-300" />
            ) : (
              <a href={info?.application_link} className="underline">
                <div>
                  Application Link
                  <img
                    src="/images/extLink.svg"
                    alt="link"
                    className="w-4 h-4 mb-1 inline-block ml-2"
                  />
                </div>
              </a>
            )}
          </div>

          <div className="pb-5">
            <h1>Job Title</h1>
            {isLoading ? (
              <Skeleton className="h-5 w-1/2 mb-4 bg-slate-300" />
            ) : (
              <p className="text-sm text-slate-500">{info?.job_title}</p>
            )}
          </div>

          <div className="pb-5">
            <h1>Company</h1>
            {isLoading ? (
              <Skeleton className="h-5 w-1/4 mb-4 bg-slate-300" />
            ) : (
              <p className="text-sm text-slate-500">{info?.company}</p>
            )}
          </div>

          <div className="pb-5">
            <h1>Job Description</h1>
            {isLoading ? (
              <Skeleton className="h-20 w-full mb-4 bg-slate-300" />
            ) : (
              <p className="text-sm text-slate-500">{info?.job_description}</p>
            )}
          </div>

          <div className="pb-5">
            <h1>Requirements</h1>
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-1/2 mb-4 bg-slate-300" />
                <Skeleton className="h-5 w-1/4 mb-4 bg-slate-300" />
              </>
            ) : (
              <ul className="list-disc pl-5 text-sm text-slate-500">
                {info?.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="pb-5">
            <h1>Salary</h1>
            {isLoading ? (
              <Skeleton className="h-5 w-1/4 mb-4 bg-slate-300" />
            ) : (
              <p className="text-sm text-slate-500">{info?.salary}</p>
            )}
          </div>

          <div className="pb-5">
            <h1>Location</h1>
            {isLoading ? (
              <Skeleton className="h-5 w-1/4 mb-4 bg-slate-300" />
            ) : (
              <p className="text-sm text-slate-500">{info?.location}</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="edit">
          <h1 className="mb-2 pt-2">Resume Sections</h1>
          <DraggableList items={items} setItems={handleListUpdate} />
          <Button className="mt-2" onClick={handleRegenerate}>
            <Sparkles className="mr-2 h-4 w-4" /> Regenerate
          </Button>
        </TabsContent>

        <TabsContent value="evaluate">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-2 max-w-5xl">
            {/* Top Box (larger box) */}
            <div className="col-span-1 md:col-span-2 bg-white p-3 rounded-lg shadow-lg max-h-[240px]">
              <h2 className="text-xl font-semibold text-center mb-[-5px]">
                Overall Score
              </h2>
              <RadialChart score={3} isSmall={false} />
            </div>

            {/* Small Boxes */}
            <div className="bg-white py-3 px-2 rounded-lg shadow-lg">
              <h3 className="text-sm font-semibold text-center mb-[-15px]">
                Content & Accuracy
              </h3>
              <RadialChart score={5} isSmall={true} />
              <p className="text-center mt-[-15px] text-xs text-slate-500">
                Covers material with correct, accurate information.
              </p>
            </div>
            <div className="bg-white py-3 px-2 rounded-lg shadow-lg">
              <h3 className="text-sm font-semibold text-center mb-[-15px]">
                Creativity
              </h3>
              <RadialChart score={10} isSmall={true} />
              <p className="text-center mt-[-15px] text-xs text-slate-500">
                Original ideas with unique, inventive approach.
              </p>
            </div>
            <div className="bg-white py-3 px-2 rounded-lg shadow-lg">
              <h3 className="text-sm font-semibold text-center mb-[-15px]">
                Organization & Clarity
              </h3>
              <RadialChart score={10} isSmall={true} />
              <p className="text-center mt-[-15px] text-xs text-slate-500">
                Clear structure with logical, understandable flow.
              </p>
            </div>
            <div className="bg-white py-3 px-2 rounded-lg shadow-lg">
              <h3 className="text-sm font-semibold text-center mb-[-15px]">
                Technical Skills
              </h3>
              <RadialChart score={10} isSmall={true} />
              <p className="text-center mt-[-15px] text-xs text-slate-500">
                Demonstrates strong mastery of technical skills.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
