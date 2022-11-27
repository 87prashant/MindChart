import React from 'react'
import styled from '@emotion/styled'
import {Header, Inputs, StyledWrapper, StyledDiv, SubmitButton, CancelButton} from "./Form"

const Container = styled(StyledDiv)({
    display: "none"
})

const Wrapper = styled(StyledWrapper)({
    margin: "auto",
    width: 250,
    height: 300,
    border: "2px solid black",
})

const StyledHeader = styled(Header)({
    fontSize: 18,
    color: "teal"
})

const StyledName = styled(Header)({
    fontSize: 12,
})

const Name = styled(Inputs)({
    
})

interface Props {
    loginFormRef: any,
}

const Login = (props: Props) => {
    const { loginFormRef } = props

    function handleLogin() {

    }

    return (
        <Container showForm={false} ref={loginFormRef}>
            <Wrapper>
                <form onSubmit={handleLogin}>
                <StyledHeader>Login</StyledHeader>
                <StyledName>Name</StyledName>
                <Name type={"text"}/>
                </form>
            </Wrapper>
        </Container>
    )
}

export default Login