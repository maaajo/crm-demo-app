import { Heading } from "@chakra-ui/react";

type PageTitileProps = {
  title: string;
};

const PageTitle = ({ title }: PageTitileProps) => {
  return (
    <Heading fontWeight={"black"} letterSpacing={"tight"} size={"lg"} py={"4"}>
      {title}
    </Heading>
  );
};

export default PageTitle;
