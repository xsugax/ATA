import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "All Talents Agency — Global Celebrity Booking Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0F1419",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(112,143,168,0.18) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(232,237,245,0.06) 0%, transparent 50%)",
          }}
        />

        {/* Top label */}
        <p
          style={{
            color: "#708FA8",
            fontSize: 18,
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            marginBottom: 24,
            margin: "0 0 24px 0",
          }}
        >
          ALL TALENTS AGENCY · ATA
        </p>

        {/* Headline */}
        <h1
          style={{
            color: "#E8EDF5",
            fontSize: 68,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.1,
            margin: "0 0 20px 0",
            maxWidth: 900,
          }}
        >
          Meet the people who{" "}
          <span style={{ color: "#708FA8" }}>change the world.</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: "rgba(232,237,245,0.55)",
            fontSize: 26,
            textAlign: "center",
            margin: "0 0 40px 0",
            maxWidth: 700,
          }}
        >
          166+ Verified A-List Profiles · Private Events · Corporate Summits
        </p>

        {/* Divider line */}
        <div
          style={{
            width: 80,
            height: 2,
            background: "#708FA8",
            marginBottom: 32,
          }}
        />

        {/* Domain */}
        <p
          style={{
            color: "#708FA8",
            fontSize: 20,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
          }}
        >
          ALLTALENTSAGENCY.COM
        </p>
      </div>
    ),
    { ...size }
  );
}
