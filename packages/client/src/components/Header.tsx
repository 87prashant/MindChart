import { useState } from "react";
import styled from "@emotion/styled";
import { NodeDataType } from "./NodeForm";
import AuthenticationForm from "./AuthenticationForm";
import ProfileButton from "./ProfileButton";
import ProfileModal from "./ProfileModal";
import { Misc } from "./constants";

const StyledHeader = styled("div")({
  height: `${Misc.HEADER_HEIGHT}px`,
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  backgroundColor: "#F4EBD0",
  userSelect: "none",
});

const HelpButton = styled("a")({
  display: "flex",
  border: "2px solid black",
  borderRadius: 10,
  padding: 5,
  marginRight: "auto",
  marginLeft: "20px",
  textDecoration: "none",
  backgroundColor: "white",
  transition: "all ease 200ms",
  color: "teal",
  ":active": {
    color: "teal",
  },
  ":hover": {
    backgroundColor: "teal",
  },
});

const AddButton = styled("button")({
  margin: "0 20px",
  padding: "1px 0 0 0",
  textDecoration: "none",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "	rgba(255,253,228, 1)",
  transition: "all ease 300ms",
  fontWeight: "bolder",
  ":hover": {
    backgroundColor: "white",
    border: "none",
  },
});

const DeleteAllData = styled(AddButton)({
  border: "none",
  backgroundColor: "inherit",
  fontSize: 11,
  textDecoration: "underline",
  transition: "all ease 100ms",
  ":hover": {
    backgroundColor: "inherit",
    color: "red",
  },
});

const DemoButton = styled("button")<{ isDemoActive: boolean }>(
  ({ isDemoActive }) => ({
    border: "none",
    padding: "10px",
    margin: "0 20px",
    textDecoration: "none",
    color: isDemoActive ? "rgba(0, 0, 0)" : "rgba(0, 0, 0, 0.3)",
    cursor: "pointer",
    borderRadius: "10px",
    fontWeight: "bolder",
  })
);

export const AuthenticationButton = styled("button")({
  margin: "0 20px",
  padding: "10px",
  textDecoration: "none",
  cursor: "pointer",
  border: "solid black",
  borderRadius: "10px",
  backgroundColor: "teal",
  fontWeight: "bolder",
});

const PlusIcon = styled("span")({
  margin: "4px 10px 4px 10px",
  fontSize: 25,
  color: "teal",
});

const AddText = styled("span")({
  margin: "0 10px 0 0",
});

interface Props {
  setShowNodeForm: any;
  isDemoActive: boolean;
  setIsDemoActive: any;
  setSavedData: any;
  setIsChartAdded: any;
  demoData: NodeDataType[];
  setIsRegistered: any;
  isLoggedIn: boolean;
  setShowProfileModal: any;
  showProfileModal: boolean;
  setShowNodeClickModal: any;
  userInfo: { username: string; email: string };
  setUserInfo: any;
}

const Header = (props: Props) => {
  const {
    setShowNodeForm,
    isDemoActive,
    setIsDemoActive,
    setSavedData,
    demoData,
    setIsChartAdded,
    setIsRegistered,
    isLoggedIn,
    setShowProfileModal,
    setShowNodeClickModal,
    showProfileModal,
    userInfo,
    setUserInfo,
  } = props;

  const [showAuthenticationForm, setShowAuthenticationForm] = useState(false);
  
  
  function handleClick() {
    setIsDemoActive((isDemoActive: boolean) => (isDemoActive ? false : true));
    const storedData: NodeDataType[] = window.localStorage.getItem("savedData")
      ? JSON.parse(window.localStorage.getItem("savedData")!)
      : [];
    //"!isDemoActive" because I am updating isDemoActive at the same time above. Maybe there is other right way to do it.
    setSavedData((prev: NodeDataType[]) =>
      !isDemoActive ? demoData : storedData
    );
    setIsChartAdded(false);
  }

  function handleHeaderClick() {
    setShowProfileModal(false);
    setShowNodeClickModal(false);
  }

  function handleDeleteAllData() {
    setSavedData([]);
    setIsChartAdded(false);
  }

  const showNodeForm = () => {
    setShowNodeForm(true);
  };
  
  return (
    <StyledHeader onClick={handleHeaderClick}>
      <HelpButton href={Misc.GITHUB_LINK} target="_blank">
        <img src="github_logo.png" alt="" width="25" height="25" />
      </HelpButton>
      {!isLoggedIn && (
        <DeleteAllData onClick={handleDeleteAllData}>
          Delete All Data
        </DeleteAllData>
      )}
      {!isLoggedIn && (
        <DemoButton isDemoActive={isDemoActive} onClick={handleClick}>
          Demo
        </DemoButton>
      )}
      <AddButton onClick={() => showNodeForm()}>
        <PlusIcon>+</PlusIcon>
        <AddText>Add</AddText>
      </AddButton>
      {!isLoggedIn && (
        <AuthenticationButton onClick={() => setShowAuthenticationForm(true)}>
          Register
        </AuthenticationButton>
      )}
      {!isLoggedIn && showAuthenticationForm && (
        <AuthenticationForm
          setShowAuthenticationForm={setShowAuthenticationForm}
          setIsRegistered={setIsRegistered}
          setUserInfo={setUserInfo}
          setSavedData={setSavedData}
          setIsChartAdded={setIsChartAdded}
        />
      )}
      {isLoggedIn && (
        <ProfileButton
          setShowProfileModal={setShowProfileModal}
          userInfo={userInfo}
        />
      )}
      {isLoggedIn && showProfileModal && (
        <ProfileModal
          setIsRegistered={setIsRegistered}
          userInfo={userInfo}
          setSavedData={setSavedData}
          setIsChartAdded={setIsChartAdded}
          setShowProfileModal={setShowProfileModal}
        />
      )}
    </StyledHeader>
  );
};

export default Header;
