import React from "react";
import {
  Icon as ChakraIcon,
  type IconProps as ChakraIconProps,
} from "@chakra-ui/react";
import illustrations from "./Assets";

export type IllustrationName = keyof typeof illustrations;

export type IllustrationProps = {
  name: IllustrationName;
} & ChakraIconProps;

const Illustration: React.FC<IllustrationProps> = ({ name, ...props }) => {
  const SVG = illustrations[name];

  return <ChakraIcon as={SVG} w="auto" h="auto" {...props} />;
};

export default Illustration;
