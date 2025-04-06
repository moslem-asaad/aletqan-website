import React from 'react';
import Headbar from './Headbar';
import Navbar from './Navbar';
import Img from './Img';
import OurService from './OurService';
import Footer from './Footer';
import '../../App.css';


function Home() {
  return (

    <div className="App">
      <Headbar />
      <Navbar />
      
      <main>
        <Img />
        <OurService />
      </main>

      <Footer />
    </div>
  );
}

export default Home;