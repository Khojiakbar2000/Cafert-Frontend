import axios from "axios";
import { serverApi } from "../../lib/config";
import { LoginInput, Member, MemberInput, MemberUpdateInput } from "../../lib/types/member";


class MemberService {
    private readonly path: string;

    constructor() {
        this.path = serverApi;
    }
    public async getTopUsers():Promise<Member[]>{
        
try{
    //const url = this.path + "/member/top-users";
    const url = `${this.path.replace(/\/$/, "")}/member/top-users`;

    const result = await axios.get(url);
    return result.data;
}catch(err){
    if (process.env.NODE_ENV === 'development') {
        console.error("Error, getTopUsers:", err);
    }
    throw err;
}
    }





    public async getRestaurant(productId: string): Promise<Member>{
        try{
         const url = this.path + "member/restaurant";
         
         const result = await axios.get(url);
         return result.data;
        }catch(err){
        if (process.env.NODE_ENV === 'development') {
            console.error("Error, getRestaurant:", err);
        }
        throw err;
        }
    }
        public async signup(input: MemberInput): Promise<Member>{
        try{
            const url = this.path + "member/signup";

         const result = await axios.post(url, input, {withCredentials: true})
         const member: Member= result.data.member;
         localStorage.setItem("memberData", JSON.stringify(member))
         return member;
        }catch(err){
            if (process.env.NODE_ENV === 'development') {
                console.error("Error,signup:", err);
            }
        throw err;

        }
        }




        public async login(input: LoginInput): Promise<Member>{
            try{
                const url = this.path + "member/login";
    
             const result = await axios.post(url, input, {withCredentials: true})
             const member: Member= result.data.member;
             localStorage.setItem("memberData", JSON.stringify(member))
             return member;
            }catch(err){
                if (process.env.NODE_ENV === 'development') {
                    console.error("Error, login:", err);
                }
            throw err;
    
            }
        }




           






    public async logout(): Promise<void>{
        try{
            const url = this.path + "member/logout";
    
         const result = await axios.post(url, {}, {withCredentials: true})
         localStorage.removeItem("memberData")
         return result.data.logout;
        }catch(err){
            if (process.env.NODE_ENV === 'development') {
                console.error("Error, logout:", err);
            }
        throw err;
    
        }
    }

    public async updateMember(input: MemberUpdateInput): Promise<Member>{
        try{
         const formData = new FormData();
         formData.append("memberNick", input.memberNick || "");
         formData.append("memberPhone", input.memberPhone || "");
         formData.append("memberAddress", input.memberAddress || "");
         formData.append("memberDesc", input.memberDesc|| "");
         formData.append("memberImage", input.memberImage || "");
       

         const result = await axios(`${serverApi}member/update`, {
            method: "POST",
            data: formData,
            withCredentials:true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
         })

         const member: Member = result.data;
         localStorage.setItem("memberData",JSON.stringify(member) )
         return member;
        }catch(err){
            if (process.env.NODE_ENV === 'development') {
                console.error("Error,updateMember:", err);
            }
        throw err;

        }
    }
}

export default MemberService