"use client";

import { useEffect } from "react";
import loadGlobals from "@/config/loadGlobals";

const GlobalScriptsLoader = () => {
  useEffect(() => {
    loadGlobals();
  }, []);

  return null;
};

export default GlobalScriptsLoader;
