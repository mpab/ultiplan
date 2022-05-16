# ultiplan

- time manadement
- planning
- tracking

## link/unlink commands using npm
```sh
# list all linksed modules
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
