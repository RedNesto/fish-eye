import styles from "./PhotographerCard.module.css";
import { Photographer } from "@/generated/prisma/client";
import Link from "next/link";
import Image from "next/image";

export default function PhotographerCard({ photographer }: { photographer: Photographer }) {
    return (
        <Link className={styles.card} href={`/photographer/${photographer.id}`}>
            <Image src={`/assets/${photographer.portrait}`} alt={`Portrait de ${photographer.name}`} width={200} height={200} loading="eager" fetchPriority="high"/>
            <h2>{photographer.name}</h2>
            <p className={styles.location}>{photographer.city}, {photographer.country}</p>
            <p className={styles.tagline}>{photographer.tagline}</p>
            <p className={styles.price}>{photographer.price}€/jour</p>
        </Link>
    );
}
