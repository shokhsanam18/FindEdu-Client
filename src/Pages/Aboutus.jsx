// import { useState, useEffect, useRef } from "react";
// import aboutus from "/public/aboutus.png";
// import about1 from "/public/about1.png";
// import mission from "/public/mission.png";
// import students from "/public/students.png";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   FaQuoteLeft,
//   FaUserGraduate,
//   FaSchool,
//   FaTrophy,
// } from "react-icons/fa";

// const logos = [
//   { src: "/public/everest.png", width: 250, height: 180 },
//   { src: "/public/najot.png", width: 220, height: 160 },
//   { src: "/public/inter.png", className: "mt-14", width: 290, height: 80 },
//   { src: "/public/cambridge.png", width: 250, height: 180 },
//   { src: "/public/thompson.png", width: 250, height: 230 },
//   { src: "/public/kings.png", width: 160, height: 140, className: "mt-10" },
//   { src: "/public/result.png", className: "mt-13", width: 300, height: 80 },
//   { text: "PROWEB", className: "text-5xl font-bold mt-16" },
// ];

// // Duplicate the logos array to create seamless looping
// const duplicatedLogos = [...logos, ...logos];

// const Counter = ({ target, label, icon: Icon }) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let start = 0;
//     const end = target;
//     if (start === end) return;

//     const incrementTime = 5000 / end;
//     let timer = setInterval(() => {
//       start += 1;
//       setCount(start);
//       if (start === end) clearInterval(timer);
//     }, incrementTime);

//     return () => clearInterval(timer);
//   }, [target]);

//   return (
//     <motion.div
//       className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg"
//       initial={{ opacity: 0, y: 20 }} 
//       whileInView={{ opacity: 1, y: 0 }} 
//       transition={{ duration: 0.6 }} 
//       viewport={{ once: true }}
//     >
//       <Icon className="text-[#461773] text-4xl mb-3" />
//       <motion.h3
//         className="text-4xl font-bold text-gray-900" 
//         initial={{ opacity: 0 }} 
//         whileInView={{ opacity: 1 }}  
//         transition={{ duration: 1, delay: 0.2 }}
//       >
//         {count.toLocaleString()}+
//       </motion.h3>
//       <p className="text-gray-600">{label}</p>
//     </motion.div>
//   );
// };

// const ScrollingLogos = () => {
//   const containerRef = useRef(null);
//   const [animationDuration, setAnimationDuration] = useState(40);

//   useEffect(() => {
//     const calculateDuration = () => {
//       if (containerRef.current) {
//         const containerWidth = containerRef.current.scrollWidth;
//         const viewportWidth = window.innerWidth;
//         const newDuration = Math.max(30, containerWidth / viewportWidth * 20);
//         setAnimationDuration(newDuration);
//       }
//     };

//     calculateDuration();
//     window.addEventListener('resize', calculateDuration);
//     return () => window.removeEventListener('resize', calculateDuration);
//   }, []);

//   return (
//     <div className="overflow-hidden py-10 w-full">
//       <motion.div
//         ref={containerRef}
//         className="flex"
//         animate={{
//           x: ['0%', `-${100 / duplicatedLogos.length * logos.length}%`],
//         }}
//         transition={{
//           duration: animationDuration,
//           ease: "linear",
//           repeat: Infinity,
//         }}
//       >
//         {duplicatedLogos.map((logo, index) => (
//           <motion.div
//             key={index}
//             className="flex-shrink-0 px-4"
//             whileHover={{ scale: 1.05 }}
//           >
//             {logo.src ? (
//               <img
//                 src={logo.src}
//                 alt="Education Center"
//                 className={`max-w-full max-h-full cursor-pointer block ${logo.className || ""}`}
//                 style={{
//                   width: `${Math.min(logo.width, window.innerWidth * 0.8)}px`,
//                   height: `${logo.height}px`,
//                 }}
//               />
//             ) : (
//               <div className={`text-center cursor-pointer ${logo.className}`}>
//                 {logo.text}
//               </div>
//             )}
//           </motion.div>
//         ))}
//       </motion.div>
//     </div>
//   );
// };

// const About = () => {
//   return (
//     <div className="overflow-x-hidden mt-20">
//       {/* Hero Section */}
//       <motion.div
//         initial={{ opacity: 0, y: -50 }} 
//         animate={{ opacity: 1, y: 0 }} 
//         transition={{ duration: 0.8 }}
//         className="relative flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 min-h-[60vh] text-white bg-cover bg-center"
//         style={{ backgroundImage: "url('/aboutus.png')" }}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//         <motion.div
//           initial={{ opacity: 0, x: -50 }} 
//           animate={{ opacity: 1, x: 0 }} 
//           transition={{ duration: 0.8, delay: 0.3 }}
//           className="relative z-10 max-w-3xl px-4 md:px-8 text-start mt-16 md:mt-0"
//         >
//           <p className="text-lg md:text-xl mt-4 md:mt-0">Helping You Find the Best Education Centers!</p>
//           <h1 className="text-3xl md:text-7xl font-bold">About Us</h1>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, x: 50 }} 
//           animate={{ opacity: 1, x: 0 }} 
//           transition={{ duration: 0.8, delay: 0.6 }}
//           className="relative z-10 flex flex-col md:flex-row gap-1 md:gap-2 ml-4 md:mr-10 md:text-xl mt-4 md:mt-0"
//         >
//           <div className="flex gap-2">
//             <Link to="/" className="no-underline hover:underline text-white">Home</Link>
//             <p>|</p>
//             <Link to="/" className="text-[#bbbbbb] no-underline hover:underline">
//               About Us
//             </Link>
//           </div>
//         </motion.div>
//       </motion.div>

//       {/* Main Content */}
//       <div className="bg-gray-100 py-8 md:py-10">
//         {/* Success Section */}
//         <motion.div
//           className="text-center px-4 md:px-12"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <h2 className="text-2xl md:text-5xl font-semibold text-[#461773] mt-5 mx-4 md:mx-0">
//             Preparing Students to Achieve Success
//           </h2>
//           <div className="mt-4 w-16 h-1 bg-yellow-400 mx-auto mb-8 md:mb-10"></div>

//           <div className="mt-8 md:mt-12 flex flex-col-reverse md:flex-row justify-center items-center gap-8 md:gap-12">
//             <motion.div
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8, delay: 0.3 }}
//               className="max-w-md text-center md:text-left mx-4 md:mx-0"
//             >
//               <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
//                 Developing Confident and Successful Learners
//               </h3>
//               <p className="text-gray-600 mt-3 md:mt-4 leading-relaxed">
//                 Our platform helps students find education centers tailored to
//                 their interests, budget, and region, ensuring the best learning
//                 experience.
//               </p>

//               <Link to="/">
//                 <button className="mt-4 md:mt-6 px-6 md:px-9 py-3 md:py-4 bg-[#461773] text-white font-semibold rounded-full shadow-lg hover:bg-[#775fb0] cursor-pointer transition">
//                   View More
//                 </button>
//               </Link>

//               <motion.div
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.8, delay: 0.5 }}
//                 className="mt-6 md:mt-8 p-4 bg-gray-100 rounded-lg shadow-md flex items-start gap-4"
//               >
//                 <FaQuoteLeft className="text-[#461773] text-2xl" />
//                 <p className="text-gray-700 italic leading-relaxed">
//                   This platform made it easy for me to find the perfect learning
//                   center. Highly recommended!"
//                 </p>
//               </motion.div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//               className="w-full md:w-1/2 flex justify-center"
//             >
//               <motion.img
//                 src={students}
//                 alt="Education Showcase"
//                 className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow-md mb-6 md:mb-10"
//               />
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Impact Section */}
//         <div className="relative py-10 md:py-15 bg-gradient-to-b from-white to-gray-100 text-center">
//           <motion.h2
//             className="text-3xl md:text-5xl font-semibold text-[#461773] mb-8 md:mb-14"
//             initial={{ opacity: 0, y: -20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             Our Impact
//           </motion.h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 justify-center items-center mx-auto max-w-4xl px-4 md:px-0">
//             <Counter
//               target={250}
//               label="Registered Users"
//               icon={FaUserGraduate}
//             />
//             <Counter target={120} label="Education Centers" icon={FaSchool} />
//             <Counter target={80} label="Success Stories" icon={FaTrophy} />
//           </div>
//         </div>

//         {/* Mission Section */}
//         <div className="relative py-12 md:py-20 bg-gradient-to-b from-gray-100 to-white text-center">
//           <motion.h2
//             className="text-3xl md:text-5xl font-semibold text-[#461773]"
//             initial={{ opacity: 0, y: -20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             Our Mission
//           </motion.h2>
//           <div className="mt-4 w-16 h-1 bg-yellow-400 mx-auto"></div>

//           <div className="mt-8 md:mt-12 flex flex-col md:flex-row justify-center items-center md:space-x-12 px-4 md:px-0">
//             <motion.div
//               className="max-w-md text-center md:text-left"
//               initial={{ opacity: 0, x: -50 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8 }}
//             >
//               <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
//                 Empowering Learners for a Brighter Future
//               </h3>
//               <p className="text-gray-600 mt-3 md:mt-4 leading-relaxed">
//                 We aim to bridge the gap between students and quality education
//                 by providing a seamless platform that connects learners with top
//                 educational institutions. Our goal is to ensure that every
//                 student has access to personalized learning experiences that
//                 lead to success.
//               </p>
//               <Link to="/register">
//                 <button
//                   className="mt-4 md:mt-6 px-8 md:px-14 py-3 md:py-4 bg-[#461773] text-white font-semibold rounded-full shadow-lg 
//                   hover:bg-[#775fb0] cursor-pointer transition w-full md:w-auto mx-auto block md:inline"
//                 >
//                   Register
//                 </button>
//               </Link>
//             </motion.div>

//             <motion.div
//               className="mt-6 md:mt-0"
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8 }}
//             >
//               <img
//                 src={mission}
//                 alt="Our Mission"
//                 className="w-64 md:w-96 rounded-lg shadow-xl mx-auto md:mx-0"
//               />
//             </motion.div>
//           </div>
//         </div>

//         {/* Vision Section */}
//         <div className="relative py-12 md:py-20 bg-gradient-to-b from-white to-gray-100 text-center px-4 md:px-0">
//           <motion.h2
//             className="text-3xl md:text-5xl font-semibold text-[#461773]"
//             initial={{ opacity: 0, y: -20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             Our Vision
//           </motion.h2>
//           <div className="mt-4 w-16 h-1 bg-yellow-400 mx-auto"></div>

//           <div className="mt-8 md:mt-12 flex flex-col md:flex-row-reverse justify-center items-center gap-8 md:gap-20">
//             <motion.div
//               className="max-w-md text-center md:text-left"
//               initial={{ opacity: 0, x: 50 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8 }}
//             >
//               <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
//                 Shaping the Future of Education
//               </h3>
//               <p className="text-gray-600 mt-3 md:mt-4 leading-relaxed">
//                 Our vision is to become the world's leading educational
//                 matchmaking platform, ensuring every student finds the right
//                 learning resources, institutions, and guidance to excel in their
//                 academic journey.
//               </p>
//               <Link to="/register">
//                 <button
//                   className="mt-4 md:mt-6 px-8 md:px-14 py-3 md:py-4 bg-[#461773] text-white font-semibold rounded-full shadow-lg 
//                   hover:bg-[#775fb0] cursor-pointer transition w-full md:w-auto mx-auto block md:inline"
//                 >
//                   Register
//                 </button>
//               </Link>
//             </motion.div>

//             <motion.div
//               className="mt-6 md:mt-0"
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8 }}
//             >
//               <img
//                 src={about1}
//                 alt="Our Vision"
//                 className="w-64 md:w-96 rounded-lg shadow-xl mx-auto"
//               />
//             </motion.div>
//           </div>
//         </div>

//         {/* Logos Section */}
//         <div className="text-center px-4">
//           <h2 className="text-2xl md:text-5xl font-semibold text-[#461773]">
//             Your Guide to Education Centers
//           </h2>
//           <div className="mt-4 w-16 h-1 bg-yellow-400 mx-auto mb-8 md:mb-17"></div>
//           <ScrollingLogos />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default About;









import { useState, useEffect, useRef } from "react";
import aboutus from "/public/aboutus.png";
import about1 from "/public/about1.png";
import mission from "/public/mission.png";
import students from "/public/students.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaQuoteLeft,
  FaUserGraduate,
  FaSchool,
  FaTrophy,
} from "react-icons/fa";

import everest from "/public/everest.png";
import najot from "/public/najot.png";
import inter from "/public/inter.png";
import cambridge from "/public/cambridge.png";
import thompson from "/public/thompson.png";
import kings from "/public/kings.png";
import result from "/public/result.png";

const logos = [
  { 
    src: everest, 
    width: 250, 
    height: 180, 
    link: "https://www.everesteducation.com/",
    alt: "Everest Education",
    className: ""
  },
  { 
    src: najot, 
    width: 220, 
    height: 160, 
    link: "https://najottalim.uz/",
    alt: "Najot Ta'lim",
    className: ""
  },
  { 
    src: inter, 
    width: 290, 
    height: 80, 
    link: "https://www.inter-nationes.uz/",
    alt: "Inter Nationes",
    className: "mt-14"
  },
  { 
    src: cambridge, 
    width: 250, 
    height: 180, 
    link: "https://www.cambridge.uz/",
    alt: "Cambridge",
    className: ""
  },
  { 
    src: thompson, 
    width: 250, 
    height: 230, 
    link: "https://thompsonreuters.com/",
    alt: "Thompson Reuters",
    className: ""
  },
  { 
    src: kings, 
    width: 160, 
    height: 140, 
    link: "https://www.kingseducation.uz/",
    alt: "Kings Education",
    className: "mt-10"
  },
  { 
    src: result, 
    width: 300, 
    height: 80, 
    link: "https://www.result.school.uz/",
    alt: "Result School",
    className: "mt-13"
  },
  { 
    text: "PROWEB", 
    link: "https://proweb.uz/",
    alt: "Proweb",
    className: "text-5xl font-bold mt-16"
  },
];

const Counter = ({ target, label, icon: Icon }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    const incrementTime = 5000 / end;
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <motion.div
      className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }} 
      viewport={{ once: true }}
    >
      <Icon className="text-[#461773] text-4xl mb-3" />
      <motion.h3
        className="text-4xl font-bold text-gray-900" 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }}  
        transition={{ duration: 1, delay: 0.2 }}
      >
        {count.toLocaleString()}+
      </motion.h3>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  );
};

const ScrollingLogos = () => {
  const duplicatedLogos = [...logos, ...logos];
  const containerRef = useRef(null);
  const [animationDuration, setAnimationDuration] = useState(40);

  useEffect(() => {
    const calculateDuration = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const newDuration = Math.max(30, containerWidth / viewportWidth * 20);
        setAnimationDuration(newDuration);
      }
    };

    calculateDuration();
    window.addEventListener('resize', calculateDuration);
    return () => window.removeEventListener('resize', calculateDuration);
  }, []);

  return (
    <div className="overflow-hidden py-10 w-full">
      <motion.div
        ref={containerRef}
        className="flex"
        animate={{
          x: ['0%', `-${100 / duplicatedLogos.length * logos.length}%`],
        }}
        transition={{
          duration: animationDuration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <motion.div
            key={index}
            className="flex-shrink-0 px-4"
            whileHover={{ scale: 1.05 }}
          >
            <a
              href={logo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {logo.src ? (
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`max-w-full max-h-full cursor-pointer block ${logo.className || ""}`}
                  style={{
                    width: `${logo.width}px`,
                    height: `${logo.height}px`,
                  }}
                />
              ) : (
                <div className={`text-center cursor-pointer ${logo.className}`}>
                  {logo.text}
                </div>
              )}
            </a>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const About = () => {
  return (
    <div className="overflow-x-hidden mt-18">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="relative flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 min-h-[60vh] text-white bg-cover bg-center"
        style={{ backgroundImage: `url(${aboutus})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <motion.div
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 max-w-3xl px-4 md:px-8 text-start mt-16 md:mt-0"
        >
          <p className="text-lg md:text-xl mt-4 md:mt-0">Helping You Find the Best Education Centers!</p>
          <h1 className="text-3xl md:text-7xl font-bold">About Us</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 flex flex-col md:flex-row gap-1 md:gap-2 ml-4 md:mr-10 md:text-xl mt-4 md:mt-0"
        >
          <div className="flex gap-2">
            <Link to="/" className="no-underline hover:underline text-white">Home</Link>
            <p>|</p>
            <Link to="/" className="text-[#bbbbbb] no-underline hover:underline">
              About Us
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="bg-gray-100 py-8 md:py-10">
        {/* Success Section */}
        <motion.div
          className="text-center px-4 md:px-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-5xl font-semibold text-[#461773] mt-5 mx-4 md:mx-0">
            Preparing Students to Achieve Success
          </h2>
          <div className="mt-4 w-16 h-1 bg-yellow-400 mx-auto mb-8 md:mb-10"></div>

          <div className="mt-8 md:mt-12 flex flex-col-reverse md:flex-row justify-center items-center gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-md text-center md:text-left mx-4 md:mx-0"
            >
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                Developing Confident and Successful Learners
              </h3>
              <p className="text-gray-600 mt-3 md:mt-4 leading-relaxed">
                Our platform helps students find education centers tailored to
                their interests, budget, and region, ensuring the best learning
                experience.
              </p>

              <Link to="/">
                <button className="mt-4 md:mt-6 px-6 md:px-9 py-3 md:py-4 bg-[#461773] text-white font-semibold rounded-full shadow-lg hover:bg-[#775fb0] cursor-pointer transition">
                  View More
                </button>
              </Link>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-6 md:mt-8 p-4 bg-gray-100 rounded-lg shadow-md flex items-start gap-4"
              >
                <FaQuoteLeft className="text-[#461773] text-2xl" />
                <p className="text-gray-700 italic leading-relaxed">
                  This platform made it easy for me to find the perfect learning
                  center. Highly recommended!"
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full md:w-1/2 flex justify-center"
            >
              <motion.img
                src={students}
                alt="Education Showcase"
                className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow-md mb-6 md:mb-10"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Impact Section */}
        <div className="relative py-10 md:py-15 bg-gradient-to-b from-white to-gray-100 text-center">
          <motion.h2
            className="text-3xl md:text-5xl font-semibold text-[#461773] mb-8 md:mb-14"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Impact
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 justify-center items-center mx-auto max-w-4xl px-4 md:px-0">
            <Counter
              target={250}
              label="Registered Users"
              icon={FaUserGraduate}
            />
            <Counter target={120} label="Education Centers" icon={FaSchool} />
            <Counter target={80} label="Success Stories" icon={FaTrophy} />
          </div>
        </div>

        {/* Mission Section */}
        <div className="relative py-12 md:py-20 bg-gradient-to-b from-gray-100 to-white text-center">
          <motion.h2
            className="text-3xl md:text-5xl font-semibold text-[#461773]"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Mission
          </motion.h2>
          <div className="mt-4 w-16 h-1 bg-yellow-400 mx-auto"></div>

          <div className="mt-8 md:mt-12 flex flex-col md:flex-row justify-center items-center md:space-x-12 px-4 md:px-0">
            <motion.div
              className="max-w-md text-center md:text-left"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                Empowering Learners for a Brighter Future
              </h3>
              <p className="text-gray-600 mt-3 md:mt-4 leading-relaxed">
                We aim to bridge the gap between students and quality education
                by providing a seamless platform that connects learners with top
                educational institutions. Our goal is to ensure that every
                student has access to personalized learning experiences that
                lead to success.
              </p>
              <Link to="/register">
                <button
                  className="mt-4 md:mt-6 px-8 md:px-14 py-3 md:py-4 bg-[#461773] text-white font-semibold rounded-full shadow-lg 
                  hover:bg-[#775fb0] cursor-pointer transition w-full md:w-auto mx-auto block md:inline"
                >
                  Register
                </button>
              </Link>
            </motion.div>

            <motion.div
              className="mt-6 md:mt-0"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={mission}
                alt="Our Mission"
                className="w-64 md:w-96 rounded-lg shadow-xl mx-auto md:mx-0"
              />
            </motion.div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="relative py-12 md:py-20 bg-gradient-to-b from-white to-gray-100 text-center px-4 md:px-0">
          <motion.h2
            className="text-3xl md:text-5xl font-semibold text-[#461773]"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Vision
          </motion.h2>
          <div className="mt-4 w-16 h-1 bg-yellow-400 mx-auto"></div>

          <div className="mt-8 md:mt-12 flex flex-col md:flex-row-reverse justify-center items-center gap-8 md:gap-20">
            <motion.div
              className="max-w-md text-center md:text-left"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                Shaping the Future of Education
              </h3>
              <p className="text-gray-600 mt-3 md:mt-4 leading-relaxed">
                Our vision is to become the world's leading educational
                matchmaking platform, ensuring every student finds the right
                learning resources, institutions, and guidance to excel in their
                academic journey.
              </p>
              <Link to="/register">
                <button
                  className="mt-4 md:mt-6 px-8 md:px-14 py-3 md:py-4 bg-[#461773] text-white font-semibold rounded-full shadow-lg 
                  hover:bg-[#775fb0] cursor-pointer transition w-full md:w-auto mx-auto block md:inline"
                >
                  Register
                </button>
              </Link>
            </motion.div>

            <motion.div
              className="mt-6 md:mt-0"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={about1}
                alt="Our Vision"
                className="w-64 md:w-96 rounded-lg shadow-xl mx-auto"
              />
            </motion.div>
          </div>
        </div>

        {/* Logos Section */}
        <div className="text-center px-4">
          <h2 className="text-2xl md:text-5xl font-semibold text-[#461773]">
            Your Guide to Education Centers
          </h2>
          <div className="mt-4 w-16 h-1 bg-yellow-400 mx-auto mb-8 md:mb-17"></div>
          <ScrollingLogos />
        </div>
      </div>
    </div>
  );
};

export default About;