import Image from "next/image";

interface Props {
  src?: string;
  objectPosition?: string;
}

const defaultSrc = "/images/whatsapp-church.jpeg";

export default function CathedralBackground({ src, objectPosition = "center" }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <Image
        src={src ?? defaultSrc}
        alt=""
        fill
        className="object-cover"
        style={{ objectPosition }}
        sizes="100vw"
        priority
      />

      <svg
        className="absolute inset-0 w-full h-full opacity-[0.15]"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="stained-glass" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="none" />
            <path d="M0 0 L60 30 L120 0 L120 120 L0 120 Z" fill="currentColor" className="text-gold" opacity="0.15" />
            <path d="M60 30 L60 120" stroke="currentColor" className="text-gold" strokeWidth="0.5" opacity="0.2" />
            <path d="M0 0 L0 120 M120 0 L120 120" stroke="currentColor" className="text-gold" strokeWidth="0.5" opacity="0.1" />
          </pattern>
          <linearGradient id="arch-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 1, 2].map((col) => (
          <g key={col} transform={`translate(${col * 480 + 20}, 0)`}>
            <path
              d={`M${40} 700 L${40} ${250} A${200} ${200} 0 0 1 ${440} ${250} L${440} 700 Z`}
              fill="url(#arch-gradient)"
              className="text-gold"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.15"
            />
            <line
              x1={240} y1={150} x2={240} y2={400}
              stroke="currentColor" className="text-gold"
              strokeWidth="3" opacity="0.12"
            />
            <line
              x1={170} y1={260} x2={310} y2={260}
              stroke="currentColor" className="text-gold"
              strokeWidth="3" opacity="0.12"
            />
            <circle
              cx={240} cy={300} r={60}
              fill="none"
              stroke="currentColor" className="text-gold"
              strokeWidth="1.5" opacity="0.12"
            />
            <circle
              cx={240} cy={300} r={30}
              fill="none"
              stroke="currentColor" className="text-gold"
              strokeWidth="1" opacity="0.1"
            />
          </g>
        ))}

        {[0, 1, 2, 3, 4].map((row) => (
          <line
            key={`h-${row}`}
            x1={0} y1={row * 200 + 100}
            x2={1440} y2={row * 200 + 100}
            stroke="currentColor" className="text-gold"
            strokeWidth="1" opacity="0.06"
          />
        ))}
      </svg>

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E8B84B' fill-opacity='0.15'%3E%3Cpath d='M30 0L0 30l30 30 30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
    </div>
  );
}
