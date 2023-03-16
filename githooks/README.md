# Creating the hook on the remote server

Create a bare git repo:

```sh
mkdir dapsboard.git
cd dapsboard.git
git init --bare
```

Create post-receive hook file

```sh
cd hooks
touch post-receive
```

Copy contents of [post-receive](./post-receive) to this file. 

Please make sure that you:
- Update the `branch` variable to reflect which one the remote is, i.e. either
  `dev` or `staging`
- Set the `MONGO_ROOT_USER` and `MONGO_ROOT_PASSWORD` variables in the script

Then make executable:

```
sudo chmod +x post-receive
```

Clone the bare repo:

```
cd $HOME
git clone dapsboard.git
```

Make sure that docker is part of the sudo group:

```sh
sudo groupadd docker
sudo usermod -aG docker $USER
```

And you're done. The GH action will take care of the rest.