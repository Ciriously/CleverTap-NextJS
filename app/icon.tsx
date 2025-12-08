import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // Image element
      <div
        style={{
          fontSize: 24,
          background: "#1a1a1a", // Your "Ink" color
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#Fdfbf7", // Your "Paper" color
          borderRadius: "50%", // Circle shape
          fontFamily: "Times New Roman, serif", // Classic Serif
          fontWeight: 600,
        }}
      >
        C.
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
