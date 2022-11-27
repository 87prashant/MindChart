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
    color: "teal",
    textAlign: "center",
    margin: "0px 0px 20px 0px"
})

const StyledInputName = styled(Header)({
    fontSize: 12,
    margin: 0
})

const StyledInput = styled(Inputs)({
    width: "100%",
    margin: "0px 0px 10px 0px"
})

const StyledSubmitButton = styled(SubmitButton)({
    width: 80,
    bottom: 20,
    left: 15
})

const StyledCancelButton = styled(CancelButton)({
    width: 80,
    bottom: 20,
    right: 15
})

interface Props {
    signUpFormRef: any,
}

const SignUp = (props: Props) => {
    const { signUpFormRef } = props

    function handleSignUp(e: any) {
        e.preventDefault()

    }
    
    function handleSignUpCancel() {
        signUpFormRef.current!.style.display = "none"
    }

    return (
        <Container showForm={false} ref={signUpFormRef}>
            <Wrapper>
                <form onSubmit={(e) => handleSignUp(e)}>
                <StyledHeader>Create an account</StyledHeader>
                <StyledInputName>Name</StyledInputName>
                <StyledInput type={"text"} placeholder="Name"/>
                <StyledInputName>Email</StyledInputName>
                <StyledInput type="email" placeholder="Email"/>
                <StyledInputName>Password</StyledInputName>
                <StyledInput type="password" placeholder="Password"/>
                <StyledSubmitButton isSame={false} type="submit" value="Submit"/>
                <StyledCancelButton type="button" value="Cancel" onClick={handleSignUpCancel}/>
                </form>
            </Wrapper>
        </Container>
    )
}

export default SignUp