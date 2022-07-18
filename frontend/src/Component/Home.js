import React from 'react';
import backgroundCellular from '../media/backgroundCellular.jpg';
import '../StyleSheets/Home.css';
import ScrollAnimation from 'react-animate-on-scroll';


const Home = () =>{
    return (
        <div id="back">
            
            <div id='header'>
                IEC Tool
            </div>
            
                
            <br></br>
            <ScrollAnimation animateIn="flipInY" >
                <div id='img-id'><img id='image-content' src={backgroundCellular} alt='image background of cellular sites' /></div>
            </ScrollAnimation>
            
        </div>
    )
}
export default Home;