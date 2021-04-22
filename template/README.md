# package-template

{{#git}}## initialized empty Git repository
```
git init
```
## …or create a new repository on the command line
```echo "# package-template" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:ming665/package-template.git
git push -u origin main
```
## …or push an existing repository from the command line
```git remote add origin git@github.com:ming665/package-template.git
git branch -M main
git push -u origin main
## release version and publish
```{{/git}}
```
yarn run release
```