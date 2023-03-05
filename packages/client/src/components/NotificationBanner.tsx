import styled from "@emotion/styled";

const Container = styled("div")({
  position: "absolute",
  maxWidth: 200,
  left: -200,
  bottom: 50,
  zIndex: 3,
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
      <Message>message here</Message>
    </Container>
  );
};

export default NotificationBanner;
