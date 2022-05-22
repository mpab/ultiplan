# ultiplan

- time management
- planning
- tracking

[project tracker](./tracker.md)

---

## Installation

Prereqisites

- npm
- yarn


```sh
yarn install
npm link
```

---

## Usage

```sh
tasks
```

---

## link/unlink commands using npm
```sh
# list all linked modules
npm ls -g --depth=0 --link=true
# or...
npm ls --global

# unlink
npm unlink {project}

# if unlink doesn't work
npm r {project} -g

# link (alias) - run from project directory
npm link

```
