import  React,{ ReactNode, useState, useCallback, useEffect } from "react";
import Cookies from "universal-cookie"
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";


const ContextProvider: React.FC<{children: ReactNode}> = ({children})=>{
const [authMember, setAuthMemberState] = useState<Member | null>(null);
const [orderBuilder, setOrderBuilder] = useState<Date>(new Date())



// Initialize auth state from localStorage and cookies
useEffect(() => {
  const cookies = new Cookies();
  const memberData = localStorage.getItem("memberData");
  const accessToken = cookies.get("accessToken");
  
  if (memberData) {
    try {
      const member = JSON.parse(memberData);
      setAuthMemberState(member);
    } catch (error) {
      console.error("Error parsing member data:", error);
      localStorage.removeItem("memberData");
      setAuthMemberState(null);
    }
  } else if (!accessToken) {
    // Only clear if there's no member data AND no access token
    setAuthMemberState(null);
  }
}, []);

// Wrapper function to ensure proper state updates
const setAuthMember = useCallback((member: Member | null) => {
  // Update localStorage when auth state changes
  if (member) {
    localStorage.setItem("memberData", JSON.stringify(member));
  } else {
    localStorage.removeItem("memberData");
  }
  
  // Force state update to trigger re-renders
  setAuthMemberState(member);
}, []);

return (<GlobalContext.Provider value ={{authMember,setAuthMember, orderBuilder, setOrderBuilder}}>
    {children}
</GlobalContext.Provider>)

};

export default ContextProvider;