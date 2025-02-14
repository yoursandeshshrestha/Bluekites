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
        {/* About Us Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-lg leading-relaxed">
            Regardless of a person&apos;s location, our goal at Blue Kites is to
            make education interesting, approachable, and life-changing for
            everybody. We are committed to closing the gaps in education and
            technology that exist in rural regions so that every student may
            succeed. Our platform offers a comprehensive approach to learning
            that covers everything from basic topics to creative arts, with the
            goal of fostering meaningful relationships between educators and
            students.
          </p>
        </section>

        {/* Education Gap Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4">
            Filling the Education Gap in Rural Areas
          </h2>
          <p className="text-lg leading-relaxed">
            Modern technologies and high-quality education are still difficult
            to get by in many rural areas. Our goal at Blue Kites is to help
            children in these underprivileged regions overcome these obstacles
            by offering them top-notch educational materials that are
            specifically designed to match their requirements. Our mission is to
            provide every student with the skills and information necessary to
            thrive in a world that is becoming more and more digital.
          </p>
        </section>

        {/* Teacher-Student Relationship Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4">
            Cultivating Friendly Relationships
          </h2>
          <p className="text-lg leading-relaxed">
            We think that the relationships between instructors and students are
            the cornerstone of a successful educational program. Open
            communication is sometimes impeded in traditional educational
            environments, making pupils reluctant to voice their opinions or ask
            questions. We remove these obstacles at Blue Kites by creating a
            welcoming, cooperative, and helpful learning environment.
          </p>
        </section>

        {/* Holistic Approach Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4">
            A Holistic Approach to Learning
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg">
                Education is about more than earning good grades; it&apos;s also
                about being creative and growing yourself. For this reason, Blue
                Kites provides an extensive selection of courses that meet the
                needs of students at all skill levels, including advanced skills
                and the creative arts.
              </p>
            </div>
            <div>
              <p className="text-lg">
                We are committed to fostering the full person and assisting
                students in their intellectual and artistic growth. Our platform
                is intended to help your progress, whether you are an adult
                looking to learn new skills or a student just starting your
                educational path.
              </p>
            </div>
          </div>
        </section>

        {/* Empowering Teachers Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4">
            Empowering Teachers, Supporting Local Talent
          </h2>
          <p className="text-lg leading-relaxed">
            Local educators are frequently unable to compete in the current
            educational environment against big, well-known companies. By giving
            local educators the support and resources they require to thrive,
            Blue Kites aims to alter that. We recognize the skill of
            neighbourhood tutors and provide them with a platform to spread
            their message and have a big influence on their communities.
          </p>
        </section>

        {/* Affordable Learning Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4">
            Affordable Learning for a Lifetime Access
          </h2>
          <p className="text-lg leading-relaxed">
            We think that access to high-quality education should not be
            compromised by cost. For this reason, we provide a special pricing
            structure that only requires a single purchase and gives lifetime
            access to our vast course collection. With this strategy, students
            won&apos;t have to worry about paying recurring fees or signing up
            for subscriptions and may continue to access and utilize our
            services for the rest of their life.
          </p>
        </section>

        {/* Vision Section */}
        <section className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg leading-relaxed">
            Our vision is to transform education by establishing an
            international platform that places a strong emphasis on empowerment,
            inclusivity, and creativity—particularly in rural areas. No matter
            where they live or how much money they make, everyone should have
            access to high-quality education and technology in order to close
            the achievement gap.
          </p>
        </section>

        {/* Leadership Team Section */}
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
