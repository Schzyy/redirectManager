CloudComputing SS24 

Szymon Tschöpe 35919
Felix Dietenberger 35921
Elia Schmid 35823

Abgabe Docker Tag 1
Redirect Manager


Kleine Tutorial 
        Der Command wurde benutzt: 
        docker run -d --name redirectmanager -p 3000:3000 -v /docker/redirectData.json:/usr/src/app/data.json -e PORT=3000 -e BEARER_TOKEN=TOKEN redirectmanager
    - GET Localhost/:slug
    - GET Localhost/entry
    - POST Localhost/entry body: 
        {
            "slug": "yahoo",
            "url": "https://yahoo.com/"
        }
    . DELETE Localhost/entry/:slug