import styled from "@emotion/styled";

const Container = styled("div")({
  position: "absolute",
  maxWidth: 200,
  left: -200,
  bottom: 40,
  zIndex: 3,
  border: "1px solid grey",
  padding: "10px 15px",
  borderRadius: "5px",
  backgroundColor: "white",
});

const Message = styled("div")({
  fontSize: 13,
  color: "grey",
});

interface Props {
  notificationBannerRef: any;
}

const NotificationBanner = (props: Props) => {
  const { notificationBannerRef } = props;

  return (
    <Container ref={notificationBannerRef}>
      <Message></Message>
    </Container>
  );
};

export default NotificationBanner;
