import React, { useEffect, useState } from 'react'
import '../componentStyles/ImageSlider.css'
const images = ["/images/img5.png", "/images/img6.png", "/images/img9.png", "/images/img3.png", "/images/img7.png", "/images/img2.png", "/images/img1.png", "/images/img8.png", "/images/img4.png"];
function ImageSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(()=>{
        const interval=setInterval(()=>{
            setCurrentIndex((prevIndex)=>(prevIndex+1)% images.length)
        }, 5000)
        return()=>clearInterval(interval);
    },[])
  return (
    <div className="image-slider-container">
        <div className="slider-images" style={{transform:`translateX(-${currentIndex*100}%)`}}>
            {images.map((image, index) => (<div className="slider-item" key={index}>
                <img src={image} alt={`Slide ${index+1}`} />
            </div>))}
        </div>

        <div className="slider-dots">

           { images.map((_, index)=>(

               <span className= {index === currentIndex ? "dot active" : "dot"} key={index} onClick={()=>setCurrentIndex(index)}></span>
            ))}
        </div>
    </div>
  )
}

export default ImageSlider