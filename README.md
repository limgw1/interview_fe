# Part 1 - How to Use The Application

## Chatbot
The Chatbot is able to answer questions regarding
- Top 5 nearest branch locations to a certain place ("Which branches are the closest to Bangsar?", "Where are the locations closest to Queensbay Mall, Penang?")
- Earliest / Latest Opening / Closing hours today ("Which branch(es) close the earliest today?", "Which branch closes the latest today?")

## Map
The pins of the map are clickable, doing so will open a popup which shows
- Name of the branch
- Address of the branch
- Opening Hours of the branch
- Number of intersections that the branch has within a 5km radius

# Part 2 - Frameworks and Libraries

## Frontend - React
I have chosen to build the Front-End in React. This is due to my familiarity with React as well as its popularity, which results in it being widely supported. Furthermore, React applications are easy to deploy to GitHub Pages.

## Frontend (Map Component) - React Leaflet
Leaflet was chosen instead of paid alternatives like Google Maps API or the ArcGIS API due to cost, as React Leaflet is free. React Leaflet was also chosen instead of free alternatives like D3.js (which is primarily for generating charts) and MapLibre, as React Leaflet is easy to integrate with React. Having a map with markers is merely a matter of importing React components.

## Backend (LLM Component) - OpenAI API
The original selection was to use the HuggingFace Transformers package to import a quantized Mistral model, but the loading of the LLM alone crashed my laptop, so I resorted to OpenAI API. Additionally, deploying the backend on Heroku would cost extra to include a GPU. The LLM Component is run using OpenAI’s GPT-4o-mini model as it is cheap and fast.  
As LLMs are random in nature and it is hard to force an output, Microsoft’s Guidance is used as a wrapper to enforce specific outputs. Details can be found in [Guidance AI](https://github.com/guidance-ai/guidance).

## Backend (API) - FastAPI
FastAPI was used as it is easy to set up and lightweight. Personally, having the backend API in Python is beneficial for me because I like to use `breakpoint()` to debug code by running them line by line. Alternatively, Node.js could have been used as well, but I am more familiar with FastAPI.

## Backend (Scraper) - Selenium
The Scraper was written with Selenium, which allows for the code to interact with a headless browser. This is preferred over BeautifulSoup as the Subway website is dynamically generated with JavaScript and requires interaction with certain input boxes in the website. The opening and closing hours are parsed with a mixture of regex and LLMs. This is because I believe that the opening and closing hours should be stored , called and compared with logic in code to ensure 100% correctness of comparisons as LLMs tend to hallucinate, even with RAG improvements.

## Backend (DB) - SQLite3
SQLite was chosen because it requires no extra setup for the database. It only requires an import of an extra Python package. Should the application require a more robust database, then the choice for a relational DB would be MySQL or PostgreSQL, while non-relational DBs would be MongoDB.

## Backend (Geolocating API) - GeoAPIfy
GeoAPIfy was used to geolocate a user’s intent (e.g., if a user asked for the nearest Subway locations in Bangsar, GeoAPIfy can locate the coordinates of “Bangsar”). The choice for using this is due to the Free Tier API.

---

# Part 3 - Architecture
Due to the usage of FastAPI, the application naturally follows a microservices architecture. The following image describes the architecture of the application. 
![Design Architecture](https://i.ibb.co/35rHmYd4/image.png)

---

# Part 4 - Deployment

## Frontend Deployment
The Front-End is deployed on GitHub Pages due to its simplicity. The only requirement is to install an npm package and run a specific npm script to deploy.

## Backend Deployment
The Back-End is deployed on Heroku due to its simplicity to set up. This was chosen over alternatives like hosting the application on a cloud service like AWS EC2, which is expensive and requires significantly more time to set up.

---

# Part 5 - Considerations and Further Improvements

> **Disclaimer:** As this is just a Proof of Concept (POC) Project, factors like scalability in both infrastructure and functionality are not considered. 

## Recommendations for changes in scope of project
1. As the KL Area has too many overlapping Subway branches, there is no business benefit to see which branches have no or one intersection. The circles should also vary in size based on population density. Due to this, the opacity of the catchment area is set very low to avoid the map behind being completely obscured.

## Local LLMs
Local LLMs like Llama3.3, DeepSeek, and Grok can be implemented by leveraging Python packages like OLLaMa or HuggingFace Transformers. For a fully scalable solution, OLLaMa is recommended as it allows for implementing request queueing, key-value caching, fine-tuning, and quantization to either improve inference speed or enhance quality.

## Refined Front-End
The current front-end is done with minimal CSS and no consideration for accessibility or variable viewports (Phone, Laptop). Other user experience improvements can also be made, such as:
- Introducing a typing animation while the chatbot component is replying.
- Adding keyboard bindings like `Enter` -> Send Chat.
- Leveraging TailwindCSS for better design.

## Improve the Scraper
The current scraper heavily relies on Regular Expressions to account for multiple use cases, but even then LLMs have to help out with several cases. On top of that, the scraper is only run once, upon first startup of the application. For a long-term solution, it should be triggered to run periodically by a cron job, and the saving to DB code should be improved to automatically dedupe repeats.

## Improve Variability of Intent Classifier
Currently, the intent classifier is used to perform two critical functions for the POC:
1. Identifying opening & closing hours.
2. Finding the nearest locations.

A more robust intent classifier will involve:
- Intent stages.
- Similarity search of intents to pre-defined embeddings.
- Function **chaining** rather than just function calling.

## Improve Deployment
Hosting the application on AWS EC2 with dedicated GPU compute will allow for on-premise LLMs to ensure full data security. Performance optimization like **load balancing** and **caching** should also be implemented, along with frequent backups of the databases.

## Improve Databases
Using a dedicated database like MySQL or PostgreSQL will provide better scalability. If improved LLMs require a vectorized database, options include:
- **Pinecone** (paid service)
- **QDrant** (open-source, on-premise service)
