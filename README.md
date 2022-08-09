## News App:

Prerequisite:

-   Php >= 8 (version used 8.1.8 )
-   npm (version used 8.11.0)
-   Laravel 8 (php extensions)
-   composer (version used 2.3.10)

After downloading the zip file and extracting it open cmd and navigate to project directory run:

1. composer install

2. npm install

3. add your database configuration in .env file (HOST,PORT,DATABASE,USERNAME,PASSWORD)

4. add to .env file:

    - MIX_GIF_PROVIDER=giphy (or tenor)
    - MIX_GIPHY_API_KEY={your key}
    - MIX_TENOR_API_KEY={your key}

5. php artisan migrate

6. php artisan key:generate

7. npm run dev

8. php artisan serve

## Everything should be up and running ... Enjoy!

### website map

-   public routes:

    -   / -------------------------------------> public articles (latest articles can be created by multiple users) (public route)

    -   /articles/{slug} -----------------> show the articles by slug (public route)

-   need authentication routes:

    -   /admin/articles -----------------> user specific articles (my articles) (only of auth users)

    -   /admin/articles/{id} ----------> show articles page (only of auth users)

    -   /admin/articles/create -------> create articles (only of auth users)

-   after creating articles you will be redirected to /admin/articles (my articles)

-   (when logged in) you can go to public articles by pressing the logo in the header
