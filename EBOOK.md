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
Les demandes de la base privée sont effacées après 90 jours par la même tâche planifiée.

## Tableau de suivi de Jordan

Chaque demande distincte ajoute **Prénom / Mail / Date**, dans cet ordre, à la
suite de « Mailing The Body Healer », onglet `Sheet1`, à la racine de Mon Drive
du compte professionnel. La date est celle du formulaire, au format ISO en UTC
comme dans l’historique. Un prénom est écrit comme texte, jamais comme formule.
Le partage en lecture à toute personne ayant le lien a été conservé à la demande
de Matiss. Ne pas publier le lien. L’identité propre au site est éditrice du
document ; le site demande uniquement l’autorisation Google Sheets.

Les déclencheurs de `0002_ebook_sheet_outbox.sql` mettent en attente une ligne
dans la même transaction que la capture, y compris lors d’une nouvelle demande
du même destinataire après 24 h. Le double clic, le renvoi du formulaire pendant
ces 24 h et les reprises du mail gardent la même demande. La synchronisation
démarre en arrière-plan. Le visiteur n’attend que l’acceptation du mail ; une
indisponibilité de Google ne renvoie jamais le mail. Le cron relève les lignes
dues toutes les dix minutes, par lots de quatre, avec des délais croissants.

L’insertion de la ligne et celle de son repère invisible forment une seule
opération Google. Après une réponse perdue, le site retrouve le repère au lieu
de réinsérer la ligne. La copie du prénom et du mail dans la file est effacée
après confirmation. Au terme des 90 jours, le site vérifie le repère et
l’empreinte des trois cellules avant de les vider. Il conserve les notes des
autres colonnes et ne purge pas les lignes historiques. Si une ligne a été
modifiée à la main ou si les colonnes ont été renommées, vérifier le tableau
avant de reprendre ; en cas de panne, la purge de Google attend son retour.

## Contrôle sans coordonnées

Tableau Cloudflare du client → D1 → `jordan-ebook`. Pour la première demande
réelle, contrôler séparément l’acceptation du mail et la confirmation de
l’écriture dans le tableau :

```sql
SELECT count(*) AS demandes, count(sent_at) AS acceptees,
       count(*) FILTER (WHERE sent_at IS NULL AND next_attempt IS NOT NULL) AS a_reprendre,
       count(*) FILTER (WHERE sent_at IS NULL AND next_attempt IS NULL) AS refusees
FROM ebook_requests;

SELECT count(*) FILTER (WHERE synced_at IS NOT NULL) AS lignes_confirmees,
       count(*) FILTER (WHERE synced_at IS NULL AND requested_at > unixepoch()-90*86400) AS en_attente,
       count(*) FILTER (WHERE requested_at <= unixepoch()-90*86400) AS purges_en_attente
FROM ebook_sheet_outbox;
```

Les compteurs décrivent les enregistrements encore conservés, pas des totaux
historiques. Une ligne confirmée ne prouve pas une réception en boîte. Si la
file augmente, vérifier le droit d’édition, les trois intitulés et les erreurs
`Ebook Sheet pending` du Worker (aucune coordonnée dans ces messages).

## Tests et publication

`pnpm test:ebook` utilise SQLite en mémoire et un transport simulé.
`pnpm test:ebook-worker` construit le Worker, puis teste sa route et sa tâche
planifiée dans le moteur Cloudflare local, avec D1 éphémère et toutes les
sorties réseau interceptées, y compris OAuth, Sheets et Resend. Aucun mail ne
part. En production, contrôler les accès et les compteurs, sans faux formulaire.

Le secret d’exécution `EBOOK_SHEETS_CONFIG` regroupe `spreadsheetId`, `sheetId`,
`clientEmail`, `privateKeyId` et `privateKey`. Ne jamais le mettre dans la
construction, un fichier suivi ou une commande affichant sa valeur. Pour préparer
le secret sans changer le trafic, employer `wrangler versions secret put` via
l’entrée standard privée. Appliquer `pnpm exec wrangler d1 migrations apply
EBOOK_DB --remote` **avant** la publication GitHub. Le site et sa tâche planifiée
sont publiés ensemble par la branche `main` ; vérifier ensuite la version qui
sert le trafic, ses liaisons et son cron. L’ancien Vercel est suspendu et ne
dispose pas de D1. Une version Worker antérieure à la synchronisation continue
à envoyer le mail et à alimenter la file via les déclencheurs.
