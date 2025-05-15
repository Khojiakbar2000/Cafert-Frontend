import React from "react";

import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { CssVarsProvider } from "@mui/joy/styles";
import { CardOverflow } from "@mui/joy";
import { Visibility } from "@mui/icons-material";
import { Box, Button, Container, Stack } from "@mui/material";
import { DescriptionOutlined } from "@mui/icons-material";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { serverApi } from "../../../lib/config";
import { Member } from "../../../lib/types/member";

/* REDUX SLICE & SELECTOR*/
const topUsersRetriever = createSelector(retrieveTopUsers, (topUsers) => ({
  topUsers,
}));

export default function ActiveUsers() {
  const { topUsers } = useSelector(topUsersRetriever);

  return (
    <div className={"active-users-frame"}>
      <Container>
        <Stack className={"main"}>
          <Box className={"category-title"}>Active Users</Box>
          <Stack className={"cards-frame"}>
            {topUsers.length !== 0 ? (
              topUsers.map((member: Member) => {
                const imagePath = `${serverApi}${member.memberImage}`;
                return (
                  <CssVarsProvider key={member._id}>
                    <Card className={"card"} sx={{ maxWidth: 340 }}>
                      <CardCover>
                        <img src={imagePath} alt="" />
                      </CardCover>

                      <CardContent sx={{ justifyContent: "flex-end" }}>
                        <Stack
                          style={{ background: "#ffff" }}
                          flexDirection={"row"}
                          justifyContent={"center"}
                          marginBottom={"-35px"}
                        >
                          <Typography className={"member-nickname"}>
                            {member.memberNick}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </CssVarsProvider>
                );
              })
            ) : (
              <Box className="no-data">New Products are not available!</Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}


















