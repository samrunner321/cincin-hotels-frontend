'use client';

// Import von Navbar und Footer entfernt, da sie bereits im globalen Layout enthalten sind

export default function Layout({ children }) {
  return (
    <>
      {/* Navbar wird im globalen Layout bereits gerendert */}
      {children}
      {/* Footer wird im globalen Layout bereits gerendert */}
    </>
  );
}