import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaPaperPlane } from 'react-icons/fa';
import { Input } from './Input';
import { Button } from './Button';
import { Textarea } from './Textarea';
import { useSectionAnimation } from '../../application/hooks/useSectionAnimation';

const ContactUs = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const isVisible = useSectionAnimation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <section
      id="contact-us"
      data-animate
      className={`w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50 pt-20 pb-30 transition-all duration-800 ${
        isVisible["contact-us"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-cyan-800 mb-4">Contact Us</h2>
          <p className="text-lg text-cyan-600 max-w-2xl mx-auto">
            Have questions? We're here to help. Contact our team for support or inquiries.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-4" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl overflow-hidden shadow-sm">
          {/* Left Section - Contact Info */}
          <div className="md:w-2/5 bg-gradient-to-r from-cyan-600 to-blue-600 p-8 text-white">
            <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex items-center">
                <FaEnvelope className="text-cyan-200 mr-4 text-xl" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-cyan-100">contact@academia.edu</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-cyan-200 mr-4 text-xl" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-cyan-100">+1 234 567 890</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-cyan-200 mr-4 text-xl" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-cyan-100">123 University Avenue, City, Country</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="font-medium mb-4">Follow Us</p>
              <div className="flex space-x-4">
                <a href="#" className="text-cyan-200 hover:text-white transition-colors">
                  <FaFacebook className="text-2xl" />
                </a>
                <a href="#" className="text-cyan-200 hover:text-white transition-colors">
                  <FaTwitter className="text-2xl" />
                </a>
                <a href="#" className="text-cyan-200 hover:text-white transition-colors">
                  <FaInstagram className="text-2xl" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="md:w-3/5 p-8">
            <h3 className="text-2xl font-semibold text-cyan-800 mb-6">Send us a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                id="subject"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                required
              />
              <Textarea
                id="message"
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
              />
              <Button
                type="submit"
                label={
                  <span className="flex items-center">
                    <FaPaperPlane className="mr-2" /> Send Message
                  </span>
                }
                variant="primary"
                className="w-full flex justify-center items-center"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;