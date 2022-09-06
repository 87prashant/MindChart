import React from 'react'
import styled from '@emotion/styled'

const StyledHeader = styled('div')({
    height: '100px',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    background: '#F4EBD0'
})

const AddButton = styled('a')({
    margin: '0 20px',
    padding: '10px',
    textDecoration: 'none',
    border: 'solid black',
    borderRadius: '10px'
})

const Header = () => {
    return (
        <StyledHeader>
            <AddButton href="https://www.google.com">
                Add
            </AddButton>
        </StyledHeader>
    )
}

export default Header