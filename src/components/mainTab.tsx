import React, { useState } from 'react';
import UploadFile from './UploadFiles';
import Chatwindow from './chatWindow';
import ChatwindowUI from './Chatwindowui';
import Description from './projectDescription';
import Cards from './subjectContents/notecards';


interface MainTabProps {
  selectedItem: string | null;
}

const MainTab: React.FC<MainTabProps> = ({ selectedItem }) => {


  return (
    <div className='w-full'>
      {selectedItem === null ? (
        <div className='w-full'>
        <ChatwindowUI/>
      </div>
      ): selectedItem === 'chat' ? (
        <div className='w-full'>
         <ChatwindowUI/>
      </div>
      ):
      <Cards subjectName={selectedItem}/>
      }
    </div>
  );
}

export default MainTab;
