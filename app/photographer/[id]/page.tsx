import Header from "@/components/Header";
import styles from "./page.module.css";
import { Suspense } from "react";
import { getPhotographerById, getPhotographerMedias } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import PhotographerMediaGallery from "@/components/PhotographerMediaGallery";
import LikesDisplay from "@/components/LikesDisplay";
import { ContactButton } from "@/components/ContactFormDialog";

async function Contents({ rawPhotographerId }: { rawPhotographerId: string }) {
    const photographerId = Number.parseInt(rawPhotographerId);
    if (!Number.isSafeInteger(photographerId)) {
        notFound();
    }

    const photographer = await getPhotographerById(photographerId);
    if (!photographer) {
        notFound();
    }

    const medias = await getPhotographerMedias(photographerId);

    const totalLikes = medias.map(media => media.likes).reduce((previous, current) => previous + current, 0);

    return (
        <main className={styles.page}>
            <section className={styles.info}>
                <div>
                    <h2 className={styles.name}>{photographer.name}</h2>
                    <p className={styles.location}>{photographer.city}, {photographer.country}</p>
                    <p className={styles.tagline}>{photographer.tagline}</p>
                </div>
                <div>
                    <ContactButton photographerName={photographer.name}/>
                </div>
                <div>
                    <Image className={styles.portrait} src={`/assets/${photographer.portrait}`} alt={photographer.name} width={200} height={200}/>
                </div>
            </section>
            <PhotographerMediaGallery medias={medias}/>
            <div className={styles.stickyInfoBox}>
                <div className={styles.likes}><LikesDisplay likes={totalLikes}/></div>
                <p className={styles.dailyRate}>{photographer.price.toLocaleString("fr-FR", { currency: "EUR" })}€ / jour</p>
            </div>
        </main>
    );
}

export default async function PhotographerPage({ params }: PageProps<"/photographer/[id]">) {
    return (
        <>
            <Header/>
            <Suspense fallback={<p>Chargement...</p>}>
                {params.then(({ id }) => <Contents rawPhotographerId={id}/>)}
            </Suspense>
        </>
    );
}
