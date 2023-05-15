import styled from "@emotion/styled";
import { HorizontalRule } from "./AuthenticationForm";
import { Misc, NotificationMessage, ResponseStatus } from "./constants";
import { UserInfoType } from "./App/App";

const Container = styled("div")({
  position: "absolute",
  fontSize: 14,
  color: "rgba(0, 0, 0, 0.7)",
  top: Misc.HEADER_HEIGHT - 5,
  right: 20,
  padding: 5,
  borderRadius: 8,
  backgroundColor: "rgba(242, 242, 242, 1)",
  boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
});

const Info = styled("div")({
  marginBottom: 8,
});

const Button = styled("input")({
  border: "none",
  backgroundColor: "inherit",
  color: "inherit",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all ease 100ms",
  ":hover": {
    color: "red",
  },
});

interface Props {
  setSavedData: any;
  setIsChartAdded: any;
  setShowProfileModal: any;
  handleNotificationBanner: any;
  setShowConfirmationModal: any;
  setHandleConfirmation: any;
  setUserInfo: any;
  userInfo: UserInfoType | null
}

const ProfileModal = (props: Props) => {
  const {
    setSavedData,
    setIsChartAdded,
    setShowProfileModal,
    handleNotificationBanner,
    setShowConfirmationModal,
    setHandleConfirmation,
    setUserInfo,
    userInfo
  } = props;

  const handleLogoutConfirm = () => {
    setShowConfirmationModal(true);
    setHandleConfirmation(() => () => {
      setShowConfirmationModal(false);
      setShowProfileModal(false);
      setSavedData([]);
      setIsChartAdded(false);
      setUserInfo(null);
      handleNotificationBanner(
        NotificationMessage.LOGGED_OUT,
        ResponseStatus.OK
      );
    });
  };

  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <Info>{userInfo?.email}</Info>
      <HorizontalRule />
      <Button value="Log out" type="button" onClick={handleLogoutConfirm} />
    </Container>
  );
};

export default ProfileModal;
