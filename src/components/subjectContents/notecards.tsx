import React, { useEffect, useState } from "react";
import {Card, CardHeader, CardBody, Image, ScrollShadow} from "@nextui-org/react";
import { supabase } from "@/utils/supabase-client";

export default function Cards(subjectName:any) {

  const [notesData, setNotesData] = useState<any[]>([]);
  const [isLoading , setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchNotes = async () => {
      try {
        const { data, error } = await supabase.from("notes").select("*")
        .eq('subjectname', subjectName.subjectName);

        if (error) {
          throw error;
        }

        setNotesData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    // Set up Supabase real-time subscription
    const subjectsChannel = supabase.channel("notes");

    subjectsChannel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notes" },
        fetchNotes
      )
      .subscribe();

    // Fetch initial subjects
    fetchNotes();
    setIsLoading(false);
  }, [subjectName]);

    
  return (
    <div className="w-full h-full p-5">
    <h1 className="text-center font-bold text-3xl">{subjectName.subjectName}</h1>
    <ScrollShadow hideScrollBar  className="h-[600px] grid grid-cols-3 p-5 items-start justify-start">
      {notesData && notesData.map((note : any , index:number) => (
                    <Card className="p-4 m-2" key={index}>
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                      <h1 className="font-bold text-lg">{note.notename}</h1>
                      <small className="text-default-500">{note.description}</small>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                    <h4 className="font-medium">{note.document_name}</h4>
                    </CardBody>
                  </Card>
      ))}

    </ScrollShadow>
    </div>

  );
}
