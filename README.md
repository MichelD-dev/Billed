<a name="readme-top"></a>

# Billed

#### SaaS RH de gestion de notes de frais

#### Formation OpenClassrooms

#### Développeur d'applications JavaScript React

#### - Projet 9 -

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## L'architecture du projet :

Ce projet, dit frontend, est connecté à un service API backend que vous devez aussi lancer en local.

Le projet backend se trouve ici: https://github.com/MichelD-dev/Billed-Back.git

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Organiser son espace de travail :

Pour une bonne organisation, vous pouvez créer un dossier bill-app dans lequel vous allez cloner le projet backend et par la suite, le projet frontend:

Créer un dossier Bill-App

L’initialiser :

```
$ git init
```

Copier le code Backend :

```
$ git clone https://github.com/MichelD-dev/Billed-Back.git
```

Copier le code frontend :

```
$ git clone https://github.com/MichelD-dev/Billed.git
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

Ouvrir chaque dossier dans un terminal différent :

- Terminal 1:

```
$ cd Billed-app-FR-Back
$ npm i
$ npm i -g sequelize
$ npm i -g sequelize-cli
$ npm i -g jest
$ npm install -g win-node-env
```

Ouvrir le fichier « package.json » et ajouter les commandes suivantes SANS ESPACE AVANT "&&"

```
"test": set NODE_ENV=test&& sequelize-cli db:migrate&& jest test -i tests/user.test.js --watch
"run:dev": "set NODE_ENV=development&& sequelize-cli db:migrate&& node server.js
```

Pour lancer le back:

```
$ npm run run:dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

- Terminal 2:

```
$ cd Billed-app-FR-Front
$ npm install
$ npm install -g live-server
```

Pour lancer le front:

```
$ live-server
```

Si le site n’est pas lancé automatiquement :
Ouvrir le navigateur à l'adresse: http://127.0.0.1:8080/

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Comment lancer tous les tests en local avec Jest ?

```
$ npm run test
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Comment lancer un seul test ?

Installez jest-cli :

```
$ npm i -g jest-cli
$ jest src/__tests__/your_test_file.js
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Comment voir la couverture de test ?

`http://127.0.0.1:8080/coverage/lcov-report/`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Comptes et utilisateurs :

Vous pouvez vous connecter en utilisant les comptes:

### administrateur :

```
utilisateur : admin@test.tld
mot de passe : admin
```

### employé :

```
utilisateur : employee@test.tld
mot de passe : employee
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>
