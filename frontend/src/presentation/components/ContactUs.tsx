import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaPaperPlane } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Input } from './Input';
import { Button } from './Button';
import { Textarea } from './Textarea';
import { useSectionAnimation } from '../../application/hooks/useSectionAnimation';

// Zod validation schema
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required').min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(1, 'Message is required').min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactUs = () => {
  const isVisible = useSectionAnimation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${backendUrl}/enquiries`, {
        name: data.name.trim(),
        email: data.email.trim(),
        subject: data.subject.trim(),
        message: data.message.trim()
      });

      toast.success('Thank you! Your message has been sent successfully.');
      
      // Reset form on success
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      console.error('Error submitting enquiry:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {submitError}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    {...register('name')}
                    disabled={isSubmitting}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your Email"
                    {...register('email')}
                    disabled={isSubmitting}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div>
                <Input
                  id="subject"
                  placeholder="Subject"
                  {...register('subject')}
                  disabled={isSubmitting}
                  className={errors.subject ? 'border-red-500' : ''}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm">{errors.subject.message}</p>
                )}
              </div>
              <div>
                <Textarea
                  id="message"
                  placeholder="Your Message"
                  {...register('message')}
                  disabled={isSubmitting}
                  rows={4}
                  className={errors.message ? 'border-red-500' : ''}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm">{errors.message.message}</p>
                )}
              </div>
              <Button
                type="submit"
                label={isSubmitting ? "Sending..." : "Send Message"}
                variant="primary"
                className="w-full flex justify-center items-center"
                disabled={isSubmitting}
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;