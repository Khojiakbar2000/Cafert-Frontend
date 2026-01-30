/**
 * Example usage of HorizontalTestimonials component
 * 
 * Import and use like this:
 */

import React from 'react';
import HorizontalTestimonials from './HorizontalTestimonials';

const exampleTestimonials = [
  {
    id: '1',
    quote: 'The best coffee experience I\'ve ever had. Every cup tells a story of quality and care.',
    author: 'Sarah Johnson',
    role: 'Coffee Enthusiast',
    avatar: '/img/cafe/cafe1.jpg',
    rating: 5,
  },
  {
    id: '2',
    quote: 'Amazing atmosphere and even better coffee. This place has become my daily ritual.',
    author: 'Michael Chen',
    role: 'Regular Customer',
    avatar: '/img/cafe/cafe2.jpg',
    rating: 5,
  },
  {
    id: '3',
    quote: 'The attention to detail in every brew is remarkable. Truly exceptional coffee.',
    author: 'Emily Rodriguez',
    role: 'Barista & Reviewer',
    avatar: '/img/cafe/cafe3.jpg',
    rating: 5,
  },
  {
    id: '4',
    quote: 'I\'ve traveled the world for coffee, and this place ranks among the very best.',
    author: 'David Thompson',
    role: 'Coffee Blogger',
    avatar: '/img/cafe/cafe1.jpg',
    rating: 5,
  },
  {
    id: '5',
    quote: 'The perfect blend of tradition and innovation. A must-visit for any coffee lover.',
    author: 'Lisa Anderson',
    role: 'Food Critic',
    avatar: '/img/cafe/cafe2.jpg',
    rating: 5,
  },
  {
    id: '6',
    quote: 'Outstanding quality and service. This is what coffee culture should be about.',
    author: 'James Wilson',
    role: 'Local Resident',
    avatar: '/img/cafe/cafe3.jpg',
    rating: 5,
  },
];

export default function TestimonialsExample() {
  return (
    <HorizontalTestimonials testimonials={exampleTestimonials} />
  );
}


