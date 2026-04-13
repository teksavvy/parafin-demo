"use client";
import { createContext } from "react";

const MobileMenuContext = createContext<{ open: () => void }>({ open: () => {} });
export default MobileMenuContext;
