// src/components/SetTitle.tsx
import { useEffect } from "react";
import { useMatches } from "react-router-dom";

const SetTitle = () => {
  const matches = useMatches(); // lấy tất cả route hiện tại

  useEffect(() => {
    const deepestMatchWithTitle = [...matches].reverse().find(m => m.handle?.title);
    if (deepestMatchWithTitle) {
      document.title = deepestMatchWithTitle?.handle?.title;
    }
  }, [matches]);

  return null;
};

export default SetTitle;
