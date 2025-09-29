import React from 'react'
import Navbar from '../Navbar/Navbar';
import Hero from '../../pages/Hero';
import About from '../About/About';
import Experience from '../Experience/Experience';
import TechStack from '../techstack/Techstack';
import Projects from '../Projects/Projects';
import Education from '../Education/Education';
import Contact from '../contact/Contact';
import Footer from '../Footer/Footer';
import AwardsAchievements from '../AwardsAchievements/AwardsAchievements';
import Testimonials from '../Testimonials/Testimonials';

const Home = () => {
  return (
   <>
<Navbar/>
<section id="home"><Hero/></section>

 <section id="about"><About/></section>
 <Education/>
  <section id="experience"><Experience/></section>
  <TechStack/>
<section id="projects"><Projects/></section>
<AwardsAchievements/>
<Testimonials/>
<section id="contact"><Contact/></section>
{/* <RadheRadheSection/> */}
<Footer/>



   </>
  )
}

export default Home
