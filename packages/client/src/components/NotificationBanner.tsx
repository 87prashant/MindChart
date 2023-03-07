import styled from "@emotion/styled";

const Container = styled("div")({
  position: "absolute",
  maxWidth: 200,
  left: -200,
  bottom: 40,
  zIndex: 3,
  padding: "10px 15px",
  borderRadius: "5px",
  backgroundColor: "white",
  boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
  opacity: 0,
  transition: "opacity ease 400ms"
});

const Message = styled("div")({
  fontSize: 13,
  fontWeight: "bold"

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
