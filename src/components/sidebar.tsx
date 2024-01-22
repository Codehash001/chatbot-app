import AddnewSub from "./addNewSub";
import SubjectListAccordion from "./subjectListAccordion";
import { ThemeSwitcher } from "./themeSwitcher";
import {UserName ,LogOutuser }from "./userName";
import Home from "./Home";
import ChatSideItem from "./chatSideItem";
import {Divider} from "@nextui-org/react";
import UploadFile from "./UploadFiles";

interface SideBarProps {
    setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
  }

export default function SideBar({ setSelectedItem }: SideBarProps){

    const handleItemClick = (itemName: any) => {
        setSelectedItem(itemName);
      };


    return(
        <div className="w-full h-full space-y-5 flex flex-col relative">
            {/* <div className='px-6 py-3 rounded-md w-full flex bg-slate-200'>
                <UserName/>
            </div> */}
        <div className="cursor-pointer">
            <Home onItemClick={handleItemClick}/>
        </div>
        <div className="px-4 rounded-md bg-gray-200 w-full">
            <SubjectListAccordion onItemClick={handleItemClick}/>
        </div>

        <div className="absolute bottom-2 w-full space-y-3">
            <Divider className="mb-4"/>
            <AddnewSub/>
            <UploadFile/>
        </div>

        {/* <ThemeSwitcher/> */}

        </div>
    )
}