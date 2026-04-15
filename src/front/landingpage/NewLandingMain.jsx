import React from "react";
import "./LandingNueva.css";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import MissionVision from "./components/MissionVision";
import Services from "./components/Services";
import ChatDemo from "./components/ChatDemo";
import Testimonials from "./components/Testimonials";
import Developer from "./components/Developer";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function NewLandingMain() {
  return (
    <div className="landing-v2-container">
      <Navbar />
      <Hero />
      <Stats />
      <MissionVision />
      <Services />
      <ChatDemo />
      <Testimonials />
      <Developer />
      <FinalCTA />
      <Footer />
    </div>
  );
}
