import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const StudentTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: 'Victoria Lim',
      faculty: 'College of Humanities and Sciences (Psychology)',
      quote: '"The interdisciplinary curriculum exposed me to so many different perspectives – philosophy, history, science, statistics and more – encouraging me to venture beyond my interests and expand my comfort zone."',
      image: '/api/placeholder/300/400'
    },
    {
      id: 2,
      name: 'Ahmad Khan',
      faculty: 'School of Computing',
      quote: '"The vibrant tech community and innovative research opportunities at NUS have empowered me to develop solutions that can make a real impact on society."',
      image: '/api/placeholder/300/400'
    },
    {
      id: 3,
      name: 'Sarah Chen',
      faculty: 'Faculty of Engineering',
      quote: '"Working alongside brilliant professors and industry partners has given me practical experience and connections that have been invaluable for my career development."',
      image: '/api/placeholder/300/400'
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

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-12">
      <div className="border-b border-blue-500">
        <h1 className="text-3xl font-bold text-center py-6 text-blue-800">HEAR FROM OUR STUDENTS</h1>
        <p className="text-center text-gray-600 px-6 pb-6 max-w-4xl mx-auto">
          If you like what you've seen so far, you would be happy to know that we have a campus full of students just like you – different backgrounds, different interests, different motivations for choosing NUS, etc. And, most importantly, they are loving their time here.
        </p>
      </div>

      <div className="relative">
        <div className="flex items-center">
          {/* Left navigation button */}
          <button 
            onClick={prevSlide}
            className="absolute left-2 z-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors duration-300 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft size={24} />
          </button>

          {/* Testimonial content */}
          <div className="w-full flex overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`w-full flex flex-col md:flex-row items-center p-4 transition-opacity duration-500 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0 hidden'
                }`}
              >
                <div className="md:w-1/3 relative">
                  <div className="relative">
                    <div className="w-full h-full absolute bg-orange-100 rounded-lg -top-2 -left-2 z-0"></div>
                    <div className="w-full h-full absolute bg-blue-100 rounded-lg -bottom-2 -right-2 z-0"></div>
                    <div className="relative z-10 rounded-lg overflow-hidden shadow-md">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3 md:pl-8 pt-6 md:pt-0">
                  <blockquote className="text-lg italic text-gray-700 mb-4">
                    {testimonial.quote}
                  </blockquote>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <p className="font-bold text-blue-800">{testimonial.name}</p>
                    <p className="text-gray-600">{testimonial.faculty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right navigation button */}
          <button 
            onClick={nextSlide}
            className="absolute right-2 z-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors duration-300 focus:outline-none"
            aria-label="Next testimonial"
          >
            <FaChevronRight size={24} />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 py-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
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