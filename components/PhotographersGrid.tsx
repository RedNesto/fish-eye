import styles from "./PhotographersGrid.module.css";
import PhotographerCard from "@/components/PhotographerCard";
import { getAllPhotographers } from "@/lib/prisma";

export default async function PhotographersGrid() {
    const cards = (await getAllPhotographers())
        .map(p => <PhotographerCard key={p.id} photographer={p}/>);
    return (<main className={styles.content}><div className={styles.grid}>{cards}</div></main>);
}
