import styled from "@emotion/styled";
import { Misc } from "./constants";

const Container = styled("div")({
  width: Misc.HEADER_HEIGHT - 10,
  height: Misc.HEADER_HEIGHT - 10,
  borderRadius: "50%",
  backgroundColor: "teal",
  display: "flex",
  WebkitAlignItems: "center",
  justifyContent: "center",
  fontSize: 20,
  color: "#F4EBD0",
  margin: "0 20px",
  cursor: "pointer",
});

const Image = styled("img")({
  width: Misc.HEADER_HEIGHT - 10,
  height: Misc.HEADER_HEIGHT - 10,
  borderRadius: "50%",
});

interface Props {
  setShowProfileModal: any;
}

const ProfileButton = (props: Props) => {
  const { setShowProfileModal } = props;

  function handleClick(e: any) {
    e.stopPropagation();
    setShowProfileModal(true);
  }

  const { username, imageUrl } = JSON.parse(
    window.localStorage.getItem("userInfo")!
  );

  let i: any = 0;
  let surnameFirstLetter: string = "";
  for (i in username as any) {
    if (username[i] === " ") surnameFirstLetter = username[++i];
  }
  const userInitial = (username.slice(0, 1) + surnameFirstLetter).toUpperCase();

  return (
    <Container onClick={handleClick}>
      {imageUrl ? <Image src={imageUrl} alt="img" /> : userInitial}
    </Container>
  );
};

export default ProfileButton;
