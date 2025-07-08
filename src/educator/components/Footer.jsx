import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-100 text-center py-3 text-sm text-blue-800">
      © {new Date().getFullYear()} SmartEd Educator Portal. All rights reserved.
    </footer>
  );
};

export default Footer;
