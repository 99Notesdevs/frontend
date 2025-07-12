'use client';

import { env } from '@/config/env';
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaComment } from 'react-icons/fa';

interface FormData {
  name: string;
  email: string;
  mobile: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | ''>('');

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        name: formData.name,
        email: formData.email,
        phone: formData.mobile,
        message: formData.message
      }
      const response = await fetch(`${env.API}/form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if(!result.success) {
        throw new Error('Form submission failed');
      }
      setSubmitStatus('success');
      setFormData({ name: '', email: '', mobile: '', message: '' });
      setTimeout(() => setSubmitStatus(''), 3000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-sm shadow-lg dark:shadow-slate-700/50">
      <div className="text-center mb-8">
        <h2 className="text-1xl font-bold text-[var(--text-strong)] dark:text-slate-100 mb-2">
          Get Free UPSC Study Material
        </h2>
      </div>

      {submitStatus === 'success' && (
        <div className="mb-4 p-4 bg-[var(--success-bg)] border border-[var(--success-border)] text-[var(--success-text)] rounded-lg text-sm flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Thank you! We&apos;ll contact you soon.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-4 p-4 bg-[var(--error-bg)] border border-[var(--error-border)] text-[var(--error-text)] rounded-lg text-sm flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Something went wrong. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {([
          { field: 'name', icon: FaUser },
          { field: 'email', icon: FaEnvelope },
          { field: 'mobile', icon: FaPhone },
          { field: 'message', icon: FaComment }
        ] as { field: keyof FormData; icon: any }[]).map(({ field, icon: Icon }) => (
          <div key={field} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400 dark:text-slate-400" />
            </div>
            <input
              type={field === 'email' ? 'email' : field === 'message' ? 'textarea' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className={`w-full pl-10 pr-4 py-3 border ${
                errors[field] ? 'border-[var(--error-border)]' : 'border-[var(--border-light)] dark:border-slate-600'
              } rounded-lg text-[var(--text-strong)] dark:text-slate-200 bg-white dark:bg-slate-700 text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent placeholder-[var(--text-tertiary)] dark:placeholder-slate-400 ${
                field === 'message' ? 'h-32 resize-none' : ''
              }`}
              disabled={isSubmitting}
            />
            {errors[field] && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1 ml-1">{errors[field]}</p>
            )}
          </div>
        ))}

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-[#ffc107] hover:bg-[#ffb300] dark:bg-yellow-400 dark:hover:bg-yellow-300 text-black font-medium rounded-none transition-all duration-200 ease-in-out hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-[15px] shadow-md hover:shadow-lg flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black dark:text-slate-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;