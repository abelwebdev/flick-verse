import { Link } from "react-router-dom";

import Logo from "../Logo";
import FooterImg from "@/assets/images/footer-bg.webp";
import { maxWidth } from "@/styles";
import { cn } from "@/utils/helper";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundImage: `
            linear-gradient(rgba(0,0,0,0.075), rgba(0,0,0,0.075))
        , url(${FooterImg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="dark:bg-black lg:py-16 sm:py-10 xs:py-8 py-[30px] w-full"
    >
      <div
        className={cn(
          maxWidth,
          ` flex flex-col items-center lg:gap-14 md:gap-12 sm:gap-8 xs:gap-[30px] gap-6`
        )}
      >
        <Logo logoColor="text-primary" />
        <ul className="grid grid-cols-3 items-center justify-start font-medium text-gray-300 capitalize md:gap-x-16 md:gap-y-4 md:gap-4 sm:gap-2  xs:gap-[6px] gap-1">
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
