import { Accordion, AccordionItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { ScrollShadow } from "@nextui-org/react";
import { supabase } from "@/utils/supabase-client";
// import { useUser } from "@clerk/nextjs";

interface SubjectListAccordionProps {
  onItemClick: (itemName: string) => void;
}

export default function SubjectListAccordion({
  onItemClick,
}: SubjectListAccordionProps) {
  // const { isLoaded, isSignedIn, user } = useUser();
  const handleItemClick = (itemName: any) => {
    // Notify the parent component about the selected item
    onItemClick(itemName);
  };

  const [subjectsData, setSubjectsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data, error } = await supabase.from("subs").select("*");

        if (error) {
          throw error;
        }

        setSubjectsData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    // Set up Supabase real-time subscription
    const subjectsChannel = supabase.channel("subs");

    subjectsChannel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subs" },
        fetchSubjects
      )
      .subscribe();

    // Fetch initial subjects
    fetchSubjects();
  }, []);
  return (
    <div className="space-y-2 rounded-md pb-2">
      <Accordion
        variant="light"
        className="bg-gray-200"
        defaultExpandedKeys={["1"]}
      >
        <AccordionItem key="1" aria-label="Subjects" title="Subjects">
          <ScrollShadow
            hideScrollBar
            className="h-[350px] space-y-2 bg-transparent pl-4"
          >
            <Accordion variant="light">
              {subjectsData ? (
                subjectsData.map((subject: any, index: number) => (
                  <AccordionItem
                    key={subject.subjectid.toString()}
                    aria-label={`Accordion ${index + 1}`}
                    title={`${subject.name}`}
                  >
                    <h1
                      onClick={() => handleItemClick(subject.name)}
                      className="cursor-pointer hover:font-semibold"
                    >
                      {subject.description}
                    </h1>
                  </AccordionItem>
                ))
              ) : (
                <></>
              )}
            </Accordion>
          </ScrollShadow>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
