import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DraggableList from "./DraggableList";

interface EditorSidebarProps {
  items: string[];
  setItems: (newOrder: string[]) => void;
}

export default function EditorSidebar({ items, setItems }: EditorSidebarProps) {
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
          {/* Info tab content */}
        </TabsContent>
        <TabsContent value="edit">
          <h1 className="mb-2 pt-2">Resume Sections</h1>
          <DraggableList items={items} setItems={handleListUpdate} />
        </TabsContent>
        <TabsContent value="evaluate">
          {/* Evaluate tab content */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
