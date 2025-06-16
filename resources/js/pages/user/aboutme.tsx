import React from 'react';
import Hero from '@/components/Hero.jpg';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'AboutMe',
        href: '/user/aboutme',
    },
];
function AboutMe() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
    <div className="bg-[#FFF3EF] text-[#3A2E2E] p-6 md:p-12 font-sans space-y-20">
      {/* Header Section */}
      <section className="text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Your Journey Begins Here</h1>
        <p className="text-lg max-w-xl mx-auto">Discover the wonders of Cambodia through our beautifully crafted tourism platform.</p>
          <img src="Hero" alt="placeholder"

          className="rounded-xl mx-auto mt-6 shadow-md"
        />
      </section>

      {/* Introduction */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <img src={Hero}  alt="Introduction" className="rounded-lg shadow-md" />
        <div>
          <h2 className="text-2xl font-bold mb-2">🌍 Introduction</h2>
          <p>
            This tourism website is built by IT engineering students with a passion for technology and nature. It’s a platform designed to promote the culture, heritage, and natural beauty of our country.
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">❗ Problem Statement</h2>
          <p>
            Tourists face difficulties in finding trusted travel information, especially for local or lesser-known destinations. Our platform solves this by providing a reliable and curated resource.
          </p>
        </div>
        <img src={Hero}  alt="Problem" className="rounded-lg shadow-md" />
      </section>

      {/* Project Scope */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <img src={Hero}  alt="Scope" className="rounded-lg shadow-md" />
        <div>
          <h2 className="text-2xl font-bold mb-2">📌 Project Scope</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Promote top and hidden attractions</li>
            <li>Showcase cultural events and food</li>
            <li>Offer bilingual content</li>
            <li>Support responsive web design</li>
          </ul>
        </div>
      </section>

      {/* Methodology */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">🛠️ Methodology</h2>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Research and user interviews</li>
            <li>UI/UX design with Tailwind</li>
            <li>Development using React & TypeScript</li>
            <li>Testing and deployment</li>
          </ol>
        </div>
        <img src={Hero}  alt="Methodology" className="rounded-lg shadow-md" />
      </section>

      {/* Architecture */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <img src={Hero}  alt="Architecture" className="rounded-lg shadow-md" />
        <div>
          <h2 className="text-2xl font-bold mb-2">🧩 System Architecture / Design</h2>
          <p>
            Our system features a React front-end with modular components, a secure backend, and an optimized database for storing travel information, images, and user reviews.
          </p>
        </div>
      </section>

      {/* Conclusion */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">🔚 Conclusion / Future Works</h2>
          <p>
            This website is the first step in promoting digital tourism. Future updates will include booking systems, personalized recommendations, and mobile app support.
          </p>
        </div>
        <img src={Hero}  alt="Future" className="rounded-lg shadow-md" />
      </section>
    </div>
    </AppLayout>
  );
}

export default AboutMe;