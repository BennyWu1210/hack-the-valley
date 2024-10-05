import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadialChart } from "@/components/RadialChart"
import DraggableList from "./DraggableList";

export default function EditorSidebar() {
    const [items, setItems] = useState<string[]>(['Education', 'Experience', 'Projects', 'Skills']);

    const handleListUpdate = (newOrder: string[]) => {
        setItems(newOrder);
        console.log('Updated order in parent:', newOrder); // Log in the parent when the order changes
      };

  return (
    <div className="bg-gray-100 border w-full h-full p-10 justify-start">
        <Tabs defaultValue="info" className="min-w-full">
        <TabsList>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="evaluate">Evaluate</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
            <div>
                <div className="pb-5 pt-2">
                    <a href="#" className="underline">Website Link</a>
                </div>

                <div className="pb-5">
                    <h1>Job Title</h1>
                    <p className="text-sm text-slate-500">Senior Software Executive</p>
                </div>

                <div className="pb-5">
                    <h1>Company</h1>
                    <p className="text-sm text-slate-500">Shopify</p>
                </div>

                <div className="pb-5">
                    <h1>Job Description</h1>
                    <p className="text-sm text-slate-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in auctor risus, sit amet ultrices enim. Duis semper rutrum turpis sed tincidunt. Vestibulum sem ligula, varius at mattis quis, faucibus eget mauris. Phasellus laoreet quis sapien id molestie. Integer pretium interdum metus, sit amet egestas nibh porta ac. Vestibulum a aliquet tortor. </p>
                </div>

                <div className="pb-5">
                    <h1>Requirements</h1>
                    <ul className="list-disc pl-5 text-sm text-slate-500">
                        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                        <li>Curabitur in auctor risus, sit amet ultrices enim.</li>
                        <li>Duis semper rutrum turpis sed tincidunt.</li>
                        <li>Vestibulum sem ligula, varius at mattis quis.</li>
                        <li>Phasellus laoreet quis sapien id molestie.</li>
                        <li>Integer pretium interdum metus, sit amet egestas nibh porta ac.</li>
                        <li>Vestibulum a aliquet tortor.</li>
                    </ul>
                </div>

                <div className="pb-5">
                    <h1>Salary</h1>
                    <p className="text-sm text-slate-500">$35/hour </p>
                </div>

                <div className="pb-5">
                    <h1>Location</h1>
                    <p className="text-sm text-slate-500">2342 Street Ave </p>
                </div>

            </div>
        </TabsContent>
        <TabsContent value="edit">
            <h1 className="mb-2 pt-2">Resume Sections</h1>
            <DraggableList items={items} setItems={handleListUpdate} />
        </TabsContent>
        <TabsContent value="evaluate">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-2 max-w-5xl">
                {/* Top Box (larger box) */}
                <div className="col-span-1 md:col-span-2 bg-white p-3 rounded-lg shadow-lg max-h-[240px]">
                    <h2 className="text-xl font-semibold text-center mb-[-5px]">Overall Score</h2>
                    <RadialChart score={3} isSmall={false}/>
                </div>

                {/* Small Boxes */}
                <div className="bg-white py-3 px-2 rounded-lg shadow-lg">
                    <h3 className="text-sm font-semibold text-center mb-[-15px]">Content & Accuracy</h3>
                    <RadialChart score={5} isSmall={true}/>
                    <p className="text-center mt-[-15px] text-xs text-slate-500">
                        Covers material with correct, accurate information.
                    </p>
                </div>
                <div className="bg-white py-3 px-2 rounded-lg shadow-lg">
                    <h3 className="text-sm font-semibold text-center mb-[-15px]">Creativity</h3>
                    <RadialChart score={10} isSmall={true}/>
                    <p className="text-center mt-[-15px] text-xs text-slate-500">
                        Original ideas with unique, inventive approach.
                    </p>
                </div>
                <div className="bg-white py-3 px-2 rounded-lg shadow-lg">
                    <h3 className="text-sm font-semibold text-center mb-[-15px]">Organization & Clarity</h3>
                    <RadialChart score={10} isSmall={true}/>
                    <p className="text-center mt-[-15px] text-xs text-slate-500">
                        Clear structure with logical, understandable flow.
                    </p>
                </div>
                <div className="bg-white py-3 px-2 rounded-lg shadow-lg">
                    <h3 className="text-sm font-semibold text-center mb-[-15px]">Technical Skills</h3>
                    <RadialChart score={10} isSmall={true}/>
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
