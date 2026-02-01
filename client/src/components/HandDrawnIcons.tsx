import { useEffect, useRef } from 'react';
import rough from 'roughjs';

interface HandDrawnIconProps {
  paths: string[];
  viewBox?: string;
  className?: string;
  color?: string;
  size?: number;
  roughness?: number;
}

export function HandDrawnIcon({ 
  paths, 
  viewBox = "0 0 24 24", 
  className = "", 
  color = "currentColor", 
  size = 24,
  roughness = 1.5 
}: HandDrawnIconProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    // Clear previous rough elements
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const rc = rough.svg(svg);
    
    paths.forEach(pathData => {
      const node = rc.path(pathData, {
        stroke: color,
        strokeWidth: 1.5,
        roughness: roughness,
        bowing: 2,
      });
      svg.appendChild(node);
    });
  }, [paths, color, roughness]);

  return (
    <svg 
      ref={svgRef} 
      viewBox={viewBox} 
      width={size} 
      height={size} 
      className={className}
    />
  );
}

// Hand-drawn path data for specific icons
export const HandDrawnIcons = {
  Music: (props: any) => (
    <HandDrawnIcon 
      {...props} 
      paths={[
        "M9 18V5l12-2v13",
        "M6 15c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3v-3",
        "M18 13c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3v-3"
      ]} 
    />
  ),
  House: (props: any) => (
    <HandDrawnIcon 
      {...props} 
      paths={[
        "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        "M9 22V12h6v10"
      ]} 
    />
  ),
  Users: (props: any) => (
    <HandDrawnIcon 
      {...props} 
      paths={[
        "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
        "M9 7a4 4 0 1 0-4-4 4 4 0 0 0 4 4",
        "M23 21v-2a4 4 0 0 0-3-3.87",
        "M16 3.13a4 4 0 0 1 0 7.75"
      ]} 
    />
  ),
  Mic: (props: any) => (
    <HandDrawnIcon 
      {...props} 
      paths={[
        "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z",
        "M19 10v1a7 7 0 0 1-14 0v-1",
        "M12 18v4",
        "M8 22h8"
      ]} 
    />
  ),
  Chart: (props: any) => (
    <HandDrawnIcon 
      {...props} 
      paths={[
        "M3 3v18h18",
        "M18 17l-6-6-4 4-5-5"
      ]} 
    />
  ),
  Youtube: (props: any) => (
    <HandDrawnIcon 
      {...props} 
      paths={[
        "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z",
        "M9.75 15.02l5.75-3.27-5.75-3.27v6.54z"
      ]} 
    />
  ),
  Newspaper: (props: any) => (
    <HandDrawnIcon 
      {...props} 
      paths={[
        "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2",
        "M18 14h-8",
        "M18 18h-8",
        "M18 10h-8",
        "M18 6h-8"
      ]} 
    />
  )
};
