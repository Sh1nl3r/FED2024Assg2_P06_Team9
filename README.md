# FED2024Assg2_P06_Team9
FED_Assignment2 - Mokesell Online Webpage

Github Link: https://github.com/Sh1nl3r/FED2024Assg2_P06_Team9.git

MokeSell is an online website allowing users to buy, view and sell second-hand items. The project aims to have basic and advanced features using HTML, CSS, JavaScript and Json to integrate these features onto our website. 

The website aims to incorporate what we had previously learned in class to utilise RestDB to our advantage to store and retrieve data rather than keeping it on our local storage. The usage of API allowed us to implement different features we has set out to do such as account management, listing management, and various other features to make our website as interactive as possible. 

The website also aimed to be simple to use and easy to understand in order to be more user friendly. The navigaton bar, search bar and support and feedback forms allows users to move around the site easily without too much difficulty with understanding which page links to what and how to access certain pages.

## Design Process

The website uses a light colored theme throughout its listings in the form of grey, backgrounds in the form of white and the navigation bar which stands out in the form of black. Furthermore, the colors are easy on the eye and consistent throughout the different pages. For example, listings, whether they are on the index page or listing page, will always be made in a way where the listing cards will look the same and are of similar dimensions and colors. The consistency in the different elements on the pages through the use of our CSS files allows for them to be easily recognisable and easily editable if any changes are needed. The design is also created in a way that supports both mobile and desktop view.

 - Figma Wireframe Link: https://www.figma.com/design/72udizVfhWFzalsKtOkbvW/FED_Assignment_2?node-id=0-1&t=AqTkwZSsbz4gZJ29-1 

## Features

### Account Management
 - Users can create an account with a username and save a password for logging in.
 - Users can also view their username, email, profile picture, points the account has as well as the listings that they have made inside of the profile page.
### User Interaction
 - Users can review other users after a deal has been finalised by giving them a star rating and choosing which trait to give them.
 - Users can click on the chat button which allows them to access the messaging page.
 - 	Navigation bar works across all pages which allows user to easily navigate through the website.
 - 	A slight gamification feature allows users to spin the wheel after filling in a feedback form, which will earn them points that will be credited to their account for discounts.
### Listings
 - Users can make and view listings which include the listings category, price, description, quality, how long ago it was posted and preferred deal method (meet-up, mail etc)
 - Listings can be searched for using the search bar or found by accessing the category page.
 - Users are also able to edit their listings where necessary.•	Users are also able to edit their listings where necessary.
 - Users are able to bump their listings by the given amounts after selecting to bump them in the profile page.
 - After clicking on a listing, it will bring the user to a seperate page where they are able to see more on the listing details.
### Support 
 - Users can submit forms to contact the staff if they have any questions or submit any bug reports as well as provide any feedback regarding the site.

### Unsupported Features
While we had high aspiratons to add in more fearures to our site, we were limited by the use of RestDB since it was the free version and despite our best efforts there were some features that are available in website but not fully working.
 - Despite using AI, we were unable to upload photos and retrieve them from our database, we had also chosen not to store them in our local devices in the images folder since that would be hardcoding and primarily since our listings details only came from our RestDB database.
 - When clicking on Edit Profile in the profile page. The external page will fetch the user's profile details, however there is an unsolved error when clicking on the save changes button to update the user's details.
 - Our chat function is only a one way system since we were unable to find out how to create a chat between one user and another by creating a field that links to a collection in RestDB.
 - While the review collection saves the review and star rating, we failed to find a way to link it to the sellers account to display the number of reviews under their account as well as the average rating of the seller.
 - While bump is able to edit the listing details in the form of an integer, we did not manage to find a way to link it to the carousel by only displaying listings that were in the top 5 in terms of the bump integer number.

## Technologies Used

HTML: Gave the webpage its sturcture which had held the main content of the webpage such as classes and forms and divisions and also where the CSS and JavaScript files were referenced.
CSS: Used to give the website life through the use of colors and formatting and styling which allowed the website to be interactive and more appealing.
JavaScript: Played a massive role in bringing the website to life as it allowed us to connect to our RestDB which enabled us to fetch and put and create objects in our database such as lisitings and accounts. Furthermore, it allowed for our website to be more interactive between the user and also change the details of the website based on the user's actions (create lisiting, edit listing, profile info).

## Assistive AI
Part of the project was possible due to the usage of open source AI, namely ChatGpt. The usage of AI allowed us to learn and understand how the fetching and creation of objects such as accounts or feedback or listings work and also helped us to create certain features such as carousel and spin the wheel (gamification feature) to allow our website to be more interactive with the user.

## Credits

### Media
The profile picture used in this site were obtained from
 - Random Profile Picture API: https://randomuser.me/api/
