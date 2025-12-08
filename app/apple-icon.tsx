import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 110,
          background: "#1a1a1a", // Dark Ink Background
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9F8155", // Antique Bronze Text
          fontFamily: "Times New Roman, serif",
          fontWeight: 600,
        }}
      >
        C.
      </div>
    ),
    {
      ...size,
    }
  );
}
