# Demandes d’e-book — production

Le formulaire de `the-body-healer.com` appelle le Worker `jordan-carter`.
Il enregistre la demande dans la base privée D1 `jordan-ebook` (Union européenne),
avant d’appeler Resend. Il n’appelle pas de webhook intermédiaire. Aucune liste
de contacts n’est exposée sur le site. Les seules données saisies conservées
sont l’adresse et le prénom ; aucune adresse IP ni donnée de suivi publicitaire.

L’adresse du PDF (`EBOOK_URL`) et la clé d’envoi (`RESEND_API_KEY`) sont dans
les secrets du Worker. Le fournisseur doit accepter le message avant que la
réponse au navigateur indique un succès. Cela ne prouve pas sa réception en boîte.
Les tentatives transitoires sont reprises par le Worker toutes les dix minutes,
dans la fenêtre d’idempotence du fournisseur ; une erreur permanente ne boucle pas.
Le même destinataire n’obtient pas de second envoi dans la journée suivant sa demande.
Les demandes sont effacées après 90 jours par la même tâche planifiée.

Pour l’exploitant autorisé : tableau Cloudflare du client → D1 → `jordan-ebook`.
Contrôle sans coordonnées :

```sql
SELECT count(*) AS demandes, count(sent_at) AS acceptees,
       count(*) FILTER (WHERE sent_at IS NULL AND next_attempt IS NOT NULL) AS a_reprendre,
       count(*) FILTER (WHERE sent_at IS NULL AND next_attempt IS NULL) AS refusees
FROM ebook_requests;
```

`pnpm test:ebook` utilise SQLite en mémoire et un transport simulé. Appliquer
`pnpm exec wrangler d1 migrations apply EBOOK_DB --remote` avant la première
publication GitHub. Le déploiement du site et de sa tâche planifiée passe par
la branche `main`. L’ancien hébergement Vercel est suspendu et ne dispose pas
de la liaison D1 : pour revenir en arrière, préférer une version Worker compatible.
