import styled from 'styled-components'
import { devices } from '../utils/devices'

const ToggleBtn = styled.button`
  height: 32px;
  margin: 16px;
  position: absolute;
  top: 0;
  right: 0;
  color: ${({ theme }) => theme.offWhite};
  background: transparent;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: right;
  z-index: 150;

  @media only screen and (${devices.mobile}) {
    margin: 12px;
  }
`

const ToggleText = styled.p`
  margin-right: 8px;
  font-size: 14px;
  font-family: 'Borna';
  @media only screen and (${devices.mobile}) {
    font-size: 12px;
  }
`

const IconContainer = styled.div`
  border-radius: 12px;
  border: none;
  background: ${({ theme }) => theme.midGreen};
  padding: 8px 8px 5px 8px;
`

type ToggleButtonProps = {
  handleClick?: (e: unknown) => void
  text: string
  icon: JSX.Element
}

function ToggleButton({ handleClick, text, icon }: ToggleButtonProps) {
  return (
    <ToggleBtn onClick={handleClick}>
      <ToggleText>{text}</ToggleText>
      <IconContainer>{icon}</IconContainer>
    </ToggleBtn>
  )
}

export default ToggleButton
