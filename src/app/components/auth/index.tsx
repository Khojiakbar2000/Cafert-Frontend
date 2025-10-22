import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import { Fab, Stack, TextField, useTheme } from "@mui/material";
import styled from "styled-components";
import LoginIcon from "@mui/icons-material/Login";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import PostSignupNavigation from "../PostSignupNavigation";
import { useTheme as useCoffeeTheme } from "../../../mui-coffee/context/ThemeContext";

const ModalImg = styled.img`
  width: 62%;
  height: 100%;
  border-radius: 10px;
  background: #000;
  margin-top: 9px;
  margin-left: 10px;
`;

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const [memberNick, setMemberNick]= useState<string>("");
  const [memberPhone, setMemberPhone]=useState<string>("");
  const [memberPassword, setMemberPassword]=useState<string>("");
  const [showPostSignupNav, setShowPostSignupNav] = useState<boolean>(false);
  const {setAuthMember}=useGlobals()
  const theme = useTheme();
  const { isDarkMode, colors } = useCoffeeTheme();

  /** HANDLERS **/
  const handleUserName=(e:T)=>{
    setMemberNick(e.target.value)
    
  }

  const handlePhone=(e:T)=>{
    setMemberPhone(e.target.value)
    
  }
  const handlePasswordKeyDown = (e: T)=>{
    if(e.key==="Enter" && signupOpen){
      handleSignupRequest().then();

    }else if(e.key === "Enter" && loginOpen){
    handleLoginRequest().then();
    }

  }
  

  const handlePassword=(e:T)=>{
    setMemberPassword(e.target.value)
    
  }

  const handleSignupRequest =async ()=>{
    try{
      const isFulfill = memberNick !== "" && memberPhone !== "" && memberPassword !=="";
      if(!isFulfill) throw new Error(Messages.error3)

        const signupInput: MemberInput = {
          memberNick: memberNick,
          memberPhone: memberPhone,
          memberPassword: memberPassword,

        };

        const member = new MemberService()
        const result = await member.signup(signupInput);
        
        //Saving Authenticated user
        setAuthMember(result)
        handleSignupClose();
        setShowPostSignupNav(true);
    }catch(err){
     handleSignupClose()
     sweetErrorHandling(err).then()
    }
  }

  const handlePostSignupClose = () => {
    setShowPostSignupNav(false);
  }

  const handleLoginRequest =async ()=>{
    try{
      
      const isFulfill = memberNick !== ""  && memberPassword !=="";
      if(!isFulfill) throw new Error(Messages.error3)

        const loginInput: LoginInput = {
          memberNick: memberNick,
          memberPassword: memberPassword,

        };

        const member = new MemberService()
        const result = await member.login(loginInput);

         //Saving Authenticated user
         setAuthMember(result)
        handleLoginClose();
    }catch(err){
     handleLoginClose()
     sweetErrorHandling(err).then()
    }
  }


  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={signupOpen}
        onClose={handleSignupClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: {
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Fade in={signupOpen}>
          <Stack
            sx={{
              width: "800px",
              backgroundColor: "#ffffff",
              border: "2px solid #000",
              boxShadow: "5px 5px 10px rgba(0,0,0,0.5)",
              padding: "10px 10px 10px",
              color: "#000000",
            }}
            direction={"row"}
          >
            <ModalImg src={"/img/coffee/coffee-placeholder.jpg"} alt="coffee" />
            <Stack sx={{ marginLeft: "69px", alignItems: "center" }}>
              <h2 style={{ color: "#000000" }}>Signup Form</h2>
              <TextField
                sx={{ 
                  marginTop: "7px",
                  "& .MuiOutlinedInput-root": {
                    color: "#000000",
                    backgroundColor: "#ffffff",
                    "& fieldset": {
                      borderColor: "#000000",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#666666",
                    "&.Mui-focused": {
                      color: "#1976d2",
                    },
                  },
                }}
                id="outlined-basic"
                label="username"
                variant="outlined"
                onChange={handleUserName}
              />
              <TextField
                sx={{ 
                  my: "17px",
                  "& .MuiOutlinedInput-root": {
                    color: "#000000",
                    backgroundColor: "#ffffff",
                    "& fieldset": {
                      borderColor: "#000000",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#666666",
                    "&.Mui-focused": {
                      color: "#1976d2",
                    },
                  },
                }}
                id="outlined-basic"
                label="phone number"
                variant="outlined"
                onChange={handlePhone}
              />
              <TextField
                sx={{ 
                  "& .MuiOutlinedInput-root": {
                    color: "#000000",
                    backgroundColor: "#ffffff",
                    "& fieldset": {
                      borderColor: "#000000",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#666666",
                    "&.Mui-focused": {
                      color: "#1976d2",
                    },
                  },
                }}
                id="outlined-basic"
                label="password"
                variant="outlined"
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
              />
              <Fab
                sx={{ 
                  marginTop: "30px", 
                  width: "120px",
                  backgroundColor: "#1976d2",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
                variant="extended"
                onClick={handleSignupRequest}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Signup
              </Fab>
            </Stack>
          </Stack>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={loginOpen}
        onClose={handleLoginClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: {
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Fade in={loginOpen}>
          <Stack
            sx={{
              width: "700px",
              backgroundColor: "#ffffff",
              border: "2px solid #000",
              boxShadow: "5px 5px 10px rgba(0,0,0,0.5)",
              padding: "10px 10px 10px",
              color: "#000000",
            }}
            direction={"row"}
          >
            <ModalImg src={"/img/coffee/coffee-placeholder.jpg"} alt="coffee" />
            <Stack
              sx={{
                marginLeft: "65px",
                marginTop: "25px",
                alignItems: "center",
              }}
            >
              <h2 style={{ color: "#000000" }}>Login Form</h2>
              <TextField
                id="outlined-basic"
                label="username"
                variant="outlined"
                sx={{ 
                  my: "10px",
                  "& .MuiOutlinedInput-root": {
                    color: "#000000",
                    backgroundColor: "#ffffff",
                    "& fieldset": {
                      borderColor: "#000000",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#666666",
                    "&.Mui-focused": {
                      color: "#1976d2",
                    },
                  },
                }}
                onChange={handleUserName}
              />
              <TextField
                id={"outlined-basic"}
                label={"password"}
                variant={"outlined"}
                type={"password"}
                sx={{ 
                  "& .MuiOutlinedInput-root": {
                    color: "#000000",
                    backgroundColor: "#ffffff",
                    "& fieldset": {
                      borderColor: "#000000",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#666666",
                    "&.Mui-focused": {
                      color: "#1976d2",
                    },
                  },
                }}
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
              />
              <Fab
                sx={{ 
                  marginTop: "27px", 
                  width: "120px",
                  backgroundColor: "#1976d2",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
                variant={"extended"}
                onClick={handleLoginRequest}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Login
              </Fab>
            </Stack>
          </Stack>
        </Fade>
      </Modal>

      {showPostSignupNav && (
        <PostSignupNavigation onClose={handlePostSignupClose} />
      )}
    </div>
  );
}
