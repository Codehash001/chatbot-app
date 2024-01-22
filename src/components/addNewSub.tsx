import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import { PlusIcon } from "./Plusicon";
import axios from "axios";
import { supabase } from "@/utils/supabase-client";
// import { useUser } from "@clerk/nextjs";

export default function AddnewSub() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isInserting , setIsInserting] = useState(false)

  


  const handleInsertData = async () => {

    try {

      const { data, error } = await supabase.from('subs').upsert([
        {
          name,
          description,
          // user_id: user?.id
        },
      ]);

      if (error) {
        throw error;
      }

      console.log('Subject inserted successfully:', data);
    } catch (error) {
      console.error('Error inserting subject:', error);
    }
  };

  const handleSubmit =async () => {
    setIsInserting(true);
    await handleInsertData();
    setIsInserting(false);
  }

  return (
    <>
     {!isInserting ? (<Button className="bg-transparent border-2 border-black" onPress={onOpen} endContent={<PlusIcon/>} fullWidth radius="sm">
         <h1 className="text-lg font-semibold">Add new subject</h1>
      </Button> 
      ):(
      <Button color="primary" isLoading fullWidth radius="sm">
        <h1 className="text-lg font-semibold">Adding Subject...</h1>
      </Button>
      )}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
        motionProps={{
            variants: {
              enter: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              },
              exit: {
                y: -20,
                opacity: 0,
                transition: {
                  duration: 0.2,
                  ease: "easeIn",
                },
              },
            }
          }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create New Subject</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                //   endContent={
                //     <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                //   }
                  label="Subject Name"
                  placeholder="Enter subject name"
                  variant="bordered"
                  value={name} onChange={(e) => setName(e.target.value)}
                />
                <Input
                //   endContent={
                //     <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                //   }
                  label="description"
                  placeholder="Enter description"
                  variant="bordered"
                  value={description} onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex py-2 px-1 justify-between">
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onClick={handleSubmit} onPress={onClose}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
