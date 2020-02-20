# INF34207_Scheduler
Simulation d'orchestrateur de tâches

## Prérequis
* Nodejs LTS 12.x ou supérieur

## Installation
Pour installer les dépendances du projet:
```bash
npm install
```

## Utilisation

### 1) Sans compilation
Pour démarrer l'application:
```bash
npm start
```

### 1) Avec compilation
Pour démarrer l'application:

##### Pour Linux
```bash
./scheduler-linux
```

##### Pour Windows
```bash
.\scheduler-win.exe
```

##### Pour MacOS
```bash
./scheduler-macos
```

### 2) Matrice de processus
La matrice prend cette forme:

[[nom du processus, ...], [temp d'éxécution, ...], [delai de démarrage, ...]]

## Compilation

Pour générer les éxécutables, éxécutez la commande suivante:
```bash
npm run build
```
Les éxécutables se nomment respectivements:
- scheduler-linux (Pour Linux x64)
- scheduler-macos (Pour MacOS x64)
- scheduler-win.exe (Pour Windows x64)
