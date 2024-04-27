import { RefCallback, useEffect, useState } from "react";

export const useScrollToBottom = <T extends Element>(
  isLoading: boolean
): [boolean, RefCallback<T>] => {
  const [isBottom, setIsBottom] = useState(false);
  const [node, setRef] = useState<T | null>(null);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    if (node && node.parentElement) {
      observer = new IntersectionObserver(
        ([entry]) => setIsBottom(entry.isIntersecting),
        { root: node.parentElement }
      );
      observer.observe(node);
    } else {
      setIsBottom(false);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [node]);

  return [isBottom, setRef];
};

// if api is generating, then prevent it from saying that its at the bottom, and wait till it finished generning then it will be at the bottom
// also find smooth scrolling down
