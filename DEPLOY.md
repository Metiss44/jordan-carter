# 🚀 Guide de Déploiement Vercel - The Body Healer

> **Archive de l’ancien hébergement.** Vercel est suspendu. Pour la production
> actuelle, les contrôles sans faux prospect et la publication par GitHub,
> voir [Demandes d’e-book — production](EBOOK.md).

## 📋 Prérequis

- ✅ Code pushé sur GitHub : https://github.com/Metiss44/jordan-carter
- ✅ Compte Vercel (gratuit) : https://vercel.com
- ✅ Clé API Resend : https://resend.com/api-keys
- ✅ Fichier `public/ebook.pdf` (1.1 Mo) présent dans le repo

---

## 🔗 Étape 1 : Connecter le Repo à Vercel

### Option A : Via le Dashboard Vercel (Recommandé)

1. **Aller sur Vercel** : https://vercel.com/dashboard
2. Cliquer sur **"Add New..."** → **"Project"**
3. **Importer depuis GitHub** :
   - Autoriser Vercel à accéder à ton compte GitHub
   - Sélectionner le repo `Metiss44/jordan-carter`
4. **Configuration du projet** :
   - Framework Preset: **Next.js** (détecté automatiquement)
   - Root Directory: `./` (par défaut)
   - Build Command: `npm run build` (par défaut)
   - Output Directory: `.next` (par défaut)
5. **Ne pas déployer tout de suite** → cliquer sur **"Environment Variables"** d'abord

---

## ⚙️ Étape 2 : Configurer les Variables d'Environnement

### Variables Obligatoires

Avant de déployer, ajoute ces variables dans l'onglet **Environment Variables** :

#### 1. `RESEND_API_KEY` (Obligatoire)
- **Description** : Clé API secrète pour envoyer des emails via Resend
- **Valeur** : `re_xxxxxxxxxxxxx` (obtenue sur https://resend.com/api-keys)
- **Environment** : ✅ Production, ✅ Preview, ✅ Development
- ⚠️ **Ne PAS préfixer avec `NEXT_PUBLIC_`** (doit rester secrète)

#### 2. `NEXT_PUBLIC_BASE_URL` (Recommandé)
- **Description** : URL publique du site pour générer les liens dans les emails
- **Valeur Production** : `https://ton-domaine.vercel.app` ou ton domaine custom
- **Valeur Preview** : Laisser vide (Vercel utilisera l'URL de preview)
- **Valeur Development** : `http://localhost:3000`
- **Environment** : ✅ Production

### Comment ajouter les variables

1. Dans l'écran de configuration du projet Vercel
2. Scroll jusqu'à **"Environment Variables"**
3. Cliquer sur **"Add"** :
   ```
   Key: RESEND_API_KEY
   Value: re_your_actual_key_here
   Environments: [x] Production [x] Preview [x] Development
   ```
4. Cliquer sur **"Add"** à nouveau :
   ```
   Key: NEXT_PUBLIC_BASE_URL
   Value: https://ton-domaine.vercel.app
   Environments: [x] Production
   ```

---

## 🎯 Étape 3 : Déployer

1. Après avoir ajouté les variables, cliquer sur **"Deploy"**
2. Vercel va :
   - Cloner le repo
   - Installer les dépendances (`npm install`)
   - Build le projet Next.js (`npm run build`)
   - Déployer sur un domaine `.vercel.app`

⏱️ **Durée** : 1-2 minutes

---

## 📧 Étape 4 : Configurer Resend (Important pour la Délivrabilité)

### Option A : Utiliser un Domaine Custom (Recommandé pour Production)

1. **Aller sur Resend** : https://resend.com/domains
2. **Ajouter ton domaine** : `the-body-healer.com` (ou celui que tu veux)
3. **Configurer les DNS** :
   - Ajouter les enregistrements SPF, DKIM, DMARC fournis par Resend
   - Exemples :
     ```
     Type: TXT
     Name: @
     Value: v=spf1 include:resend.com ~all
     
     Type: TXT
     Name: resend._domainkey
     Value: [clé DKIM fournie par Resend]
     ```
4. **Vérifier le domaine** dans Resend (peut prendre quelques minutes)
5. **Modifier l'expéditeur** dans `app/api/send-ebook/route.ts` :
   ```typescript
   from: 'Jordan Carter <jordan@the-body-healer.com>'
   ```

### Option B : Utiliser le Domaine de Test Resend (Pour Démarrer)

- Par défaut, Resend fournit un domaine de test
- L'email sera envoyé depuis `onboarding@resend.dev`
- ⚠️ Moins professionnel, peut finir en spam
- Parfait pour tester avant de configurer ton domaine

---

## ✅ Étape 5 : Tester l'Envoi d'Email

### 1. Vérifier que le PDF est accessible

Ouvrir dans le navigateur :
```
https://ton-domaine.vercel.app/ebook.pdf
```

✅ Le PDF doit se télécharger

### 2. Tester le formulaire

1. Aller sur ton site : `https://ton-domaine.vercel.app`
2. Scroll jusqu'au formulaire
3. Entrer :
   - Prénom : `Test`
   - Email : `ton-email@example.com`
4. Cliquer sur **"Je veux recevoir l'e-book"**
5. Vérifier ta boîte mail (peut prendre 1-2 minutes)

### 3. Vérifier les Logs

Si l'email n'arrive pas :
1. **Dashboard Vercel** → ton projet → **"Deployments"** → dernier déploiement → **"Functions"** → `/api/send-ebook`
2. Voir les logs d'erreur éventuels
3. **Dashboard Resend** → **"Logs"** → vérifier le statut de l'email

---

## 🔧 Configuration Avancée (Optionnel)

### Domaine Custom sur Vercel

1. **Dashboard Vercel** → ton projet → **"Settings"** → **"Domains"**
2. Ajouter ton domaine : `the-body-healer.com`
3. Configurer les DNS chez ton registrar :
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.21.21
   ```
4. Mettre à jour `NEXT_PUBLIC_BASE_URL` :
   ```
   NEXT_PUBLIC_BASE_URL=https://the-body-healer.com
   ```

### Analytics Vercel (Gratuit)

1. **Dashboard Vercel** → ton projet → **"Analytics"**
2. Activer **Vercel Analytics**
3. Dans `app/layout.tsx`, ajouter :
   ```typescript
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

---

## 🐛 Troubleshooting

### Erreur : "RESEND_API_KEY not set"
- ✅ Vérifier que la variable est bien ajoutée dans Vercel
- ✅ Redéployer après avoir ajouté la variable
- ✅ Vérifier qu'elle n'a pas de `NEXT_PUBLIC_` devant

### Erreur : "PDF not found (404)"
- ✅ Vérifier que `public/ebook.pdf` existe dans le repo
- ✅ Commit et push le fichier si manquant
- ✅ Vérifier l'URL : `https://ton-domaine.vercel.app/ebook.pdf`

### Email va en spam
- ✅ Configurer SPF/DKIM sur ton domaine via Resend
- ✅ Utiliser une adresse `@ton-domaine.com` au lieu de `@resend.dev`
- ✅ Éviter les mots spam dans le sujet/contenu
- ✅ Demander aux utilisateurs d'ajouter ton email aux contacts

### Build échoue sur Vercel
- ✅ Vérifier les erreurs TypeScript localement : `npm run build`
- ✅ Vérifier que toutes les dépendances sont dans `package.json`
- ✅ Check les logs de build dans Vercel

---

## 📱 Commandes Rapides

### Développement Local

```bash
# Installer les dépendances
npm install

# Créer .env.local
cat > .env.local << EOF
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RESEND_API_KEY=re_your_key_here
EOF

# Lancer le serveur
npm run dev

# Ouvrir http://localhost:3000
```

### Build de Production (Test Local)

```bash
# Build
npm run build

# Démarrer en mode production
npm start
```

### Redéployer sur Vercel

```bash
# Via Git (recommandé)
git add .
git commit -m "Update site"
git push origin main

# Vercel redéploiera automatiquement

# Ou via CLI
npx vercel --prod
```

---

## 📊 Checklist de Déploiement

Avant de mettre en production, vérifier :

- [ ] `public/ebook.pdf` est présent dans le repo
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Clé API Resend valide et active
- [ ] Domaine configuré (SPF/DKIM) pour éviter spam
- [ ] Test d'envoi d'email réussi
- [ ] PDF accessible via l'URL publique
- [ ] Formulaire fonctionne sur mobile
- [ ] Messages d'erreur clairs pour l'utilisateur
- [ ] Analytics configurées (optionnel)

---

## 🎉 C'est Prêt !

Une fois déployé, ton site sera accessible sur :
- **URL Vercel** : `https://jordan-carter-xxx.vercel.app`
- **Domaine custom** (si configuré) : `https://the-body-healer.com`

Les utilisateurs pourront :
1. ✅ Remplir le formulaire
2. ✅ Recevoir l'email avec le lien PDF
3. ✅ Télécharger l'e-book

---

## 📞 Support

- **Docs Vercel** : https://vercel.com/docs
- **Docs Next.js** : https://nextjs.org/docs
- **Docs Resend** : https://resend.com/docs
- **Repo GitHub** : https://github.com/Metiss44/jordan-carter

---

**Bon déploiement ! 🚀**
