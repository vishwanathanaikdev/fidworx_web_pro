import { Link } from "react-router-dom";
import { useState } from "react";
// import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-cyan-950 text-white pt-10">
      {/* Brand */}
      <div className="px-6 text-center md:text-left mb-8">
         {/* Logo */}
         <h1 className="text-4xl font-bold text-white glow-text drop-shadow-lg">
          FidWorx
        </h1>
        <p className="mt-2 text-sm tracking-widest uppercase text-gray-200">
          Redefining Real Estate
        </p>
      </div>

      {/* Footer Sections */}
      <div className="px-6 mx-auto max-w-7xl">
        {/* Address */}
        {/* <div className="mb-6">
          <h4 className="mb-2 font-semibold">Bangalore</h4>
          <p className="leading-relaxed text-sm">
            Fidelitus Corp, Brigade Software Park, No. 43, Ground/First Block,
            <br />
            27th Cross, Banashankari 2nd Stage,
            <br />
            Bangalore - 560070, Karnataka.
          </p>
          <p className="mt-2 text-sm">📞 +91 9663022237</p>
          <p className="text-sm">✉️ info@fidelituscorp.com</p>
        </div> */}
        <div className="mb-6">
  <h4 className="mb-2 font-semibold">Bangalore</h4>
  <p className="leading-relaxed text-sm">
    Fidelitus Corp, Brigade Software Park, No. 43, Ground/First Block,
    <br />
    27th Cross, Banashankari 2nd Stage,
    <br />
    Bangalore - 560070, Karnataka.
  </p>

  {/* Phone */}
  <p className="mt-2 flex items-center gap-2 text-sm">
    <FaPhoneAlt className="text-yellow-300" /> +91 9663022237
  </p>

  {/* Email */}
  <p className="flex items-center gap-2 text-sm">
    <FaEnvelope className="text-yellow-300" /> info@fidelituscorp.com
  </p>
</div>

        {/* Mobile Accordion */}
        <div className="md:grid md:grid-cols-3 md:gap-8">
          {[
            {
              title: "Quick Links",
              items: [
                { name: "Home", path: "/" },
                { name: "About", path: "/about" }, // ✅ linked
                { name: "Why Us", path: "#" },
                { name: "Contact Us", path: "#" },
                { name: "Our Blogs", path: "#" },
                { name: "Careers", path: "#" },
              ],
            },
            {
              title: "Services",
              items: [
                { name: "HR Labs", path: "#" },
                { name: "Projects", path: "#" },
                { name: "Facility Management", path: "#" },
                { name: "Fidelitus Gallery", path: "#" },
              ],
            },
            {
              title: "Transactions",
              items: [{ name: "Shilpa Foundation", path: "#" }],
            },
          ].map((section, index) => (
            <div key={index} className="mb-4 md:mb-0">
              {/* Header clickable on mobile */}
              <h4
                className="flex items-center justify-between font-semibold cursor-pointer md:cursor-default md:mb-2"
                onClick={() => toggleSection(index)}
              >
                {section.title}
                <span className="md:hidden">
                  {openSection === index ? "−" : "+"}
                </span>
              </h4>

              {/* Items */}
              <ul
                className={`mt-2 space-y-2 md:mt-0 md:space-y-2 overflow-hidden transition-all duration-300 ${
                  openSection === index || window.innerWidth >= 768
                    ? "max-h-96"
                    : "max-h-0"
                }`}
              >
                {section.items.map((item, i) => (
                  <li key={i} className="text-sm hover:text-yellow-300">
                    {item.path && item.path !== "#" ? (
                      <Link to={item.path}>{item.name}</Link>
                    ) : (
                      item.name
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media */}
        <div className="flex justify-center gap-5 text-lg mt-6">
          <a href="#" className="hover:text-blue-500" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-sky-400" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a
            href="https://www.instagram.com/fidelitus.corp?igsh=MjJ3ZHhpNXpnNzEw"
            className="hover:text-pink-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-blue-400" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="px-6 mt-8 text-xs text-center text-gray-200 border-t border-gray-400 pt-4">
        ©️ 2025 Fidelitus Real Estate Transaction Services. All Rights Reserved.
      </div>
    </footer>
  );
}





// import { useState } from "react";
// import { Link } from "react-router-dom";

// import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

// export default function Footer() {
//   const [openSection, setOpenSection] = useState(null);

//   const toggleSection = (section) => {
//     setOpenSection(openSection === section ? null : section);
//   };

//   return (
//     <footer className="bg-[#16607B] text-white pt-10">
//       {/* Brand */}
//       <div className="px-6 text-center md:text-left mb-8">
//         <h1 className="relative inline-block text-4xl md:text-6xl font-extrabold tracking-wider drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
//           <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-white to-teal-200">
//             Fidco
//           </span>
//           <span className="absolute text-white left-1 top-1 opacity-10">Fidco</span>
//         </h1>
//         <p className="mt-2 text-sm tracking-widest uppercase text-gray-200">
//           Redefining Real Estate
//         </p>
//       </div>

//       {/* Footer Sections */}
//       <div className="px-6 mx-auto max-w-7xl">
//         {/* Address */}
//         <div className="mb-6">
//           <h4 className="mb-2 font-semibold">Bangalore</h4>
//           <p className="leading-relaxed text-sm">
//             Fidelitus Corp, Brigade Software Park, No. 43, Ground/First Block,
//             <br />
//             27th Cross, Banashankari 2nd Stage,
//             <br />
//             Bangalore - 560070, Karnataka.
//           </p>
//           <p className="mt-2 text-sm">📞 +91 9663022237</p>
//           <p className="text-sm">✉️ info@fidelituscorp.com</p>
//         </div>

//         {/* Mobile Accordion */}
//         <div className="md:grid md:grid-cols-3 md:gap-8">
//           {[
//             {
//               title: "Quick Links",
//               items: ["Home", "About", "Explore Spaces", "Contact Us", "Our Blogs", "Careers"],
//             },
//             {
//               title: "Services",
//               items: ["HR Labs", "Projects", "Facility Management", "Fidelitus Gallery"],
//             },
//             {
//               title: "Transactions",
//               items: ["Shilpa Foundation"],
//             },
//           ].map((section, index) => (
//             <div key={index} className="mb-4 md:mb-0">
//               {/* Header clickable on mobile */}
//               <h4
//                 className="flex items-center justify-between font-semibold cursor-pointer md:cursor-default md:mb-2"
//                 onClick={() => toggleSection(index)}
//               >
//                 {section.title}
//                 <span className="md:hidden">{openSection === index ? "−" : "+"}</span>
//               </h4>

//               {/* Items */}
//               <ul
//                 className={`mt-2 space-y-2 md:mt-0 md:space-y-2 overflow-hidden transition-all duration-300 ${
//                   openSection === index || window.innerWidth >= 768 ? "max-h-96" : "max-h-0"
//                 }`}
//               >
//                 {section.items.map((item, i) => (
//                   <li
//                     key={i}
//                     className="text-sm hover:text-yellow-300 cursor-pointer"
//                   >
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

   
//          {/* Social Media */}
//          {/* <div className="flex justify-center gap-5 text-lg">
//           <a href="#" className="hover:text-blue-500"><FaFacebookF /></a>
//           <a href="#" className="hover:text-sky-400"><FaTwitter /></a>
//           <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
//           <a href="#" className="hover:text-blue-400"><FaLinkedinIn /></a>
//         </div> */}
//         {/* Social Media */}
// <div className="flex justify-center gap-5 text-lg mt-6">
//   <a href="#" className="hover:text-blue-500" target="_blank" rel="noopener noreferrer">
//     <FaFacebookF />
//   </a>
//   <a href="#" className="hover:text-sky-400" target="_blank" rel="noopener noreferrer">
//     <FaTwitter />
//   </a>
//   <a
//     href="https://www.instagram.com/fidelitus.corp?igsh=MjJ3ZHhpNXpnNzEw"
//     className="hover:text-pink-500"
//     target="_blank"
//     rel="noopener noreferrer"
//   >
//     <FaInstagram />
//   </a>
//   <a href="#" className="hover:text-blue-400" target="_blank" rel="noopener noreferrer">
//     <FaLinkedinIn />
//   </a>
// </div>

//       </div>

//       {/* Copyright */}
//       <div className="px-6 mt-8 text-xs text-center text-gray-200 border-t border-gray-400 pt-4">
//         ©️ 2025 Fidelitus Real Estate Transaction Services. All Rights Reserved.
//       </div>
//     </footer>
//   );
// }









//============================>>> Old 




// import { useState } from "react";
// import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

// export default function Footer() {
//   const [openSection, setOpenSection] = useState(null);

//   const toggleSection = (section) => {
//     setOpenSection(openSection === section ? null : section);
//   };

//   return (
//     <footer className="bg-[#16607B] text-white pt-10">
//       {/* Brand */}
//       <div className="px-6 text-center md:text-left mb-8">
//         <h1 className="relative inline-block text-4xl md:text-6xl font-extrabold tracking-wider drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
//           <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-white to-teal-200">
//             Fidco
//           </span>
//           <span className="absolute text-white left-1 top-1 opacity-10">Fidco</span>
//         </h1>
//         <p className="mt-2 text-sm tracking-widest uppercase text-gray-200">
//           Redefining Real Estate
//         </p>
//       </div>

//       {/* Footer Sections */}
//       <div className="px-6 mx-auto max-w-7xl">
//         {/* Address */}
//         <div className="mb-6">
//           <h4 className="mb-2 font-semibold">Bangalore</h4>
//           <p className="leading-relaxed text-sm">
//             Fidelitus Corp, Brigade Software Park, No. 43, Ground/First Block,
//             <br />
//             27th Cross, Banashankari 2nd Stage,
//             <br />
//             Bangalore - 560070, Karnataka.
//           </p>
//           <p className="mt-2 text-sm">📞 +91 9663022237</p>
//           <p className="text-sm">✉️ info@fidelituscorp.com</p>
//         </div>

//         {/* Mobile Accordion */}
//         <div className="md:grid md:grid-cols-3 md:gap-8">
//           {[
//             {
//               title: "Quick Links",
//               items: ["Home", "About", "Why Us", "Contact Us", "Our Blogs", "Careers"],
//             },
//             {
//               title: "Services",
//               items: ["HR Labs", "Projects", "Facility Management", "Fidelitus Gallery"],
//             },
//             {
//               title: "Transactions",
//               items: ["Shilpa Foundation"],
//             },
//           ].map((section, index) => (
//             <div key={index} className="mb-4 md:mb-0">
//               {/* Header clickable on mobile */}
//               <h4
//                 className="flex items-center justify-between font-semibold cursor-pointer md:cursor-default md:mb-2"
//                 onClick={() => toggleSection(index)}
//               >
//                 {section.title}
//                 <span className="md:hidden">{openSection === index ? "−" : "+"}</span>
//               </h4>

//               {/* Items */}
//               <ul
//                 className={`mt-2 space-y-2 md:mt-0 md:space-y-2 overflow-hidden transition-all duration-300 ${
//                   openSection === index || window.innerWidth >= 768 ? "max-h-96" : "max-h-0"
//                 }`}
//               >
//                 {section.items.map((item, i) => (
//                   <li
//                     key={i}
//                     className="text-sm hover:text-yellow-300 cursor-pointer"
//                   >
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* Social Icons */}
//         <div className="flex justify-center gap-4 mt-6 md:justify-start">
//           {[
//             { icon: "fab fa-facebook", link: "#" },
//             { icon: "fab fa-instagram", link: "#" },
//             { icon: "fab fa-linkedin", link: "#" },
//           ].map((social, i) => (
//             <a
//               key={i}
//               href={social.link}
//               className="p-2 transition bg-white rounded-full hover:bg-yellow-300"
//             >
//               <i className={`${social.icon} text-[#16607B]`} />
//             </a>
//           ))}
//         </div>
//       </div>

//       {/* Copyright */}
//       <div className="px-6 mt-8 text-xs text-center text-gray-200 border-t border-gray-400 pt-4">
//         ©️ 2025 Fidelitus Real Estate Transaction Services. All Rights Reserved.
//       </div>
//     </footer>
//   );
// }
