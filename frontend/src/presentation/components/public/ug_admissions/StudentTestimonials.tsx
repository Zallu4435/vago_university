import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import testmonials1 from '../../../assets/images/ug-programs/testmonials/testmonials1.png'
import testmonials2 from '../../../assets/images/ug-programs/testmonials/testmonials2.jpg';
import testmonials3 from '../../../assets/images/ug-programs/testmonials/testmonials3.jpg'

const StudentTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: 'Victoria Lim',
      faculty: 'College of Humanities and Sciences (Psychology)',
      quote: '"The interdisciplinary curriculum exposed me to so many different perspectives – philosophy, history, science, statistics and more – encouraging me to venture beyond my interests and expand my comfort zone."',
      image: testmonials1
    },
    {
      id: 2,
      name: 'Ahmad Khan',
      faculty: 'School of Computing',
      quote: '"The vibrant tech community and innovative research opportunities at NUS have empowered me to develop solutions that can make a real impact on society."',
      image: testmonials2
    },
    {
      id: 3,
      name: 'Sarah Chen',
      faculty: 'Faculty of Engineering',
      quote: '"Working alongside brilliant professors and industry partners has given me practical experience and connections that have been invaluable for my career development."',
      image: testmonials3
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full bg-transparent shadow-sm rounded-lg overflow-hidden mb-8 sm:mb-12 border border-cyan-100">
      <div className="border-b border-cyan-100">
        <h1 className="text-2xl sm:text-3xl font-bold text-center py-4 sm:py-6 text-cyan-800">HEAR FROM OUR STUDENTS</h1>
        <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-4 sm:mb-6" />
        <p className="text-center text-cyan-600 px-4 sm:px-6 pb-4 sm:pb-6 w-full sm:max-w-4xl mx-auto text-sm sm:text-base">
          If you like what you've seen so far, you would be happy to know that we have a campus full of students just like you – different backgrounds, different interests, different motivations for choosing NUS, etc. And, most importantly, they are loving their time here.
        </p>
      </div>

      <div className="relative">
        <div className="flex items-center">
          {/* Left navigation button */}
          <button 
            onClick={prevSlide}
            className="absolute left-2 z-20 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-full p-2 transition-all duration-300 focus:outline-none shadow-sm hover:shadow-md"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Testimonial content */}
          <div className="w-full flex overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`w-full flex flex-col lg:flex-row items-center p-4 sm:p-6 transition-opacity duration-500 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0 hidden'
                }`}
              >
                <div className="lg:w-1/3 relative mb-4 lg:mb-0">
                  <div className="relative w-full h-48 lg:h-56">
                    <div className="absolute inset-0 bg-cyan-100 rounded-lg -top-2 -left-2 z-0"></div>
                    <div className="absolute inset-0 bg-blue-100 rounded-lg -bottom-2 -right-2 z-0"></div>
                    <div className="absolute inset-0 z-10 rounded-lg overflow-hidden shadow-sm">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-2/3 lg:pl-6 lg:pt-0 text-center lg:text-left">
                  <blockquote className="text-sm sm:text-base lg:text-lg italic text-cyan-600 mb-3 sm:mb-4">
                    {testimonial.quote}
                  </blockquote>
                  <div className="border-l-4 border-cyan-500 pl-3 sm:pl-4">
                    <p className="font-bold text-cyan-800 text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-cyan-600 text-xs sm:text-sm">{testimonial.faculty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right navigation button */}
          <button 
            onClick={nextSlide}
            className="absolute right-2 z-20 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-full p-2 transition-all duration-300 focus:outline-none shadow-sm hover:shadow-md"
            aria-label="Next testimonial"
          >
            <FaChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 py-3 sm:py-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex ? 'bg-cyan-600' : 'bg-cyan-200'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentTestimonials;