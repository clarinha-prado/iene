On server:

mkdir my_project.git
cd my_project.git
git --bare init
On client:

mkdir my_project
cd my_project
touch .gitignore
git init
git add .
git commit -m "Initial commit"
git remote add origin youruser@yourserver.com:/path/to/my_project.git
git push origin master

* se der acesso negado na hora de fazer o push, executar as linhas abaixo (ver se já existe par de chaves criada no diretório ~/.ssh

git remote rm origin
git remote add origin git@github.com:<username>/<repo>.git
cd ~/.ssh
ssh-keygen
cat ~/.ssh/id_rsa.pub

## Add this key to your github account. 
ssh -T git@github.com
git push -u origin master

* se não funcionar esse push acima, tentar fazer push pelo vs code