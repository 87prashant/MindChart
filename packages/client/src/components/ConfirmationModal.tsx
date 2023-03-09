import styled from "@emotion/styled";

const Wrapper = styled("div")({
  position: "absolute",
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const Container = styled("div")({
  maxWidth: 300,
  maxHeight: 200,
  borderRadius: 5,
  boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
  backgroundColor: "white",
  padding: 8,
  userSelect: "none",
});

const Header = styled("div")({
  marginBottom: 10,
  color: "grey",
  fontSize: 14,
});

const ButtonContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 40,
  marginBottom: 5,
  "& button": {
    border: "none",
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
    padding: 5,
    borderRadius: 5,
    cursor: "pointer",
    ":hover": {
      opacity: 0.7,
    },
  },
});

const YesButton = styled("button")({
  backgroundColor: "red",
  color: "white",
});

const NoButton = styled("button")({});

interface Props {
  confirmationModalRef: any;
  setShowConfirmationModal: any;
  handleConfirmation: any;
  setHandleConfirmation: any;
}

const ConfirmationModal = (props: Props) => {
  const {
    confirmationModalRef,
    setShowConfirmationModal,
    handleConfirmation,
    setHandleConfirmation,
  } = props;

  function handleCancel() {
    setShowConfirmationModal(false);
    setHandleConfirmation(null);
  }

  return (
    <Wrapper>
      <Container ref={confirmationModalRef}>
        <Header>Do you want to continue?</Header>
        <ButtonContainer>
          <YesButton onClick={handleConfirmation}>Yes</YesButton>
          <NoButton onClick={handleCancel}>No</NoButton>
        </ButtonContainer>
      </Container>
    </Wrapper>
  );
};

export default ConfirmationModal;
