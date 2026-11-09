import { prisma } from "@/lib/prisma";

async function PhotographersList() {
    const photographers = (await prisma.photographer.findMany())
        .map(p => (<li key={p.id}>{p.name}</li>));

    return (
        <ul>
            {photographers}
        </ul>
    );
}

export default function Home() {
    return (<PhotographersList/>);
}
