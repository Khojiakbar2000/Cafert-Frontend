// @ts-nocheck
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import ElegantProfile from "./ElegantProfile";
import VerticalMovingBasket from "../../../mui-coffee/components/VerticalMovingBasket";

export default function UserPage() {
  const history = useHistory()
  const {authMember} = useGlobals()

  if(!authMember) history.push("/");
  
  return (
    <div className={"user-page"}>
      <VerticalMovingBasket itemCount={1} />
      <ElegantProfile />
    </div>
  );
}

