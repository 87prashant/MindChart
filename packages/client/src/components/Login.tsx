import React from 'react'
import styled from '@emotion/styled'

const Container = styled("button")({
    position: "fixed",
    width: "100vw",
    height: "100vh",
    top: "0",
    backgroundColor: "rgba(0,0,0, 0.2)",
    display: "none"
})

interface Props {
    loginFormRef: any,
}

const Login = (props: Props) => {
    const { loginFormRef } = props
    return (
        <Container ref={loginFormRef}>

        </Container>
    )
}

export default Login