interface SubjectListAccordionProps {
    onItemClick: (itemName: string) => void;
  } 

export default function ChatSideItem({ onItemClick }: SubjectListAccordionProps){
    const handleItemClick = (itemName: any) => {
        // Notify the parent component about the selected item
        onItemClick(itemName);
      };

      return(
    <div className='px-6 py-3 rounded-md bg-gray-200 w-full flex' onClick={() => handleItemClick("Chat")}>
        Chat
    </div>
      )
    }