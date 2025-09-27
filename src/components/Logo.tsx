"use client";

interface LogoProps {
  className?: string;
  height?: string;
  width?: string;
  alt?: string;
}

export default function Logo({
  className = "h-8 w-auto",
  height,
  width,
  alt = "Coca-Cola",
}: LogoProps) {
  const logoStyle = {
    ...(height && { height }),
    ...(width && { width }),
  };

  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg"
      alt={alt}
      className={className}
      style={logoStyle}
    />
  );
}
