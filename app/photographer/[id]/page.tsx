import Header from "@/components/Header";
import styles from "./page.module.css";
import { getPhotographerById, getPhotographerMedias } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import PhotographerMediaGallery from "@/components/PhotographerMediaGallery";
import { ContactButton } from "@/components/ContactFormDialog";

export const instant = false;

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
                    <Image className={styles.portrait} src={`/assets/${photographer.portrait}`} alt={photographer.name} width={200} height={200} loading="eager"/>
                </div>
            </section>
            <PhotographerMediaGallery photographer={photographer} medias={medias}/>
        </main>
    );
}

export default async function PhotographerPage({ params }: PageProps<"/photographer/[id]">) {
    return (
        <>
            <Header/>
            {params.then(({ id }) => <Contents rawPhotographerId={id}/>)}
        </>
    );
}
