import { memo } from "react";
import { m } from "framer-motion";

import Image from "../Image";
import { cn } from "@/utils/helper";
import { useMotion } from "@/hooks/useMotion";

interface PosterPropsType {
  posterPath: string;
  title: string;
  className?: string;
}

const Poster = ({ posterPath, title, className }: PosterPropsType) => {
  const { zoomIn } = useMotion();
  return (
    <div className={cn(`block`, className)}>
      <m.div
        variants={zoomIn(0.6, 0.8)}
        initial="hidden"
        animate="show"
        className="md:h-[380px] md:w-[254px] xs:h-[340px] xs:w-[230px] h-[300px] w-[200px]"
      >
        <Image
          width={254}
          height={380}
          src={`https://image.tmdb.org/t/p/original/${posterPath}`}
          alt={title}
          className="object-cover rounded-xl  shadow-lg"
        />
      </m.div>
    </div>
  );
};

export default memo(Poster);
