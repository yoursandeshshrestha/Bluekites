import React from "react";
import Image from "next/image";

const About = () => {
  const leadershipTeam = [
    {
      name: "Nilanjan Ganguly",
      position: "Founder & CEO",
      image: "/assets/1.jpeg",
    },
    {
      name: "Rajdip Paul",
      position: "Managing Director",
      image: "/assets/3.jpeg",
    },
    {
      name: "Arijit Banerjee",
      position: "Helping Hand",
      image: "/assets/2.jpeg",
    },
  ];

  return (
    <div className="max-w-6xl pt-[150px] mx-auto px-4 py-12 text-black dark:text-white">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          What is{" "}
          <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
            Bluekites?
          </span>
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
          Transforming education through accessibility, innovation, and
          community empowerment
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-12 mb-16">
        <section>
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-lg leading-relaxed">
            At Blue Kites, our mission is to make education engaging,
            accessible, and transformative for everyone, regardless of their
            location. We're dedicated to bridging educational and technological
            gaps in rural areas, ensuring every student has the opportunity to
            succeed. Our platform provides a comprehensive learning approach,
            from fundamental subjects to creative arts, while fostering
            meaningful connections between educators and learners.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">
            Filling the Education Gap in Rural Areas
          </h2>
          <p className="text-lg leading-relaxed">
            Many rural areas still lack access to modern technologies and
            quality education. At Blue Kites, we're committed to helping
            children in these underserved regions overcome these challenges by
            providing high-quality educational resources specifically tailored
            to their needs. Our goal is to equip every student with the
            knowledge and skills needed to thrive in an increasingly digital
            world.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Our Approach</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Holistic Learning</h3>
              <p className="text-lg">
                Education extends beyond grades to embrace creativity and
                personal growth. Blue Kites offers a comprehensive course
                selection catering to all skill levels, including advanced
                capabilities and creative arts.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Lifetime Access</h3>
              <p className="text-lg">
                We believe quality education shouldn't be limited by cost. Our
                unique pricing model offers lifetime access with a single
                purchase, ensuring continuous learning without recurring fees.
              </p>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Our Leadership Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {leadershipTeam.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full shadow-lg hover:shadow-xl transition-shadow">
                  <Image
                    src={member.image}
                    alt={member.name}
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    width={192}
                    height={192}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-blue-500 dark:text-blue-400 mb-2">
                  {member.position}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-lg mb-6">
            Help us bring education, opportunity, and empowerment to every
            corner of the world. Together, we can create a future where
            knowledge truly has no limits.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors">
            Get Started Today
          </button>
        </section>
      </div>
    </div>
  );
};

export default About;
