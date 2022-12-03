import React, { useRef, useState } from 'react'
import styled from '@emotion/styled'
import { Header, Inputs, StyledWrapper, StyledDiv, SubmitButton, CancelButton } from "./Form"

const Container = styled(StyledDiv)({
    display: "none",
})

const Wrapper = styled(StyledWrapper)({
    width: 250,
    height: 320,
    border: "2px solid black",
    overflow: "hidden"
})

const FormContainer = styled('div')({
    gap: 15,
    display: "flex",
    transition: "all 0.2s linear",
    // transform: isRegister ? "" : "translate(-232px)",
})

const RegisterForm = styled('form')({
    minWidth: "100%",
})

const LoginForm = styled('form')({
    minWidth: "100%"
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
    bottom: 12,
    left: 15
})

const StyledCancelButton = styled(CancelButton)({
    width: 80,
    bottom: 12,
    right: 15
})

const StyledStatus = styled("div")({
    fontSize: 11,
    color: "red",
    fontWeight: "bold"
})

const Button = styled('div')({
    textDecoration: "underline",
    border: "none",
    backgroundColor: "inherit",
    color: "teal",
    cursor: "pointer",
    fontSize: 13
})

interface Props {
    signUpFormRef: any,
    setIsRegistered: any
    setUserInfo: any
}

const SignUp = (props: Props) => {
    const { signUpFormRef, setIsRegistered, setUserInfo } = props

    const [status, setStatus] = useState(null)
    const [isRegister, setIsRegister] = useState(true)

    const registerNameRef = useRef<HTMLInputElement | null>(null)
    const registerEmailRef = useRef<HTMLInputElement | null>(null)
    const registerPassRef = useRef<HTMLInputElement | null>(null)
    const loginEmailRef = useRef<HTMLInputElement | null>(null)
    const loginPassRef = useRef<HTMLInputElement | null>(null)
    const formContainerRef = useRef<HTMLDivElement | null>(null)

    function handleFormSubmit(e: any) {
        e.preventDefault()
        if (isRegister) {
            fetch("/register",
                {
                    method: "post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: registerNameRef.current!.value.toLowerCase(), email: registerEmailRef.current!.value.toLowerCase(), password: registerPassRef.current!.value })
                })
                .then(response => response.json()).then(data => {
                    if (data.status === "ok") {
                        setIsRegistered(true)
                        setUserInfo(() => ({ username: data.username, email: data.email }))
                    }
                    else {
                        setStatus(data.error)
                    }
                })
        }
        else {
            fetch("/login",
                {
                    method: "post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: loginEmailRef.current!.value.toLowerCase(), password: loginPassRef.current!.value })
                })
                .then(response => response.json()).then(data => {
                    if (data.status === "ok") {
                        setIsRegistered(true)
                        setUserInfo(() => ({ username: data.username, email: data.email }))
                    }
                    else {
                        setStatus(data.error)
                    }
                })
        }
    }

    function handleCancel() {
        signUpFormRef.current!.style.display = "none"
    }

    function handleUserChoice() {
        setIsRegister(!isRegister)
        setStatus(null)
        formContainerRef.current!.style.transform = isRegister ? "translate(-232px)" : ""
    }

    return (
        <Container showForm={false} ref={signUpFormRef}>
            <Wrapper>
                <FormContainer ref={formContainerRef}>
                    <RegisterForm >
                        <StyledHeader>Create an account</StyledHeader>
                        <StyledInputName>Name</StyledInputName>
                        <StyledInput ref={registerNameRef} type={"text"} placeholder="Name" />
                        <StyledInputName>Email</StyledInputName>
                        <StyledInput ref={registerEmailRef} type="email" placeholder="Email" />
                        <StyledInputName>Password</StyledInputName>
                        <StyledInput ref={registerPassRef} type="password" placeholder="Password" />
                        <StyledStatus>{status}</StyledStatus>
                        <Button onClick={handleUserChoice}>Login instead</Button>
                    </RegisterForm>
                    <LoginForm >
                        <StyledHeader>Log in</StyledHeader>
                        <StyledInputName>Email</StyledInputName>
                        <StyledInput ref={loginEmailRef} type="email" placeholder="Email" />
                        <StyledInputName>Password</StyledInputName>
                        <StyledInput ref={loginPassRef} type="password" placeholder="Password" />
                        <StyledStatus>{status}</StyledStatus>
                        <Button onClick={handleUserChoice}>Register</Button>
                    </LoginForm>
                </FormContainer>
                <StyledSubmitButton onClick={(e) => handleFormSubmit(e)} isSame={false} type="submit" value="Submit" />
                <StyledCancelButton type="button" value="Cancel" onClick={handleCancel} />
            </Wrapper>
        </Container>
    )
}

export default SignUp