"use client";

import React from "react";
import {User, Link , Button} from "@nextui-org/react";


function UserName(){

  // const { isLoaded, isSignedIn, user } = useUser();

  // console.log(user)
 
  // if (!isLoaded || !isSignedIn) {
  //   return null;
  // }
    return(
      <>
      {/* <div className="flex space-x-2 items-center">
            <UserButton afterSignOutUrl="/"/>
            <div className="flex flex-col">
              <h1>Welcome again <span className="font-semibold">{'user.firstName'}!</span></h1>
              <h4 className="text-xs text-blue-500">{'user.primaryEmailAddress?.emailAddress'}</h4>
            </div>
            </div> */}
            </>

    )
}


function LogOutuser(){
    return(
        <Button color="primary" variant="ghost" fullWidth>
        LogOut
      </Button> 
    )

}

export { UserName , LogOutuser}