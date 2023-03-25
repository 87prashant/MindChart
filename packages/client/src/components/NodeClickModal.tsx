import { useRef } from "react";
import styled from "@emotion/styled";

const Header = styled("div")({
  display: "flex",
  flexDirection: "row-reverse",
  "& button + button": {
    marginRight: 5,
  },
});

const Button = styled("button")<{ name: string }>(({ name }) => ({
  border: "1px solid rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  backgroundColor: name === "delete" ? "red" : undefined,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 7,
  userSelect: "none",
  padding: 3,
  "& img": {
    width: 18,
    height: 18,
  },
}));

const Content = styled("div")({
  borderRadius: 7,
  marginTop: 8,
  backgroundColor: "rgba(242, 242, 242, 0.4)",
  width: "100%",
  maxHeight: 150,
  fontSize: 14,
  color: "rgba(0, 0, 0, 0.6)",
  overflow: "auto",
  padding: 5,
  cursor: "default",
  "::-webkit-scrollbar": {
    width: 10,
    height: 10,
  },
  "::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 5px grey",
    borderRadius: 8,
  },
  "::-webkit-scrollbar-thumb": {
    background: "rgba(165, 165, 165, 1)",
    borderRadius: 10,
  },
});

interface Props {
  handleEdit: any;
  handleDelete: any;
  setShowConfirmationModal: any;
  setHandleConfirmation: any;
  canvasScale: number;
}

const NodeClickModal = (props: Props) => {
  const {
    handleEdit,
    handleDelete,
    setShowConfirmationModal,
    setHandleConfirmation,
    canvasScale,
  } = props;

  const ref = useRef<HTMLDivElement | null>(null);

  function handleDeleteNodeConfirm() {
    setShowConfirmationModal(true);
    setHandleConfirmation(() => () => {
      setShowConfirmationModal(false);
      handleDelete();
    });
  }

  return (
    <div>
      <Header>
        <Button name={"delete"} onClick={handleDeleteNodeConfirm}>
          <img src="/delete.svg" alt="" />
        </Button>
        <Button name={"edit"} onClick={() => handleEdit()}>
          <img src="/edit.svg" alt="" />
        </Button>
      </Header>
      <Content ref={ref}></Content>
    </div>
  );
};

export default NodeClickModal;
