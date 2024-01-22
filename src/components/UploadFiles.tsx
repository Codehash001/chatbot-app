// pages/index.tsx

import React, { useEffect, useState } from 'react';
import UploadButton from '@/components/UploadButton';
import axios from "axios";
import Description from './projectDescription';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link, Select, SelectItem} from "@nextui-org/react";
import AddnewSub from './addNewSub';
import { supabase } from '@/utils/supabase-client';
// import { useUser } from '@clerk/nextjs';

interface Props {
    dirs: string[];
    files : string [];
  }

const UploadFile: React.FC = () => {

    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');


    const [subjectsData, setSubjectsData] = useState<any[]>([]);
    
    useEffect(() => {
      const fetchSubjects = async () => {
        try {
          const { data, error } = await supabase
            .from('subs')
            .select('*')
            // .eq('user_id', user?.id);
  
          if (error) {
            throw error;
          }
  
          setSubjectsData(data);
        } catch (error) {
          console.error('Error fetching subjects:', error);
        }
      };
  
      // Set up Supabase real-time subscription
      const subjectsChannel = supabase.channel('subjects');
  
      subjectsChannel
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'subjects' }, fetchSubjects)
        .subscribe();
  
      // Fetch initial subjects
      fetchSubjects();
  
    });



    const handleFileSelection = (files: FileList) => {
        const newFiles = Array.from(files);
        setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...newFiles]);
        setSelectedDocs((prevSelectedDocs) => [
          ...prevSelectedDocs,
          ...newFiles.map((file) => file.name),
        ]);
      };

      const handleFileDelete = (index: number) => {
        setSelectedDocs((prevSelectedDocs) => {
          const updatedSelectedDocs = [...prevSelectedDocs];
          updatedSelectedDocs.splice(index, 1);
          return updatedSelectedDocs;
        });
        setSelectedFiles((prevSelectedFiles) => {
          const updatedSelectedFiles = [...prevSelectedFiles];
          updatedSelectedFiles.splice(index, 1);
          return updatedSelectedFiles;
        });
      };

      const handleUploadFiles = async () => {
        console.log(selectedSubjectName)
        try {
          if (selectedFiles.length === 0) return;
          // console.log(selectedFiles[0].name)
          const formData = new FormData();
          selectedFiles.forEach((file) => {
            formData.append("myImages", file);
          });
          const { data } = await axios.post("/api/upload", formData);
          console.log(data);
          console.log('Sucessfully uploaded!')
        } catch (error: any) {
          console.log(error.response?.data);
          console.log('Failed to upload files -_-')
        }
      };

        const ClearLocalDir = async () => {
    try {
      const response = await fetch('/api/deleteTempFiles', {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        console.error('Failed to delete files');
      }
    } catch (error) {
      console.error('Error deleting files:', error);
    }
  };


      const [response, setResponse] = useState('');
      const [selectedSubjectName, setSelectedSubjectName] = useState('');
      
      const handleSelectionChange = (e: any) => {
        setSelectedSubjectName(e.target.value);
      };


      const handleIngest =async () => {
          try {
            const response = await fetch("/api/ingest");
            const data = await response.json();
            console.log('sucessfully ingested your data!' , data);
          } catch (error) {
            console.error("Error inserting data: ", error);
            return;
          }
        };

        const handleInsertNotes = async () => {

      
          try {

            const fileNameFixed = selectedFiles[0].name.replace(/ /g, '_');
      
            const { data, error } = await supabase.from('notes').insert([
              {
                notename:name,
                description: description,
                document_name : fileNameFixed,
                subjectname : selectedSubjectName
                
              },
            ]);
      
            if (error) {
              throw error;
            }
      
            console.log('note inserted successfully:', data);
          } catch (error) {
            console.error('Error inserting notes:', error);
          }
        };
      

        const {isOpen, onOpen, onOpenChange} = useDisclosure();
        const [isCreating , setIsCreating] = useState(false);

        const handleClickCreate = async () => {
          setIsCreating(true);
          try {
              await ClearLocalDir();
              await handleUploadFiles();
              await handleInsertNotes();
              setIsCreating(false);
              await handleIngest();
          } catch (error) {
              console.error('Error during the creation process:', error);
          } finally {
              setIsCreating(false);
          }
      };

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      {/* <Description/> */}

      {/* model */}
      <>
     <Button fullWidth onPress={onOpen} radius="sm" className='bg-black text-white'>
         <h1 className="text-lg font-semibold">Create a new Note</h1>
      </Button> 
      <Modal 
        isOpen={isOpen} 
        size='2xl'
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
              <ModalHeader className="flex flex-col gap-1">Upload a new note</ModalHeader>
              <ModalBody>
              <Select
      isRequired
      label="select subject that you need to add the note"
      placeholder="Select a subject"
      defaultSelectedKeys={[selectedSubjectName]}
      className="max-w-xs"
      onChange={handleSelectionChange}
      
      // 
      
    >
      {subjectsData.map((subject , index) => (
        <SelectItem key={subject.name} value={(subject.sname)}>
          {subject.name}
        </SelectItem>
      ))}
    </Select>
                <Input
                  autoFocus
                //   endContent={
                //     <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                //   }
                  label="Note Name"
                  placeholder="Enter note name"
                  variant="bordered"
                  value={name} onChange={(e) => setName(e.target.value)}
                />
                <Input
                //   endContent={
                //     <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                //   }
                  label="Note description"
                  placeholder="Enter description"
                  variant="bordered"
                  value={description} onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex py-2 px-1 justify-between">
                <label>
        <input
          type="file"
          multiple = {false}
          hidden
          onChange={({ target }) => handleFileSelection(target.files as FileList)}
        />
      </label>

      <div className=" overflow-auto px-1 flex items-center border justify-between w-full">
        {selectedDocs.length > 0 ? (
            selectedDocs.map(( filename , index) => (
              <div className="rounded-md filter drop-shadow-sm p-5 flex justify-between items-center space-x-3 text-sm" key={index}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-blue-400"><path d="M19.903 8.586a.997.997 0 0 0-.196-.293l-6-6a.997.997 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a.991.991 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a.952.952 0 0 0-.051-.259c-.01-.032-.019-.063-.033-.093zM16.586 8H14V5.414L16.586 8zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10H6z"></path><path d="M8 12h8v2H8zm0 4h8v2H8zm0-8h2v2H8z"></path></svg>
                  {filename}
                <button onClick={() => handleFileDelete(index)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-gray-400"><path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm10.618-3L15 2H9L7.382 4H3v2h18V4z"></path></svg>
                </button>
              </div>
            ))
          ) : (
            <span className="mx-1">No files are selected</span>
          )}
                    <button
  onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
  className="bg-blue-600 p-3 w-32 text-center rounded text-white flex justify-center items-center"
>
  <span>Select Files</span>
</button>

          </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onClick={handleClickCreate}>
                  {isCreating? 'Creating' : 'Create'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>

{/* <button
          onClick={handleUploadFiles}
          disabled={selectedFiles.length === 0}
          className="bg-black p-3 w-32 text-center rounded text-white flex justify-center items-center"
        >
          Upload
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-white"><path d="M18.944 11.112C18.507 7.67 15.56 5 12 5 9.244 5 6.85 6.611 5.757 9.15 3.609 9.792 2 11.82 2 14c0 2.757 2.243 5 5 5h11c2.206 0 4-1.794 4-4a4.01 4.01 0 0 0-3.056-3.888zM13 14v3h-2v-3H8l4-5 4 5h-3z"></path></svg>
        </button> */}
    </div>
  );
};

export default UploadFile;
