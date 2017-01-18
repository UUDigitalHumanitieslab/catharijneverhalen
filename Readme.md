# Catharijneverhalen

Frontend to the online storybase of the Dutch museum Catharijneconvent.
https://catharijneverhalen.hum.uu.nl/app/

This is a web application consisting of two subapplications. The `backend` operates at the server side, based on Django/Python. The `frontend` operates at the client side, based on Angular/JavaScript. The backend and frontend know very little about each other; they communicate through a resource-oriented JSON API (which isn't [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS)).

The `backend` and `frontend` directories contain separate Readme documents with further details on the respective subapplications.

The project has employed [git flow branching](http://nvie.com/posts/a-successful-git-branching-model/). You are advised to use the [git-flow tool](https://github.com/nvie/gitflow) if adopting the codebase.
