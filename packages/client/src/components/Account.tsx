import React from "react"
import styled from "@emotion/styled"

const Container = styled('div')({
    width: 50,
    height: 50,
    borderRadius: "50%",
    backgroundColor: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 17
})

interface Props {
    userInfo: {username: string; email: string}
}

const Account = (props: Props) => {
    const {userInfo} = props
    return (
        <Container>
            {userInfo.username.slice(0,1)}
        </Container>
    )
}

export default Account