import styled from "@emotion/styled";

const Container = styled("div")({
  position: "absolute",
  maxWidth: 200,
  maxHeight: 100,
  borderRadius: 5,
  boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
  backgroundColor: "white",
  padding: 8,
  userSelect: "none",
  //   left: -200,
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
}

const ConfirmationModal = (props: Props) => {
  const { confirmationModalRef, setShowConfirmationModal } = props;

  function handleConfirmation() {}

  return (
    <Container ref={confirmationModalRef}>
      <Header>Do you want to continue?</Header>
      <ButtonContainer>
        <YesButton onClick={handleConfirmation}>Yes</YesButton>
        <NoButton onClick={() => setShowConfirmationModal(false)}>No</NoButton>
      </ButtonContainer>
    </Container>
  );
};

export default ConfirmationModal;
