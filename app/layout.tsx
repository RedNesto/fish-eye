import type { Metadata } from "next";
import "./globals.css";
import { DmSans } from "@/app/fonts";

export const metadata: Metadata = {
    title: "FishEye",
    description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="fr" className={DmSans.className}>
        <body>{children}</body>
        </html>
    );
}
