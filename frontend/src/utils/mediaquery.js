import { useMediaQuery } from "react-responsive";

export const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};

export const TabletOrMobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
    return isMobile || isTablet ? children : null;
};
