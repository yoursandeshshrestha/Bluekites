"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";

import Footer from "../components/Footer";
import ComprehensivePolicy from "./Policy";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(3);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="Policy - ELearning"
        description="ELearning is a learning management system for helping programmesr."
        keywords="programming, mern"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <ComprehensivePolicy />
      <Footer />
    </div>
  );
};

export default Page;
