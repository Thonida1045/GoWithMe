import React from 'react';
import emailjs from '@emailjs/browser';
import Conclusion from '/public/assets/Conclusion.webp';
import Methodology from '/public/assets/Methodology.jpg';
import ProblemStatement from '/public/assets/Problem Statement.jpg';
import ProjectScope from '/public/assets/project scopt.jpg';
import Introduction from '/public/assets/introduction.png';
import style from '/public/assets/style.png'
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Car from '/public/assets/Car.gif';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'AboutMe',
        href: '/user/aboutme',
    },
];
function AboutMe() {
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    emailjs.sendForm('service_5b4419d', 'template_8xc60jm', e.target as HTMLFormElement, 'gKMY2VaAnQaLyJ9jg')
      .then(() => {
        alert('Message sent!');
      }, () => {
        alert('Failed to send message.');
      });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
    <div className="bg-[#FFF3EF] text-[#3A2E2E] p-6 md:p-12 font-sans space-y-20">
      {/* Header Section */}
      <section className="text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">Your Journey Begins Here</h1>
        <p className="text-lg max-w-xl mx-auto font-medium text-gray-700">Discover the wonders of Cambodia through our beautifully crafted tourism platform, built with modern web technologies for a seamless experience.</p>
        {/* <img src={Hero} alt="Hero" className="rounded-2xl mx-auto mt-6 shadow-lg border-2 border-blue-200" /> */}
      </section>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
        <img src={Car} alt="Travel Car" className=" object-contain drop-shadow-lg shadow-lg border-2 " />
        <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-100 max-w-2xl flex-1">
          <h2 className="text-2xl font-bold mb-2 text-blue-700">About This Project</h2>
          <p className="mb-2 text-gray-700">
            <span className="font-semibold text-blue-600">GoWithMe</span> is a modern tourism web application designed and developed by IT engineering students. Our mission is to promote Cambodia's culture, heritage, and natural beauty using the latest web technologies.
          </p>
          <ul className="list-disc pl-6 text-left text-gray-700 space-y-1">
            <li><span className="font-semibold">Backend:</span> <span className="text-purple-700">Laravel</span> (PHP framework) for robust APIs and secure business logic.</li>
            <li><span className="font-semibold">Frontend:</span> <span className="text-blue-700">React</span> + <span className="text-cyan-700">TypeScript</span> + <span className="text-teal-700">Tailwind CSS</span> for a fast, responsive, and beautiful user interface.</li>
            <li><span className="font-semibold">Database:</span> <span className="text-green-700">MySQL</span> for reliable data storage and management.</li>
            <li><span className="font-semibold">Features:</span> User authentication, blog posts, hotel listings, comments, and more.</li>
          </ul>
        </div>
      </div>
      {/* Tech Stack Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Our Tech Stack</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex flex-col items-center">
            <img src="https://laravel.com/img/logomark.min.svg" alt="Laravel" className="w-12 h-12 mb-2" />
            <span className="font-semibold text-red-600">Laravel</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" className="w-12 h-12 mb-2" />
            <span className="font-semibold text-blue-600">React</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://cdn.worldvectorlogo.com/logos/typescript.svg" alt="TypeScript" className="w-12 h-12 mb-2" />
            <span className="font-semibold text-cyan-700">TypeScript</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="Tailwind CSS" className="w-12 h-12 mb-2" />
            <span className="font-semibold text-teal-700">Tailwind CSS</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://cdn-icons-png.flaticon.com/512/919/919836.png" alt="MySQL" className="w-12 h-12 mb-2" />
            <span className="font-semibold text-green-700">MySQL</span>
          </div>
        </div>
      </section>
      {/* Introduction */}
      <section className="grid md:grid-cols-2 gap-8 items-center mt-12">
        <img src={Introduction}  alt="Introduction" className="rounded-xl shadow-md border border-gray-200" />
        <div>
          <h2 className="text-2xl font-bold mb-2 text-blue-700">🌍 Introduction</h2>
          <p className="text-gray-700">
            This tourism website is built by IT engineering students with a passion for technology and nature. It’s a platform designed to promote the culture, heritage, and natural beauty of our country.
          </p>
        </div>
      </section>
      {/* Problem Statement */}
      <section className="grid md:grid-cols-2 gap-8 items-center mt-12">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-pink-700">❗ Problem Statement</h2>
          <p className="text-gray-700">
            Tourists face difficulties in finding trusted travel information, especially for local or lesser-known destinations. Our platform solves this by providing a reliable and curated resource.
          </p>
        </div>
        <img src={ProblemStatement}  alt="Problem" className="rounded-xl shadow-md border border-gray-200" />
      </section>
      {/* Project Scope */}
      <section className="grid md:grid-cols-2 gap-8 items-center mt-12">
        <img src={ProjectScope}  alt="Scope" className="rounded-xl shadow-md border border-gray-200" />
        <div>
          <h2 className="text-2xl font-bold mb-2 text-green-700">📌 Project Scope</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Promote top and hidden attractions</li>
            <li>Showcase cultural events and food</li>
            <li>Offer bilingual content</li>
            <li>Support responsive web design</li>
          </ul>
        </div>
      </section>
      {/* Methodology */}
      <section className="grid md:grid-cols-2 gap-8 items-center mt-12">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-purple-700">🛠️ Methodology</h2>
          <ol className="list-decimal pl-6 space-y-1 text-gray-700">
            <li>Research and user interviews</li>
            <li>UI/UX design with Tailwind</li>
            <li>Development using React & TypeScript</li>
            <li>Testing and deployment</li>
          </ol>
        </div>
        <img src={Methodology}  alt="Methodology" className="rounded-xl shadow-md border border-gray-200" />
      </section>
      {/* Architecture */}
      <section className="grid md:grid-cols-2 gap-8 items-center mt-12">
        <img src={style}  alt="Architecture" className="rounded-xl shadow-md border border-gray-200" />
        <div>
          <h2 className="text-2xl font-bold mb-2 text-cyan-700">🧩 System Architecture / Design</h2>
          <p className="text-gray-700">
            Our system features a React front-end with modular components, a secure backend, and an optimized database for storing travel information, images, and user reviews.
          </p>
        </div>
      </section>
      {/* Conclusion */}
      <section className="grid md:grid-cols-2 gap-8 items-center mt-12">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">🔚 Conclusion / Future Works</h2>
          <p className="text-gray-700">
            This website is the first step in promoting digital tourism. Future updates will include booking systems, personalized recommendations, and mobile app support.
          </p>
        </div>
        <img src={Conclusion}  alt="Future" className="rounded-xl shadow-md border border-gray-200" />
      </section>
      {/* Contact Form */}
      <section className="max-w-xl mx-auto mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">📧 Contact Me</h2>
        <form
          className="space-y-4"
          onSubmit={sendEmail}
        >
          <div>
            <label htmlFor="email" className="block font-semibold mb-1 text-gray-700">Your Email</label>
            <input
              type="email"
              id="email"
              name="user_email"
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block font-semibold mb-1 text-gray-700">Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
              placeholder="Type your message here..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white font-bold py-2 rounded shadow-md hover:from-blue-500 hover:to-pink-500 transition"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
    </AppLayout>
  );
}

export default AboutMe;