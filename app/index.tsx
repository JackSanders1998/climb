import { ActiveSessionFooter } from "@/lib/components/ActiveSessionFooter";
import SillyNav from "@/lib/components/SillyNav";
import React from "react";

export default function Summary() {
  return (
    <>
      <SillyNav pageName="Summary" />
      <ActiveSessionFooter />
    </>
  );
}
