// @ts-nocheck
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import ElegantOrdersPage from "./ElegantOrdersPage";
import VerticalMovingBasket from "../../../mui-coffee/components/VerticalMovingBasket";

export default function OrdersPage() {
  const history = useHistory();
  const { authMember } = useGlobals();

  if(!authMember) history.push("/");

  return (
    <div className={"orders-page"}>
      <VerticalMovingBasket itemCount={1} />
      <ElegantOrdersPage />
    </div>
  );
}