// @ts-nocheck
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import ElegantProfile from "./ElegantProfile";


export default function UserProfilePage() {
  const history = useHistory()
  const {authMember} = useGlobals()

  if(!authMember) history.push("/");
  
  return (
    <div className={"user-profile-page"}>

      <ElegantProfile />
    </div>
  );
}

