import React, { useRef, useState } from 'react'
import styled from '@emotion/styled'
import { Header, Inputs, StyledWrapper, StyledDiv, SubmitButton, CancelButton } from "./Form"

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
    setIsRegistered: any
}

const SignUp = (props: Props) => {
    const { signUpFormRef, setIsRegistered } = props
    const [status, setStatus] = useState(null)
    const nameRef = useRef<HTMLInputElement | null>(null)
    const emailRef = useRef<HTMLInputElement | null>(null)
    const passRef = useRef<HTMLInputElement | null>(null)
    function handleSignUp(e: any) {
        e.preventDefault()
        fetch("/register",
            {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: nameRef.current!.value, email: emailRef.current!.value, password: passRef.current!.value })
            })
            .then(response => response.json()).then(data => {
                if (data.status === "ok") {
                    setIsRegistered(true)
                }
                else {
                    setStatus(data.error)
                }
            })
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
                    <StyledInput ref={nameRef} type={"text"} placeholder="Name" />
                    <StyledInputName>Email</StyledInputName>
                    <StyledInput ref={emailRef} type="email" placeholder="Email" />
                    <StyledInputName>Password</StyledInputName>
                    <StyledInput ref={passRef} type="password" placeholder="Password" />
                    <StyledSubmitButton isSame={false} type="submit" value="Submit" />
                    <StyledCancelButton type="button" value="Cancel" onClick={handleSignUpCancel} />
                    {status}
                </form>
            </Wrapper>
        </Container>
    )
}

export default SignUp