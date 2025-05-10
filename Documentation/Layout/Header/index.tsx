// Next
import Image from "next/image";

// Nextra
import { Navbar } from "nextra-theme-docs";

// =====================================================================================================================

const Header = () => {
  return (
    <Navbar
      logo={
        <Image src={"/ioloco-logo.svg"} height={60} width={60} alt="Logo" />
      }
      logoLink={"/"}
      projectLink="https://github.com/Ioloco/ioloco-auth"
    />
  );
};

export default Header;
