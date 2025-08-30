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
        className="lg:h-[450px] lg:w-[300px] md:h-[380px] md:w-[254px] xs:h-[340px] xs:w-[230px] h-[300px] w-[200px]"
      >
        <Image
          width={300}
          height={450}
          src={`https://image.tmdb.org/t/p/original/${posterPath}`}
          alt={title}
          className="object-cover rounded-xl shadow-lg w-full h-full"
        />
      </m.div>
    </div>
  );
};

export default memo(Poster);
