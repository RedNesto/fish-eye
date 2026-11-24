# FishEye

## Développement

1. Copier le fichier `.env.template` sous le nom `.env`.
2. `npm install` pour installer les dépendances.
3. `npx prisma generate` pour générer les fichiers utilisés pour Prisma.
4. `npm run dev` pour lancer le projet en mode développement.
  - OU : `npm run build && npm run start` pour lancer le projet en mode production.

## Accessibilité

Le site est entièrement utilisable par clavier (touches TAB, Entrée et Echap) et est compréhensible avec l'utilisation
d'un lecteur d'écran seul.

## Notes techniques

Le projet a été initialisé en utilisant le starter kit officiel de Next.js, et toutes les références à Tailwind ont été
supprimées puisque je ne comptais pas l'utiliser.

Les bonnes pratiques ont été appliquées autant que possible et le linter ne relève aucune erreur ou avertissement problématique.
Le seul avertissement qui a été supprimé est lié à l'utilisation de `<img>` au lieu du `<Image>` de Next
dans la lightbox, qui ne me semble pas adapté dans ce cas.

Le code est énormément modularisé. La plupart du code se trouve dans des composants, chacun avec son propre fichier css,
ce qui permet au code des pages d'être très court.

## Utilisation de l'IA

L'IA a eu un très petit rôle dans le développement du projet, seulement pour 2 choses :
- comme point de départ pour remplir les trous dans l'accessibilité
- pour un premier jet du `<select>` personnalisé de tri des médias, qui a dû être énormément retouché pour
correspondre à la maquette
