import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function EditorSidebar() {
  return (
    <div className="bg-gray-200 border w-full h-full p-10 justify-start">
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
        <TabsContent value="edit">Edit</TabsContent>
        <TabsContent value="evaluate">Evaluate</TabsContent>
        </Tabs>
    </div>
  );
}
