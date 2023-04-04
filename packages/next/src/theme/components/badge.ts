const baseStyle = {
  textTransform: "normal",
  fontWeight: "medium",
  borderRadius: "2xl",
};

const sizes = {
  lg: {
    fontSize: "sm",
    px: "3",
    py: "1",
  },
  md: {
    fontSize: "sm",
    lineHeight: "1.25rem",
    px: "2.5",
    py: "0.5",
  },
  sm: {
    fontSize: "xs",
    lineHeight: "1.5",
    px: "2",
    py: "0.5",
  },
};

const defaultProps = {
  size: "md",
};

export default {
  baseStyle,
  defaultProps,
  sizes,
};
