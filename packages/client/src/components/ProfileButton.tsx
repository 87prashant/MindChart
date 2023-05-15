import styled from "@emotion/styled";
import { Misc } from "./constants";
import { UserInfoType } from "./App/App";

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
  userInfo: UserInfoType | null;
}

const ProfileButton = (props: Props) => {
  const { setShowProfileModal, userInfo } = props;

  function handleClick(e: any) {
    e.stopPropagation();
    setShowProfileModal(true);
  }

  return (
    <Container onClick={handleClick}>
      {userInfo?.imageUrl ? (
        <Image src={userInfo.imageUrl} alt="img" />
      ) : (
        userInfo?.username.slice(0, 1)
      )}
    </Container>
  );
};

export default ProfileButton;
